import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import {BullModule} from "@nestjs/bullmq";
import {ProductPreviewConsumer} from "./consumers/product-preview.consumer";

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
        BullModule.registerQueue({
            name: 'productPreview',
        })
	],
	controllers: [ProductsController],
	providers: [ProductsService, ProductPreviewConsumer],
})
export class ProductsModule {}
