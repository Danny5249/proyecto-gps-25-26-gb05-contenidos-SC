import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class BucketService {
	private s3: S3Client;

	constructor() {
		this.s3 = new S3Client({
			region: process.env.BUCKET_REGION!,
			endpoint: process.env.BUCKET_ENDPOINT!,
			forcePathStyle: true,
			credentials: {
				accessKeyId: process.env.BUCKET_ACCESS_KEY!,
				secretAccessKey: process.env.BUCKET_SECRET_KEY!,
			},
		});
	}

	async saveToSongFiles(uuid: string, file: Express.Multer.File) {
		const command = new PutObjectCommand({
			Bucket: 'song-files',
			Key: uuid,
			Body: file.buffer,
			ContentType: file.mimetype,
		});
		await this.s3.send(command);
	}

	async saveToSongCovers(uuid: string, cover: Express.Multer.File) {
		const command = new PutObjectCommand({
			Bucket: 'song-covers',
			Key: uuid,
			Body: cover.buffer,
			ContentType: cover.mimetype,
		});
		await this.s3.send(command);
	}

	async saveToAlbumCovers(uuid: string, cover: Express.Multer.File) {
		const command = new PutObjectCommand({
			Bucket: 'album-covers',
			Key: uuid,
			Body: cover.buffer,
			ContentType: cover.mimetype,
		});
		await this.s3.send(command);
	}
}
