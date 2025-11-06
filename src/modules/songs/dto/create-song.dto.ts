import { IsEmpty, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import {
	Pricing,
	type PricingType,
} from '../../../common/schemas/pricing.schema';
import { Transform, Type } from 'class-transformer';
import { Types } from 'mongoose';

export class CreateSongDto {
	@IsString()
	@IsNotEmpty()
	title: string;

	@IsNotEmpty()
	@Transform(({ value }) => {
		if (typeof value === 'string') {
			const parsed = JSON.parse(value);
			return Object.assign(new Pricing(), parsed);
		}
	})
	@Type(() => Pricing)
	@ValidateNested()
	pricing: PricingType;

	@IsEmpty()
	cover: string;

	@IsEmpty()
	duration: number;

	@IsEmpty() // TEMPORAL
	authors: string[];
}
