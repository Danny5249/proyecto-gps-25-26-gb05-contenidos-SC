import { Test, TestingModule } from '@nestjs/testing';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { Album } from './schemas/album.schema';
import { Types } from 'mongoose';

const mockAlbumsService = {
	create: jest.fn(),
};

describe('AlbumsController', () => {
	let albumsController: AlbumsController;
	let albumsService: AlbumsService;

	beforeEach(async () => {
		const moduleRef: TestingModule = await Test.createTestingModule({
			controllers: [AlbumsController],
			providers: [{ provide: AlbumsService, useValue: mockAlbumsService }],
		}).compile();

		albumsService = moduleRef.get<AlbumsService>(AlbumsService);
		albumsController = moduleRef.get<AlbumsController>(AlbumsController);

		jest.clearAllMocks();
	});

	describe('postAlbum', () => {
		it('debería devolver el álbum creado', async () => {
			const createAlbumDto: CreateAlbumDto = {
				cover: 'https://una-imagen.com',
			};

			// El álbum que FINGIMOS que el servicio creó y devolvió
			const mockCreatedAlbum: Album = {
				id: 1,
				title: 'Un álbum',
				cover: createAlbumDto.cover,
				author: new Types.ObjectId().toHexString(),
				duration: 180,
				releaseDate: new Date('2025-01-01'),
				songs: [],
				pricing: {
					cd: 10,
					vinyl: 20,
					cassette: 5,
					digital: 1,
				},
			};

			// Cuando 'albumsService.create' sea llamado, debe devolver 'mockCreatedAlbum'
			jest.spyOn(albumsService, 'create').mockResolvedValue(mockCreatedAlbum);

			const result = await albumsController.create(createAlbumDto);

			expect(albumsService.create).toHaveBeenCalledWith(createAlbumDto);
			// Verificamos que el controlador devolvió exactamente lo que el servicio le dio
			expect(result).toBe(mockCreatedAlbum);
		});
	});
});
