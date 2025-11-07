import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Song } from './schemas/song.schema';
import { Model } from 'mongoose';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';

@Injectable()
export class SongsService {
	constructor(@InjectModel(Song.name) private songModel: Model<Song>) {}

	// TODO: Definir lógica de negocio de songs/
	async update(id: string, song: Song): Promise<Song> {
		const updatedSong = await this.songModel.findByIdAndUpdate(id, song, {
			new: true,
		});
		if (!updatedSong) throw new NotFoundException();
		return updatedSong;
	}
}
