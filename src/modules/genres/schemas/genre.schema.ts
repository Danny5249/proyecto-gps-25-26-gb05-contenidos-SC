import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';

export type GenreDocument = HydratedDocument<Genre>;

@Schema({
	versionKey: false,
	toJSON: {
		transform: (doc, ret) => {
			const { _id, ...rest } = ret;
			return rest;
		},
	},
})
export class Genre {
	_id: Types.ObjectId;

	@Prop({ default: () => uuidv4() })
	uuid: string;

	@Prop({ required: true })
	name: string;
}

export const GenreSchema = SchemaFactory.createForClass(Genre);
