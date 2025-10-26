export type PricingType = {
	cd: number;
	vinyl: number;
	cassette: number;
	digital: number;
};

export const PricingSchema = {
	cd: { type: Number, required: true, min: 0 },
	vinyl: { type: Number, required: true, min: 0 },
	cassette: { type: Number, required: true, min: 0 },
	digital: { type: Number, required: true, min: 0 },
};
