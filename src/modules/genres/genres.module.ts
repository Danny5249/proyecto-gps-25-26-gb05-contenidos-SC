import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Genre, GenreSchema } from './schemas/genre.schema';
import { GenresService } from './genres.service';
import { GenresController } from './genres.controller';
import { HttpModule } from '@nestjs/axios';
import { ServiceTokenProvider } from '../../common/providers/service-token.provider';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Genre.name, schema: GenreSchema }]),
		HttpModule,
	],
	controllers: [GenresController],
	providers: [GenresService, ServiceTokenProvider],
	exports: [GenresService],
})
export class GenresModule {}
