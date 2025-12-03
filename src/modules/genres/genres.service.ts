import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Genre } from './schemas/genre.schema';
import { Model } from 'mongoose';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Injectable()
export class GenresService {
	constructor(@InjectModel(Genre.name) private genreModel: Model<Genre>) {}

	async create(createGenreDto: CreateGenreDto): Promise<Genre> {
		const genre = new this.genreModel(createGenreDto);
		return await genre.save();
	}

	async findAll() {
		return this.genreModel.find();
	}

	async findOneById(id: string): Promise<Genre> {
		const genre = await this.genreModel.findById(id);
		if (!genre) throw new NotFoundException();
		return genre;
	}

	async findOneByUuid(uuid: string): Promise<Genre> {
		const genre = await this.genreModel.findOne({ uuid });
		if (!genre) throw new NotFoundException();
		return genre;
	}

	async update(uuid: string, updateGenreDto: UpdateGenreDto): Promise<Genre> {
		const genre = await this.findOneByUuid(uuid);
		if (!genre) throw new NotFoundException();
		const updatedGenre = await this.genreModel.findByIdAndUpdate(
			genre._id,
			updateGenreDto,
			{ new: true },
		);
		return updatedGenre!;
	}

	async deleteByUuid(uuid: string): Promise<void> {
		await this.genreModel.deleteOne({ uuid });
	}
}
