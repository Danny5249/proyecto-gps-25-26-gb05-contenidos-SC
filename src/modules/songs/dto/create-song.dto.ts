import { IsDataURI, IsEmpty, IsNotEmpty } from 'class-validator';

export class CreateSongDto {
	@IsEmpty()
	id?: string;

	@IsNotEmpty({ message: 'El archivo no puede estar vacía' })
	file: string;

	@IsDataURI()
	@IsNotEmpty({ message: 'El álbum debe tener un cover' })
	cover: string;
}
