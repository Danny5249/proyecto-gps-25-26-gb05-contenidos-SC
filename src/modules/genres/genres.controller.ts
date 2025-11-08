import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Put,
	UseGuards,
} from '@nestjs/common';
import { GenresService } from './genres.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { Roles } from '../../auth/roles.decorator';
import { AuthGuard } from '../../auth/auth.guard';

@Controller('genres')
export class GenresController {
	constructor(private readonly genresService: GenresService) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	async getGenres() {
		return this.genresService.findAll();
	}

	@Post()
	@Roles(['admin'])
	@UseGuards(AuthGuard)
	@HttpCode(HttpStatus.CREATED)
	async postGenre(@Body() createGenreDto: CreateGenreDto) {
		return this.genresService.create(createGenreDto);
	}

	@Put(':uuid')
	@Roles(['admin'])
	@UseGuards(AuthGuard)
	@HttpCode(HttpStatus.OK)
	async updateGenre(
		@Param('uuid') uuid: string,
		@Body() updateGenreDto: UpdateGenreDto,
	) {
		return this.genresService.update(uuid, updateGenreDto);
	}

	@Delete(':uuid')
	@Roles(['admin'])
	@UseGuards(AuthGuard)
	@HttpCode(HttpStatus.OK)
	async deleteGenre(@Param('uuid') uuid: string) {
		return this.genresService.deleteByUuid(uuid);
	}
}
