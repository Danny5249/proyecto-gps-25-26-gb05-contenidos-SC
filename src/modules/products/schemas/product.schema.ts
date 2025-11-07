import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Artist } from '../../artists/schemas/artist.schema';

export enum TypeProduct {
	TSHIRT = 'tshirt',
	HOODIE = 'hoodie',
	CAP = 'cap',
	POSTER = 'poster',
	TOTEBAG = 'totebag',
	STICKERS = 'stickers',
	MOBILECASE = 'mobilecase',
	BRACELET = 'bracelet',
	MUG = 'mug',
}

export type ProductDocument = HydratedDocument<Product>;

@Schema({
	versionKey: false,
	toJSON: {
		transform: (doc, ret) => {
			const { _id, ...rest } = ret;
			return rest;
		},
	},
})
export class Product {
	_id: string;

	@Prop({ default: () => uuidv4() })
	uuid: string;

	@Prop({
		type: 'enum',
		enum: TypeProduct,
	})
	type: string;

	@Prop()
	name: string;

	@Prop()
	description: string;

	@Prop()
	price: number;

	@Prop({ type: [Types.ObjectId], ref: 'Artist' })
	author: Artist;

	@Prop({ default: [] })
	previewImgs: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
