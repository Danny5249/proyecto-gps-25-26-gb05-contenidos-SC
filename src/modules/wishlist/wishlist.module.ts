import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Wishlist, WishlistSchema } from './schemas/wishlist.schema';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { HttpModule } from '@nestjs/axios';
import { ServiceTokenProvider } from '../../common/providers/service-token.provider';
import {SongsService} from "../songs/songs.service";
import {SongsModule} from "../songs/songs.module";
import {ProductsModule} from "../products/products.module";
import {AlbumsModule} from "../albums/albums.module";
import {CacheModule} from "@nestjs/cache-manager";

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Wishlist.name, schema: WishlistSchema }]),
        CacheModule.register(),
		HttpModule,
        SongsModule,
        ProductsModule,
        AlbumsModule,
	],
	controllers: [WishlistController],
	providers: [WishlistService, ServiceTokenProvider],
})
export class WishlistModule {}
