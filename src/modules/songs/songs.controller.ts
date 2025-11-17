import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	forwardRef,
	Get,
	HttpCode,
	HttpStatus,
	Inject,
	Param,
	Post,
	Put,
	Res,
	StreamableFile,
	UnauthorizedException,
	UploadedFiles,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { Song } from './schemas/song.schema';
import { AuthGuard } from '../../auth/auth.guard';
import { Roles } from '../../auth/roles.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { BucketService } from '../../common/services/bucket.service';
import { parseBuffer } from 'music-metadata';
import { type User as SbUser } from '@supabase/supabase-js';
import { SupabaseUser } from '../../auth/user.decorator';
import { UsersService } from '../users/users.service';
import { Artist } from '../artists/schemas/artist.schema';
import type { Response } from 'express';

const validSongFormats = ['audio/mpeg', 'audio/flac'];
const validCoverFormats = ['image/jpg', 'image/jpeg', 'image/png'];

@Controller('songs')
export class SongsController {
	constructor(
		private readonly songsService: SongsService,
		private readonly bucketService: BucketService,
		private readonly usersService: UsersService,
	) {}

	@Get()
	@Roles(['artist'])
	@UseGuards(AuthGuard)
	@HttpCode(HttpStatus.OK)
	async getSongsByAuthorUuid(@SupabaseUser() sbUser: SbUser) {
		return this.songsService.findByAuthorUuid(sbUser.id);
	}

	@Get(':uuid')
	@HttpCode(HttpStatus.OK)
	async getSongByUuid(@Param('uuid') uuid: string): Promise<Song> {
		return await this.songsService.findOneByUuidAndPopulate(uuid);
	}

	@Post()
	@UseInterceptors(
		FileFieldsInterceptor(
			[
				{ name: 'file', maxCount: 1 },
				{ name: 'cover', maxCount: 1 },
			],
			{
				limits: { fileSize: 40 * 1024 * 1024 },
				fileFilter: (req, file, cb) => {
					if (
						file.fieldname === 'file' &&
						!validSongFormats.includes(file.mimetype)
					) {
						return cb(new BadRequestException(), false);
					}
					if (
						file.fieldname === 'cover' &&
						!validCoverFormats.includes(file.mimetype)
					) {
						return cb(new BadRequestException(), false);
					}

					return cb(null, true);
				},
			},
		),
	)
	@Roles(['artist'])
	@UseGuards(AuthGuard)
	@HttpCode(HttpStatus.CREATED)
	async postSong(
		@UploadedFiles()
		files: { file: Express.Multer.File[]; cover: Express.Multer.File[] },
		@Body() createSongDto: CreateSongDto,
		@SupabaseUser() sbUser: SbUser,
	): Promise<Song> {
		if (!files.file || !files.cover) throw new BadRequestException();

		const file = files.file[0];
		const cover = files.cover[0];

		const fileMetadata = await parseBuffer(file.buffer, file.mimetype);
		const duration = fileMetadata.format.duration || 0;

		const song = await this.songsService.create({
			...createSongDto,
			duration: Math.floor(duration),
			author: sbUser.id,
		});

		await this.bucketService.saveToSongFiles(song.uuid, file);
		await this.bucketService.saveToSongCovers(song.uuid, cover);

		return song;
	}

	@Put(':uuid')
	@Roles(['artist'])
	@UseGuards(AuthGuard)
	@HttpCode(HttpStatus.OK)
	async update(
		@Param('uuid') uuid: string,
		@Body() updateSongDto: UpdateSongDto,
	): Promise<Song> {
		return await this.songsService.update(uuid, updateSongDto);
	}

	@Delete(':uuid')
	@Roles(['artist'])
	@UseGuards(AuthGuard)
	@HttpCode(HttpStatus.OK)
	async deleteFromUuid(@Param('uuid') uuid: string): Promise<void> {
		return await this.songsService.deleteByUuid(uuid);
	}

	@Get(':uuid/download')
	@Roles(['user', 'artist'])
	@UseGuards(AuthGuard)
	@HttpCode(HttpStatus.OK)
	async downloadSong(
		@Param('uuid') uuid: string,
		@SupabaseUser() sbUser: SbUser,
		@Res({ passthrough: true }) res: Response,
	) {
		const song = await this.songsService.findOneByUuidAndPopulate(uuid);
		let found: boolean = false;

		if (sbUser.role === 'user') {
			const user = await this.usersService.findOneByUuidAndPopulate(uuid);
			const found = user.library.some((l) => l.item._id === song._id);
			if (!found) throw new UnauthorizedException();
		} else if (sbUser.role === 'artist') {
			const artist = await this.usersService.findOneByUuid(sbUser.id);
			if (artist.uuid !== (song.author as Artist).uuid) {
				throw new UnauthorizedException();
			}
		}
		const fileStream = await this.songsService.download(uuid);

		res.setHeader('Content-Type', 'audio/mpeg');
		return new StreamableFile(fileStream as any);
	}
}
