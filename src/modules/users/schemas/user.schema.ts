import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Playlist } from "../../playlists/schemas/playlist.schema";
import { Artist } from "../../artists/schemas/artist.schema";


export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false })
export class User {
    //ID generado por Supabase
    @Prop({ required: true, unique: true })
    id: string;

    @Prop()
    username?: string;

    @Prop()
    imgUrl?: string;

    @Prop()
    playlist?: Playlist[];

    @Prop()
    following?: Artist[];
}

export const UserSchema = SchemaFactory.createForClass(User);