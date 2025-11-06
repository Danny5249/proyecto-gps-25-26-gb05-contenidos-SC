import {
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
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './schemas/album.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../../auth/roles.decorator';
import { AuthGuard } from '../../auth/auth.guard';
import { SupabaseUser } from '../../auth/user.decorator';
import { type User as SbUser } from '@supabase/supabase-js';
import { BucketService } from '../../common/services/bucket.service';

@Controller('albums')
export class AlbumsController {
	constructor(
		private readonly albumsService: AlbumsService,
		private readonly bucketService: BucketService,
	) {}

	@Post()
	@UseInterceptors(FileInterceptor('cover'))
	@Roles(['artist'])
	@UseGuards(AuthGuard)
	@HttpCode(HttpStatus.CREATED)
	async create(
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({
						maxSize: 10 * 1024 * 1024,
					}),
					new FileTypeValidator({
						fileType: /(jpg|jpeg|png)$/,
					}),
				],
				fileIsRequired: true,
			}),
		)
		cover: Express.Multer.File,
		@Body() createAlbumDto: CreateAlbumDto,
		@SupabaseUser() sbUser: SbUser,
	): Promise<Album> {
		const album = await this.albumsService.create({
			...createAlbumDto,
			author: sbUser.id,
		});

		await this.bucketService.saveToAlbumCovers(album.uuid, cover);

		return await this.albumsService.findOneByUuidAndPopulate(album.uuid);
	}
}
