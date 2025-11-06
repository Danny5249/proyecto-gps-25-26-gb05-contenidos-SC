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
	_id: string;

	@Prop({ default: () => uuidv4() })
	uuid: string;

	@Prop()
	title: string;

	@Prop({ default: Date.now() })
	releaseDate: Date;

	@Prop({ type: Types.ObjectId, ref: 'Artist' })
	author: Artist | string;

	@Prop({ default: '' })
	cover: string;

	@Prop()
	duration: number;

	@Prop({ type: [Types.ObjectId], ref: 'Song' })
	songs: Song[] | string[];

	@Prop({ type: Pricing })
	pricing: PricingType;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
