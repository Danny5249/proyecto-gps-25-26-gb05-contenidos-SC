import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Wishlist, WishlistSchema } from './schemas/wishlist.schema';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { HttpModule } from '@nestjs/axios';
import { ServiceTokenProvider } from '../../common/providers/service-token.provider';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Wishlist.name, schema: WishlistSchema }]),
        HttpModule,
    ],
    controllers: [WishlistController],
    providers: [WishlistService, ServiceTokenProvider],
})
export class WishlistModule {}
