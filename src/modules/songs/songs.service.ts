import {
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Song } from './schemas/song.schema';
import { Model } from 'mongoose';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';

@Injectable()
export class SongsService {
	constructor(@InjectModel(Song.name) private songModel: Model<Song>) {}

	// TODO: Definir lógica de negocio de songs/
	async findAll(): Promise<Song[]> {
		return await this.songModel.find().exec();
	}

	async findOne(id: string): Promise<Song> {
		const song = await this.songModel.findById(id);
		if (!song) throw new NotFoundException();
		return song;
	}

	async create(createSongDto: CreateSongDto): Promise<Song> {
		const createdSong = new this.songModel(createSongDto);

		try {
			return await createdSong.save();
		} catch (error) {
			throw new InternalServerErrorException();
		}
	}
}
