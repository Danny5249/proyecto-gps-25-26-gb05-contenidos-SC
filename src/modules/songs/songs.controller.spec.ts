import { Test, TestingModule } from '@nestjs/testing';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { Song } from './schemas/song.schema';
import { Types } from 'mongoose';

const mockSongsService = {
	create: jest.fn(),
};

describe('SongsController', () => {
	let songsController: SongsController;
	let songsService: SongsService;

	beforeEach(async () => {
		const moduleRef: TestingModule = await Test.createTestingModule({
			controllers: [SongsController],
			providers: [{ provide: SongsService, useValue: mockSongsService }],
		}).compile();

		songsService = moduleRef.get<SongsService>(SongsService);
		songsController = moduleRef.get<SongsController>(SongsController);

		jest.clearAllMocks();
	});

	describe('postSong', () => {
		it('debería devolver la canción creada', async () => {
			const createSongDto: CreateSongDto = {
				file: 'Un archivo',
				cover: 'https://una-imagen.com',
			};

			// La canción que FINGIMOS que el servicio creó y devolvió
			const mockCreatedSong: Song = {
				id: 1,
				title: 'Una canción',
				releaseDate: new Date('2025-01-01'),
				authors: [new Types.ObjectId().toHexString()],
				cover: createSongDto.cover,
				duration: 180,
				pricing: {
					cd: 10,
					vinyl: 20,
					cassette: 5,
					digital: 1,
				},
			};

			// Cuando 'songsService.create' sea llamado, debe devolver 'mockCreatedSong'
			jest.spyOn(songsService, 'create').mockResolvedValue(mockCreatedSong);

			const result = await songsController.create(createSongDto);

			expect(songsService.create).toHaveBeenCalledWith(createSongDto);
			// Verificamos que el controlador devolvió exactamente lo que el servicio le dio
			expect(result).toBe(mockCreatedSong);
		});
	});
});
