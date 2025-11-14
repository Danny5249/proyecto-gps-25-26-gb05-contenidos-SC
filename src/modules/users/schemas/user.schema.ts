import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Playlist } from '../../playlists/schemas/playlist.schema';
import { Artist } from '../../artists/schemas/artist.schema';
import { Song } from '../../songs/schemas/song.schema';
import { Album } from '../../albums/schemas/album.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({
	_id: false,
	versionKey: false,
})
export class LibraryItem {
	@Prop({ required: true, enum: ['Song', 'Album'] })
	type: string;

	@Prop({ type: Types.ObjectId, required: true, refPath: 'library.type' })
	item: Types.ObjectId | Song | Album;
}

export const LibraryItemSchema = SchemaFactory.createForClass(LibraryItem);

@Schema({
	versionKey: false,
	toJSON: {
		transform: (doc, ret) => {
			// @ts-ignore
			const { _id, library, ...rest } = ret;
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

	@Prop({ type: [LibraryItemSchema] })
	library: LibraryItem[];
}

export const UserSchema = SchemaFactory.createForClass(User);
