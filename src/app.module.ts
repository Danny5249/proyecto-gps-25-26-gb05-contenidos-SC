import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { GenresModule } from './modules/genres/genres.module';
import { SongsModule } from './modules/songs/songs.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		MongooseModule.forRoot(process.env.MONGODB_HOST || ''),
		GenresModule,
		SongsModule,
	],
})
export class AppModule {}
