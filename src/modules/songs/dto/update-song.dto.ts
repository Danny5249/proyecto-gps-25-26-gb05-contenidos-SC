import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateSongDto } from './create-song.dto';

const OmittedAttributes = OmitType(CreateSongDto, ['uuid'] as const);

export class UpdateSongDto extends PartialType(OmittedAttributes) {}
