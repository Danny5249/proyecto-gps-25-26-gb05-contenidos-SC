import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {Product, ProductType} from './schemas/product.schema';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {InjectQueue} from "@nestjs/bullmq";
import {Queue} from "bullmq";

@Injectable()
export class ProductsService {
	constructor(
        @InjectModel(Product.name) private productModel: Model<Product>,
        @InjectQueue('productPreview') private productPreviewQueue: Queue
    ) {}

	async findAll(): Promise<Product[]> {
        return this.productModel.find();
    }

    async findOneByUuid(uuid: string): Promise<Product> {
        const product = await this.productModel.findOne({ uuid });
        if (!product) throw new NotFoundException();
        return product;
    }

    async create(createProductDto: CreateProductDto): Promise<Product> {
        // TODO: completar

        const previewJob = await this.productPreviewQueue.add('productPreview', {
            referenceType: createProductDto.referenceType,
            referenceUuid: createProductDto.reference,
            productUuid: '',
            type: ProductType
        });
        return new Product();
    }
}
