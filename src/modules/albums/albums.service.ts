import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Album } from './schemas/album.schema';
import { Model } from 'mongoose';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumsService {
	constructor(@InjectModel(Album.name) private albumModel: Model<Album>) {}

	// TODO: Definir lógica de negocio de albums/
}
