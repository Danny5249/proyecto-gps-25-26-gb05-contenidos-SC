import {
	Controller,
	forwardRef,
	Get,
	HttpCode,
	HttpStatus,
	Inject,
	Query,
} from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { SongsService } from '../songs/songs.service';
import { AlbumsService } from '../albums/albums.service';

@Controller('search')
export class SearchController {
	constructor(
		private readonly esService: ElasticsearchService,
		private readonly songsService: SongsService,
		private readonly albumsService: AlbumsService,
	) {}

	/**
	 * Buscar lanzamientos (canciones y/o álbumes)
	 * @param query - Término de búsqueda (obligatorio)
	 * @param author - UUID del autor del lanzamiento
	 * @param genres - Nombre de los géneros que (al menos) debe tener el lanzamiento, separados por comas
	 * @param minPrice -
	 * @param maxPrice -
	 * @param minReleaseDate -
	 * @param maxReleaseDate -
	 * @param page -
	 * @param items -
	 * @param orderBy -
	 * @param orderDirection -
	 */
	@Get()
	@HttpCode(HttpStatus.OK)
	async search(
		@Query('query') query: string,
		@Query('author') author: string,
		@Query('genres') genres: string,
		@Query('minPrice') minPrice: number,
		@Query('maxPrice') maxPrice: number,
		@Query('minReleaseDate') minReleaseDate: Date,
		@Query('maxReleaseDate') maxReleaseDate: Date,
		@Query('page') page: number,
		@Query('items') items: number,
		@Query('orderBy') orderBy: 'releaseDate' | 'price' | 'author' | 'rating',
		@Query('orderDirection') orderDirection: 'asc' | 'desc',
	) {
		if (!page) page = 1;
		if (!items) items = 20;
		if (!orderBy) orderBy = 'releaseDate';
		if (!orderDirection) orderDirection = 'desc';
		const from = (page - 1) * items;

		const filters: any[] = [];

		// Para coincidencias exactas, se añade al final .keyword
		if (author) {
			filters.push({
				term: {
					'author.uuid.keyword': author,
				},
			});
		}

		if (genres) {
			const genreList = genres.split(',');
			filters.push({
				terms: {
					'genres.name.keyword': genreList,
				},
			});
		}

		if (minPrice || maxPrice) {
			const priceRange: any = {};
			if (minPrice) priceRange.gte = minPrice;
			if (maxPrice) priceRange.lte = maxPrice;
			filters.push({
				bool: {
					should: [
						{ range: { 'pricing.cd': priceRange } },
						{ range: { 'pricing.digital': priceRange } },
						{ range: { 'pricing.cassette': priceRange } },
						{ range: { 'pricing.vinyl': priceRange } },
					],
					minimum_should_match: 1,
				},
			});
		}

		if (minReleaseDate || maxReleaseDate) {
			const dateRange: any = {};
			if (minReleaseDate) dateRange.gte = minReleaseDate;
			if (maxReleaseDate) dateRange.lte = maxReleaseDate;
			filters.push({
				range: {
					releaseDate: dateRange,
				},
			});
		}

		let order: string = '';
		switch (orderBy) {
			case 'releaseDate':
				order = 'releaseDate';
				break;
			case 'author':
				order = 'author.uuid';
				break;
			case 'price':
				order = 'minPrice';
				break;
			case 'rating': // TODO: Temporal hasta que haya reseñas
				order = 'releaseDate';
		}

		const result = await this.esService.search({
			index: 'releases',
			from,
			size: items,
			query: {
				bool: {
					must: !query
						? undefined
						: [
								{
									multi_match: {
										query,
										fields: ['title^3', 'author.artistName^2', 'genres.name'],
										type: 'phrase_prefix',
									},
								},
							],
					filter: filters,
				},
			},
			sort: [
				{
					[order]: {
						order: orderDirection,
					},
				},
			],
		});

		return {
			total: (result.hits.total as any).value,
			items: await Promise.all(
				result.hits.hits.map(async (hit) => {
					const [type, uuid] = hit._id?.split('_') || [];
					if (type === 'song') {
						return {
							type: 'song',
							item: await this.songsService.findOneByUuidAndPopulate(uuid),
						};
					} else if (type === 'album') {
						return {
							type: 'album',
							item: await this.albumsService.findOneByUuidAndPopulate(uuid),
						};
					}
				}),
			),
		};
	}
}
