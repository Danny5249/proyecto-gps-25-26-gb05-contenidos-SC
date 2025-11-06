import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Artist } from '../../artists/schemas/artist.schema';
import {
	Pricing,
	type PricingType,
} from '../../../common/schemas/pricing.schema';

export type SongDocument = HydratedDocument<Song>;

@Schema({
	versionKey: false,
	toJSON: {
		transform: (doc, ret) => {
			const { _id, ...rest } = ret;
			return rest;
		},
	},
})
export class Song {
	@Prop({ default: uuidv4() })
	uuid: string;

	@Prop()
	title: string;

	@Prop({ default: Date.now() })
	releaseDate: Date;

	@Prop({ type: [Types.ObjectId], ref: 'Artist' })
	authors: Artist[];

	@Prop()
	cover: string;

	@Prop()
	duration: number;

	@Prop({ type: Pricing })
	pricing: PricingType;
}

export const SongSchema = SchemaFactory.createForClass(Song);
