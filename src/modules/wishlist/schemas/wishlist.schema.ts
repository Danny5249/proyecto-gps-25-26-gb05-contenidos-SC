import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type WishlistDocument = HydratedDocument<Wishlist>;

export interface WishlistItem {
    uuid: string;
    title: string;
    type: 'song' | 'album' | 'product';
    img: string;
    price: number;
}

@Schema({
    versionKey: false,
    toJSON: {
        transform: (doc, ret) => {
            const { _id, ...rest } = ret;
            return rest;
        }
    }
})
export class Wishlist {
    _id: Types.ObjectId;

    @Prop({ required: true, unique: true })
    userUuid: string;

    @Prop({ required: true, default: [] })
    items: WishlistItem[];
}

export const WishlistSchema = SchemaFactory.createForClass(Wishlist);
