import { IsEmpty, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
	@IsNotEmpty()
	uuid: string;

	@IsNotEmpty()
	username: string;
}
