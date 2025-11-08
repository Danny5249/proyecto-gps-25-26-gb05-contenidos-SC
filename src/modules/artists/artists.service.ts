import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Artist } from './schemas/artist.schema';
import { Model, Types } from 'mongoose';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class ArtistsService {
	constructor(@InjectModel(Artist.name) private artistModel: Model<Artist>) {}

	async create(createArtistDto: CreateArtistDto): Promise<Artist> {
		const artist = new this.artistModel(createArtistDto);
		return await artist.save();
	}

	async findOneById(id: string): Promise<Artist> {
		const artist = await this.artistModel.findById(id);
		if (!artist) throw new NotFoundException();
		return artist;
	}

	async findOneByUuid(uuid: string): Promise<Artist> {
		const artist = await this.artistModel.findOne({ uuid });
		if (!artist) throw new NotFoundException();
		return artist;
	}

	async delete(uuid: string) {
		await this.artistModel.deleteOne({ uuid });
	}
}
