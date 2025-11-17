import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Artist, ArtistSchema } from './schemas/artist.schema';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { HttpModule } from '@nestjs/axios';
import { ServiceTokenProvider } from '../../common/providers/service-token.provider';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Artist.name, schema: ArtistSchema }]),
		CacheModule.register(),
		HttpModule,
	],
	controllers: [ArtistsController],
	providers: [ArtistsService, ServiceTokenProvider],
	exports: [ArtistsService],
})
export class ArtistsModule {}
