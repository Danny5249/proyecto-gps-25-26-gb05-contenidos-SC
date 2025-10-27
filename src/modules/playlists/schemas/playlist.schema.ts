import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type PlaylistDocument = HydratedDocument<Playlist>;

@Schema({ versionKey: false })
export class Playlist {
	// TODO: Definir Playlist
}

export const PlaylistSchema = SchemaFactory.createForClass(Playlist);
