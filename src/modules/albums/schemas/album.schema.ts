import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Artist } from '../../artists/schemas/artist.schema';
import { Song } from '../../songs/schemas/song.schema';
import {
	Pricing,
	type PricingType,
} from '../../../common/schemas/pricing.schema';
import { v4 as uuidv4 } from 'uuid';

export type AlbumDocument = HydratedDocument<Album>;

@Schema({
	versionKey: false,
	toJSON: {
		transform: (doc, ret) => {
			const { _id, ...rest } = ret;
			return rest;
		},
	},
})
export class Album {
	_id: Types.ObjectId;

	@Prop({ default: () => uuidv4() })
	uuid: string;

	@Prop({ required: true })
	title: string;

	@Prop({ default: Date.now() })
	releaseDate: Date;

	@Prop({ type: Types.ObjectId, ref: 'Artist', required: true })
	author: Artist | Types.ObjectId;

	@Prop({ default: '' })
	cover: string;

	@Prop({ required: true })
	duration: number;

	@Prop({ type: [Types.ObjectId], ref: 'Song', required: true })
	songs: Song[] | Types.ObjectId[];

	@Prop({ type: Pricing, required: true })
	pricing: PricingType;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
