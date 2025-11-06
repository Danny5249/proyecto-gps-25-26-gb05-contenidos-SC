import { IsEmpty, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
	@IsEmpty()
	id?: string;

	@IsNotEmpty({ message: 'El username no puede estar vacío' })
	username: string;

	@IsNotEmpty({ message: 'La imagen no puede estar vacía' })
	imgUrl: File;
}
