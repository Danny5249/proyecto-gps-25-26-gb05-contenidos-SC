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
	@Put(':id')
	async update(
		@Param('uuid') id: string,
		@Body() updateAlbumDto: UpdateAlbumDto,
	): Promise<Album> {
		return await this.albumsService.update(id, updateAlbumDto);
	}
}
