import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type GenreDocument = HydratedDocument<Genre>;

@Schema({ versionKey: false })
export class Genre {
	// TODO: Definir Genre
}

export const GenreSchema = SchemaFactory.createForClass(Genre);
