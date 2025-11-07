import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateAlbumDto } from './create-album.dto';

const OmittedAttributes = OmitType(CreateAlbumDto, ['uuid'] as const);

export class UpdateAlbumDto extends PartialType(OmittedAttributes) {}
