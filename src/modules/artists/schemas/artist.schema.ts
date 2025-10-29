import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ArtistDocument = HydratedDocument<Artist>;

@Schema({ versionKey: false })
export class Artist {
	// TODO: Definir Artist
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);
