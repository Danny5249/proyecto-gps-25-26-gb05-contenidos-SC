import { IsEmpty, IsNotEmpty, IsString } from 'class-validator';

export class CreateGenreDto {
	@IsEmpty()
	uuid: string;

	@IsNotEmpty()
	@IsString()
	name: string;
}
