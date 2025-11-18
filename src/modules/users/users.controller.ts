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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../../auth/roles.decorator';
import { AuthGuard } from '../../auth/auth.guard';
import { User } from './schemas/user.schema';
import { SupabaseUser } from '../../auth/user.decorator';
import { type User as SbUser } from '@supabase/supabase-js';
import { Playlist } from '../playlists/schemas/playlist.schema';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	@Roles(['admin'])
	@UseGuards(AuthGuard)
	@HttpCode(HttpStatus.CREATED)
	async postUser(@Body() createUserDto: CreateUserDto) {
		return await this.usersService.create(createUserDto);
	}

	@Delete(':uuid')
	@Roles(['admin'])
	@UseGuards(AuthGuard)
	@HttpCode(HttpStatus.OK)
	async deleteUserByUuid(@Param('uuid') uuid: string) {
		return await this.usersService.delete(uuid);
	}

	@UseGuards(AuthGuard)
	@Put(':id')
	@HttpCode(HttpStatus.OK)
	async updateUser(
		@Param('id') id: string,
		@Body() updateUserDto: UpdateUserDto,
		@SupabaseUser() sbUser: SbUser,
	): Promise<User> {
		if (sbUser.id !== id) {
			throw new Error('No tienes permiso para modificar este usuario');
		}

		return this.usersService.updateUser(id, updateUserDto);
	}

	@Get('playlists')
	@UseGuards(AuthGuard)
	@Roles(['user', 'artist'])
	@HttpCode(HttpStatus.OK)
	async getUserPlaylist(@SupabaseUser() sbUser: SbUser): Promise<Playlist[]> {
		return (await this.usersService.findOneByUuidAndPopulateLibrary(sbUser.id))
			.playlists as Playlist[];
	}
}
