import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

    @Post()
	async postProduct(@Body() createProductDto: CreateProductDto) {
        await this.productsService.create(createProductDto);
    }
}
