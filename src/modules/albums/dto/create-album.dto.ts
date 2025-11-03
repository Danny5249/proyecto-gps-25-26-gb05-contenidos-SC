import { IsDataURI, IsEmpty, IsNotEmpty } from 'class-validator';

export class CreateAlbumDto {
	@IsEmpty()
	id?: number;

	@IsDataURI()
	@IsNotEmpty({ message: 'El álbum debe tener un cover' })
	cover: string;
}
