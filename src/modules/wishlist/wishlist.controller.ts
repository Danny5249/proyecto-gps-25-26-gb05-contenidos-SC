import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { AuthGuard } from '../../auth/auth.guard';
import { SupabaseUser } from '../../auth/user.decorator';
import { type User as SbUser } from '@supabase/supabase-js';
import { CreateWishlistDto } from './dto/create-wishlist.dto';

@Controller('wishlist')
export class WishlistController {
    constructor(private readonly wishlistService: WishlistService) {}

    @UseGuards(AuthGuard)
    @Get()
    async getWishlist(@SupabaseUser() sbUser: SbUser) {
        return this.wishlistService.getWishlist(sbUser.id);
    }

    @UseGuards(AuthGuard)
    @Post()
    async addToWishlist(
        @SupabaseUser() sbUser: SbUser,
        @Body() createWishlistDto: CreateWishlistDto
    ) {
        return this.wishlistService.addItem(sbUser.id, createWishlistDto.uuid, createWishlistDto.type);
    }

    @UseGuards(AuthGuard)
    @Delete(':uuid')
    async removeItem(
        @SupabaseUser() sbUser: SbUser,
        @Param('uuid') uuid: string
    ) {
        return this.wishlistService.removeItem(sbUser.id, uuid);
    }
}
