import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { Song } from "./schemas/song.schema";

@Controller('songs')
export class SongsController {
	constructor(private readonly songsService: SongsService) {}

    @Get(':id')
    async getSongByUuid(@Param('id') id: string): Promise<Song> {
        return await this.songsService.findOneByUuidAndPopulate(id);
    }
}
