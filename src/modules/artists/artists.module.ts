import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Artist, ArtistSchema } from './schemas/artist.schema';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { HttpModule } from '@nestjs/axios';
import { ServiceTokenProvider } from '../../common/providers/service-token.provider';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Artist.name, schema: ArtistSchema }]),
		HttpModule,
	],
	controllers: [ArtistsController],
	providers: [ArtistsService, ServiceTokenProvider],
})
export class ArtistsModule {}
