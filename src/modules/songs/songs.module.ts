import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Song, SongSchema } from './schemas/song.schema';
import { SongsService } from './songs.service';
import { SongsController } from './songs.controller';
import { HttpModule } from '@nestjs/axios';
import { ServiceTokenProvider } from '../../common/providers/service-token.provider';
import { BucketService } from '../../common/services/bucket.service';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Song.name, schema: SongSchema }]),
		HttpModule,
	],
	controllers: [SongsController],
	providers: [SongsService, ServiceTokenProvider, BucketService],
	exports: [SongsService],
})
export class SongsModule {}
