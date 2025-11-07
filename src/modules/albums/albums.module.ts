import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Album, AlbumSchema } from './schemas/album.schema';
import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';
import { SongsModule } from '../songs/songs.module';
import { HttpModule } from '@nestjs/axios';
import { ServiceTokenProvider } from '../../common/providers/service-token.provider';
import { BucketService } from '../../common/services/bucket.service';
import {ArtistsModule} from "../artists/artists.module";

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Album.name, schema: AlbumSchema }]),
		SongsModule,
		HttpModule,
        ArtistsModule
	],
	controllers: [AlbumsController],
	providers: [AlbumsService, ServiceTokenProvider, BucketService],
})
export class AlbumsModule {}
