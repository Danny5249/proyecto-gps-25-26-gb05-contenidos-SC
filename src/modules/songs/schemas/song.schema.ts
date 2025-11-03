import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Artist } from '../../artists/schemas/artist.schema';
import type { PricingType } from '../../../common/schemas/pricing.schema';

export type SongDocument = HydratedDocument<Song>;

@Schema({ versionKey: false })
export class Song {
	@Prop()
	id: number;

	@Prop()
	title: string;

	@Prop()
	releaseDate: Date;

	@Prop({ type: Types.ObjectId, ref: 'Artist' })
	authors: Artist[];

	@Prop({ required: true })
	cover: string;

	@Prop()
	duration: number;

	@Prop({ type: Types.ObjectId, ref: 'PricingSchema' })
	pricing: PricingType;
}

export const SongSchema = SchemaFactory.createForClass(Song);
