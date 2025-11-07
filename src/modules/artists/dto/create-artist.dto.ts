import { IsNotEmpty } from 'class-validator';

export class CreateArtistDto {
	@IsNotEmpty()
	uuid: string;
}
