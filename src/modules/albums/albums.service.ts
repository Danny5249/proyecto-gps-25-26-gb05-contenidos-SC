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
import { ArtistsService } from '../artists/artists.service';

@Injectable()
export class AlbumsService {
	constructor(
		@InjectModel(Album.name) private albumModel: Model<Album>,
		private readonly songsService: SongsService,
		private readonly artistsService: ArtistsService,
	) {}

	async isAuthor(artistUuid: string, albumUuid: string) {
		const artist = await this.artistsService.findOneByUuid(artistUuid);
		const album = await this.findOneByUuid(albumUuid);
		return artist._id.toString() === album.author._id.toString();
	}

	async findAll(): Promise<Album[]> {
		return this.albumModel.find();
	}

	async findOneByUuid(uuid: string): Promise<Album> {
		const album = await this.albumModel.findOne({ uuid });
		if (!album) throw new NotFoundException();
		return album;
	}

	async findOneByUuidAndPopulate(uuid: string): Promise<Album> {
		const album = await this.albumModel
			.findOne({ uuid })
			.populate('author')
			.populate({
				path: 'songs',
				populate: [{ path: 'author' }, { path: 'featuring' }],
			});
		if (!album) throw NotFoundException;
		return album;
	}

	async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
		let duration = 0;
		const songIds: Types.ObjectId[] = [];
		const author = await this.artistsService.findOneByUuid(createAlbumDto.author);

		for (const songUuid of createAlbumDto.songs) {
			const song = await this.songsService.findOneByUuid(songUuid);

			if (!(await this.songsService.isAuthor(createAlbumDto.author, songUuid))) {
				throw new UnauthorizedException();
			}

			duration += song.duration;
			songIds.push(song._id);
		}

		try {
			const createdAlbum = new this.albumModel({
				...createAlbumDto,
				author: author._id,
				songs: songIds,
				duration,
			});
			await createdAlbum.save();
			return this.findOneByUuidAndPopulate(createdAlbum.uuid);
		} catch (error) {
			throw new InternalServerErrorException();
		}
	}

	async update(uuid: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
		const album = await this.findOneByUuid(uuid);

		if (!(await this.isAuthor(updateAlbumDto.author!, uuid))) {
			throw new UnauthorizedException();
		}

		if (updateAlbumDto.songs) {
			for (const songUuid of updateAlbumDto.songs) {
				const isAuthor = this.songsService.isAuthor(
					updateAlbumDto.author!,
					songUuid,
				);
				if (!isAuthor) throw new UnauthorizedException();
			}
		}

		await this.albumModel.findOneAndUpdate(
			{ uuid },
			{ ...album, updateAlbumDto },
		);

		return this.findOneByUuidAndPopulate(uuid);
	}
}
