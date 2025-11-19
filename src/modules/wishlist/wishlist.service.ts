import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Wishlist } from './schemas/wishlist.schema';
import { Model } from 'mongoose';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { SongsService } from '../songs/songs.service';
import { ProductsService } from '../products/products.service';
import { AlbumsService } from '../albums/albums.service';

@Injectable()
export class WishlistService {
    constructor(
        @InjectModel(Wishlist.name) private wishlistModel: Model<Wishlist>,
        private readonly songsService: SongsService,
        private readonly productsService: ProductsService,
        private readonly albumService: AlbumsService,
    ) {}

    async getWishlist(userId: string): Promise<Wishlist> {
        let wishlist = await this.wishlistModel.findOne({ userId });
        if (!wishlist) {
            wishlist = await this.wishlistModel.create({ userId, items: [] });
        }
        return wishlist;
    }

    async getItems(userId: string) {
        const wishlist = await this.getWishlist(userId);
        return wishlist.items;
    }

    async addItem(
        userId: string,
        uuid: string,
        type: 'song' | 'album' | 'product',
    ): Promise<Wishlist> {
        const wishlist = await this.getWishlist(userId);

        const exists = wishlist.items.find(i => i.uuid === uuid && i.type === type);
        if (exists) throw new BadRequestException('Item ya existe en la wishlist');

        let title = '';
        let img = '';
        let price = 0;

        if (type === 'song') {
            const song = await this.songsService.findOneByUuid(uuid);
            title = song.title;
            img = song.cover;
            price = song.pricing.digital;
        } else if (type === 'product') {
            const product = await this.productsService.findOneByUuid(uuid);
            title = product.title;
            img = '';
            price = product.price;
        } else if (type == 'album') {
            const album = await this.albumService.findOneByUuid(uuid);
            title = album.title;
            img = album.cover;
            price = album.pricing.digital;
        }

        const updatedWishlist = await this.wishlistModel.findOneAndUpdate(
            { userId },
            { $push: { items: { uuid, type, title, img, price, quantity: 1 } } },
            { new: true },
        );

        if (!updatedWishlist) throw new InternalServerErrorException();
        return updatedWishlist;
    }


    async removeItem(userId: string, uuid: string): Promise<Wishlist> {
        const updatedWishlist = await this.wishlistModel.findOneAndUpdate(
            { userId },
            { $pull: { items: { uuid } } },
            { new: true },
        );

        if (!updatedWishlist) throw new NotFoundException('Wishlist o item no encontrado');
        return updatedWishlist;
    }

    async updateItem(userId: string, updateItemDto: UpdateWishlistDto): Promise<Wishlist> {
        const wishlist = await this.getWishlist(userId);

        const index = wishlist.items.findIndex(i => i.uuid === updateItemDto.uuid);
        if (index === -1) throw new NotFoundException('Item no encontrado');

        const updatedItems = [...wishlist.items];
        updatedItems[index] = { ...updatedItems[index], ...updateItemDto };

        const updatedWishlist = await this.wishlistModel.findOneAndUpdate(
            { userId },
            { items: updatedItems },
            { new: true },
        );

        if (!updatedWishlist) throw new InternalServerErrorException();
        return updatedWishlist;
    }
}
