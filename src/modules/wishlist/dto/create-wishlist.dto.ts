import { IsNotEmpty, IsEnum } from 'class-validator';

export class CreateWishlistDto {
	@IsNotEmpty()
	uuid: string;

	@IsNotEmpty()
	title: string;

	@IsNotEmpty()
	@IsEnum(['song', 'album', 'product'])
	type: 'song' | 'album' | 'product';

	@IsNotEmpty()
	img: string;

	@IsNotEmpty()
	price: number;
}
