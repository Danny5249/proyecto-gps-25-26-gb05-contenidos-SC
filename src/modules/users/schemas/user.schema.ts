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
	_id: string;

	@Prop({ unique: true })
	uuid: string;

	@Prop({ unique: true })
	username: string;

	@Prop()
	profileImg: string;

	@Prop({ type: [Types.ObjectId], ref: 'Playlist' })
	playlists: Playlist[] | string[];

	@Prop({ type: [Types.ObjectId], ref: 'Artist' })
	following: Artist[] | string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
