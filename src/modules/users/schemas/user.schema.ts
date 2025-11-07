import { HydratedDocument, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Playlist } from '../../playlists/schemas/playlist.schema';
import { Artist } from '../../artists/schemas/artist.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({
	versionKey: false,
	toJSON: {
		transform: (doc, ret) => {
			const { _id, ...rest } = ret;
			return rest;
		},
	},
})
export class User {
	_id: Types.ObjectId;

	@Prop({ unique: true, required: true })
	uuid: string;

	@Prop({ unique: true, required: true })
	username: string;

	@Prop({ default: '' })
	profileImg: string;

	@Prop({ type: [Types.ObjectId], ref: 'Playlist' })
	playlists: Playlist[] | Types.ObjectId[];

	@Prop({ type: [Types.ObjectId], ref: 'Artist' })
	following: Artist[] | Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
