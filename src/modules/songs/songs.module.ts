import {forwardRef, Module} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Song, SongSchema } from './schemas/song.schema';
import { SongsService } from './songs.service';
import { SongsController } from './songs.controller';
import { HttpModule } from '@nestjs/axios';
import { ServiceTokenProvider } from '../../common/providers/service-token.provider';
import { BucketService } from '../../common/services/bucket.service';
import { ArtistsModule } from '../artists/artists.module';
import { SearchModule } from '../search/search.module';
import { GenresModule } from '../genres/genres.module';
import { UsersModule } from "../users/users.module";
import {UsersService} from "../users/users.service";


@Module({
	imports: [
		MongooseModule.forFeature([{ name: Song.name, schema: SongSchema }]),
		HttpModule,
		ArtistsModule,
		SearchModule,
		GenresModule,
        forwardRef(()=>UsersModule),
	],
	controllers: [SongsController],
	providers: [SongsService, ServiceTokenProvider, BucketService, UsersService],
	exports: [SongsService],
})
export class SongsModule {}
