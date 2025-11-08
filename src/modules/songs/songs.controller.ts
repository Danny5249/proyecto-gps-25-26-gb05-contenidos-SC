import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	FileTypeValidator,
	Get,
	HttpCode,
	HttpStatus,
	MaxFileSizeValidator,
	Param,
	ParseFilePipe,
	Post,
	Put,
	UploadedFile,
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
import {
	FileFieldsInterceptor,
	FileInterceptor,
} from '@nestjs/platform-express';
import { BucketService } from '../../common/services/bucket.service';
import { parseBuffer } from 'music-metadata';
import { type User as SbUser } from '@supabase/supabase-js';
import { SupabaseUser } from '../../auth/user.decorator';
import { UpdateAlbumDto } from '../albums/dto/update-album.dto';
import { Album } from '../albums/schemas/album.schema';

const validSongFormats = ['audio/mpeg', 'audio/flac'];
const validCoverFormats = ['image/jpg', 'image/jpeg', 'image/png'];

@Controller('songs')
export class SongsController {
	constructor(
		private readonly songsService: SongsService,
		private readonly bucketService: BucketService,
	) {}

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
}
