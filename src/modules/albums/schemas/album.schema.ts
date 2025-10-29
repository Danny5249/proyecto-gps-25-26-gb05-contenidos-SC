import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type AlbumDocument = HydratedDocument<Album>;

@Schema({ versionKey: false })
export class Album {
	// TODO: Definir Album
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
