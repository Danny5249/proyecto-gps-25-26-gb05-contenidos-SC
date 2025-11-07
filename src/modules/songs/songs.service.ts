import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException, UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Song } from './schemas/song.schema';
import { Model } from 'mongoose';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import {ArtistsService} from "../artists/artists.service";

@Injectable()
export class SongsService {
	constructor(
        @InjectModel(Song.name) private songModel: Model<Song>,
        private readonly artistsService: ArtistsService
    ) {}

    async isAuthor(artistUuid: string, songUuid: string) {
        const artist = await this.artistsService.findOneByUuid(artistUuid);
        const song = await this.findOneByUuid(songUuid);
        return artist._id.toString() === song.author._id.toString();
    }

	async findAll(): Promise<Song[]> {
		return await this.songModel.find().exec();
	}

	async findOneByUuid(uuid: string): Promise<Song> {
		const song = await this.songModel.findOne({ uuid });
		if (!song) throw new NotFoundException;
		return song;
	}

    async findOneByUuidAndPopulate(uuid: string): Promise<Song> {
        const song = await this.songModel.findOne({ uuid }).populate(['author', 'featuring']);
        if (!song) throw new NotFoundException;
        return song;
    }

	async create(createSongDto: CreateSongDto): Promise<Song> {
        const artist = await this.artistsService.findOneByUuid(createSongDto.author);

        for (const featUuid of createSongDto.featuring) {
            if (featUuid === createSongDto.author) throw new BadRequestException;
            await this.artistsService.findOneByUuid(featUuid);
        }
        const createdSong = new this.songModel({
            ...createSongDto,
            author: artist._id
        });

		try {
			const song = await createdSong.save();
            return await this.findOneByUuidAndPopulate(song.uuid);
		} catch (error) {
			throw new InternalServerErrorException;
		}
	}

	async update(uuid: string, updateSongDto: UpdateSongDto): Promise<Song> {
        const song = await this.findOneByUuid(uuid);
        const artist = await this.artistsService.findOneById(song.author.toString());
        if (!await this.isAuthor(updateSongDto.author!, artist.uuid)) {
            throw new UnauthorizedException;
        }

		await this.songModel.findOneAndUpdate(
            { uuid },
            { ...song, updateSongDto },
        );

        return await this.findOneByUuidAndPopulate(uuid);
	}
}
