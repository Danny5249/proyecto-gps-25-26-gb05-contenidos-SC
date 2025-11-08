import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
	constructor(@InjectModel(User.name) private userModel: Model<User>) {}

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

	async updateUser(id: string, dto: UpdateUserDto): Promise<User> {
		const user = await this.userModel.findByIdAndUpdate({ id, ...dto });
		if (!user) throw new NotFoundException('User not found');
		return user;
	}

	async insert(insertedUser: CreateUserDto): Promise<User> {
		return await this.userModel.create(insertedUser);
	}

	async delete(uuid: string) {
		await this.userModel.deleteOne({ uuid });
	}

	async remove(id: string): Promise<void> {
		await this.userModel.findByIdAndDelete(id);
	}
}
