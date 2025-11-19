import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateLibraryDto } from './dto/update-library.dto';
import { SongsService } from '../songs/songs.service';
import { AlbumsService } from '../albums/albums.service';
import { Playlist } from '../playlists/schemas/playlist.schema';

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User.name) private userModel: Model<User>,
		private readonly songsService: SongsService,
		private readonly albumsService: AlbumsService,
	) {}

	async create(createUserDto: CreateUserDto): Promise<User> {
		const user = new this.userModel(createUserDto);
		return await user.save();
	}

	async findOneByEmail(email: string): Promise<User> {
		const user = await this.userModel.findOne({ email });
		if (!user) throw NotFoundException;
		return user;
	}

	async findOneByUuid(uuid: string): Promise<User> {
		const user = await this.userModel.findOne({ uuid });
		if (!user) throw NotFoundException;
		return user;
	}

	async findOneByUuidAndPopulate(uuid: string): Promise<User> {
		const user = await this.userModel
			.findOne({ uuid })
			.populate('library.item')
			.populate({
				path: 'library.item',
				populate: [{ path: 'genres' }, { path: 'author' }],
			});
		if (!user) throw NotFoundException;
		return user;
	}

	async updateUser(id: string, dto: UpdateUserDto): Promise<User> {
		const user = await this.userModel.findByIdAndUpdate({ id, ...dto });
		if (!user) throw new NotFoundException('User not found');
		return user;
	}

	async insert(insertedUser: CreateUserDto): Promise<User> {
		return await this.userModel.create(insertedUser);
	}

	async addToLibrary(uuid: string, updateLibraryDto: UpdateLibraryDto) {
		const user = await this.findOneByUuid(uuid);
		for (const item of updateLibraryDto.items) {
			if (item.type === 'song') {
				const song = await this.songsService.findOneByUuid(item.uuid);
				user.library.push({
					type: 'Song',
					item: song._id,
				});
			} else if (item.type === 'album') {
				const album = await this.albumsService.findOneByUuid(item.uuid);
				user.library.push({
					type: 'Album',
					item: album._id,
				});
			}
		}
		const updatedUser = await this.userModel.findByIdAndUpdate(user._id, user, {
			new: true,
		});

		return (await this.findOneByUuidAndPopulate(updatedUser!.uuid)).library;
	}

	async delete(uuid: string) {
		await this.userModel.deleteOne({ uuid });
	}

	async addPlaylistToUser(userUuid: string, playlist: Playlist) {
		const uuid = await this.findOneByUuid(userUuid).then((user) => user.uuid);
		const user = await this.userModel.findOne({ uuid });
		if (!user) throw new NotFoundException();

		const playlists = user.playlists as Types.ObjectId[];
		playlists.push(playlist._id);
		await user.save();
	}

	async removePlaylistToUser(sbUser: string, playlist: Playlist) {
		const uuid = await this.findOneByUuid(sbUser).then((user) => user.uuid);
		const user = await this.userModel.findOne({ uuid });

		if (!user) throw new NotFoundException();

		const playlists = user.playlists as Types.ObjectId[];
		user.playlists = playlists.filter(
			(p) => p.toString() !== playlist._id.toString(),
		);
		await user.save();
	}

	async findOneByUuidAndPopulateLibrary(uuid: string) {
		const user = await this.userModel.findOne({ uuid }).populate('playlists');
		if (!user) throw NotFoundException;
		return user;
	}
}
