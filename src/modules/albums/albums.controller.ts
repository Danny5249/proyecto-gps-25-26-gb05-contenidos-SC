import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
} from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './schemas/album.schema';

@Controller('albums')
export class AlbumsController {
	constructor(private readonly albumsService: AlbumsService) {}

	// TODO: Definir controladores de albums/
	@Post()
	async create(@Body() createAlbumDto: CreateAlbumDto): Promise<Album> {
		return await this.albumsService.create(createAlbumDto);
	}
}
