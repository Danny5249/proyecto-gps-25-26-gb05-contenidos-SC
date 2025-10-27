import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ versionKey: false })
export class Product {
	// TODO: Definir Product
}

export const ProductSchema = SchemaFactory.createForClass(Product);
