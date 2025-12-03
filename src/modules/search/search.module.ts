import { forwardRef, Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ElasticsearchSyncService } from '../../common/services/elasticsearch-sync.service';
import { SongsModule } from '../songs/songs.module';
import { AlbumsModule } from '../albums/albums.module';

@Module({
	imports: [
		ElasticsearchModule.register({
			node: process.env.ELASTICSEARCH_HOST,
		}),
		forwardRef(() => SongsModule),
		forwardRef(() => AlbumsModule),
	],
	controllers: [SearchController],
	providers: [ElasticsearchSyncService],
	exports: [ElasticsearchSyncService],
})
export class SearchModule {}
