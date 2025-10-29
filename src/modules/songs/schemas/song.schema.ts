import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type SongDocument = HydratedDocument<Song>;

@Schema({ versionKey: false })
export class Song {
	// TODO: Definir Song
}

export const SongSchema = SchemaFactory.createForClass(Song);
