import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { Song } from './schemas/song.schema';

@Controller('songs')
export class SongsController {
	constructor(private readonly songsService: SongsService) {}

	// TODO: Definir controladores de songs/
	@Put(':id')
	async update(
		@Param('uuid') id: string,
		@Body() updateSongDto: UpdateSongDto,
	): Promise<Song> {
		return await this.songsService.update(id, updateSongDto);
	}
}
