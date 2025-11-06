import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

	async findOneByEmail(email: string): Promise<User> {
		const user = await this.userModel.findOne({ email: email });
		if (!user) throw NotFoundException;
		return user;
	}

	async findOneById(id: string): Promise<User> {
		const user = await this.userModel.findOne({ id: id });
		if (!user) throw NotFoundException;
		return user;
	}

    async updateUser(id: string, dto: UpdateUserDto): Promise<User> {
        const user = await this.userModel.findByIdAndUpdate({id, ...dto});
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

	async insert(insertedUser: CreateUserDto): Promise<User> {
		return await this.userModel.create(insertedUser);
	}

	async remove(id: string): Promise<void> {
		await this.userModel.findByIdAndDelete(id);
	}
}
