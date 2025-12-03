import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class ElasticsearchSyncService {
	constructor(private readonly esService: ElasticsearchService) {}

	async create(index: string, type: string, uuid: string, document: any) {
		await this.esService.index({ index, id: `${type}_${uuid}`, document });
	}

	async update(index: string, type: string, uuid: string, document: any) {
		await this.create(index, type, uuid, document);
	}

	async delete(index: string, type: string, uuid: string) {
		await this.esService.delete({ index, id: `${type}_${uuid}` });
	}
}
