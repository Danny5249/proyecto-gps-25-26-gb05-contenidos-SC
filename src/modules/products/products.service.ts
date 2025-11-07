import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
	constructor(@InjectModel(Product.name) private productModel: Model<Product>) {}

	async findAll(): Promise<Product[]> {
		return await this.productModel.find().exec();
	}

	async findOneByUuid(uuid: string): Promise<Product> {
		const product = await this.productModel.findOne({ uuid });
		if (!product) throw new NotFoundException();
		return product;
	}
}
