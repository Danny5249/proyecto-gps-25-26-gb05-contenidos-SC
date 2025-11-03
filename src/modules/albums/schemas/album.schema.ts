import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Artist } from '../../artists/schemas/artist.schema';
import { Song } from '../../songs/schemas/song.schema';
import type { PricingType } from '../../../common/schemas/pricing.schema';

export type AlbumDocument = HydratedDocument<Album>;

@Schema({ versionKey: false })
export class Album {
	@Prop()
	id: number;

	@Prop()
	title: string;

	@Prop({ required: true })
	cover: string;

	@Prop({ type: Types.ObjectId, ref: 'Artist' })
	author: Artist;

	@Prop()
	duration: number;

	@Prop()
	releaseDate: Date;

	@Prop({ type: Types.ObjectId, ref: 'Song' })
	songs: Song[];

	@Prop({ type: Types.ObjectId, ref: 'PricingSchema' })
	pricing: PricingType;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
