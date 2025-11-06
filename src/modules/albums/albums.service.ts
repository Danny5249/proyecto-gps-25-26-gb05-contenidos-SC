import {
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Album } from './schemas/album.schema';
import { Model, Types } from 'mongoose';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { SongsService } from '../songs/songs.service';

@Injectable()
export class AlbumsService {
	constructor(
		@InjectModel(Album.name) private albumModel: Model<Album>,
		private readonly songsService: SongsService,
	) {}

	async findAll(): Promise<Album[]> {
		return await this.albumModel.find().exec();
	}

	async findOneByUuidAndPopulate(uuid: string): Promise<Album> {
		const album = await this.albumModel
			.findOne({ uuid })
			.populate(['songs', 'author']);
		if (!album) throw NotFoundException;
		return album;
	}

	async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
		let duration = 0;
		const songIds: string[] = [];

		for (const uuid of createAlbumDto.songs) {
			const song = await this.songsService.findOneByUuid(uuid);
			if (song.authors[0] !== createAlbumDto.author) {
				throw new UnauthorizedException();
			}
			duration += song.duration;
			songIds.push(song._id);
		}

		try {
			const createdAlbum = new this.albumModel({
				...createAlbumDto,
				songs: songIds,
				duration,
			});
			return await createdAlbum.save();
		} catch (error) {
			throw new InternalServerErrorException();
		}
	}
}
