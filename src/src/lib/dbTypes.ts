export type Maybe<T> = T | null | undefined;

export type CreateBoatOrderInput = {
	id?: string | null;
	restaurantCode: string;
	user: string;
	weight?: number | null;
	count?: number | null;
	prep?: string | null;
	date: string;
	status?: string | null;
	exported?: boolean | null;
	boatStockId?: string | null;
};

export type BoatOrder = {
	__typename?: "BoatOrder";
	id: string;
	boatStockId: string;
	restaurantCode: string;
	date: number;
	updatedAt: string | null | undefined;
	count: number | null | undefined;
	weight: number | null | undefined;
	exported: boolean | null | undefined;
	status: string | null | undefined;
	user: string | null | undefined;
};
export type BoatStock = {
	__typename?: "BoatStock";
	id: string;
	boatId: string;
	speciesId: string;
	created: number;
	createdAt: Maybe<string>;
	updatedAt: Maybe<string>;
	valid: Maybe<number>;
	eta: Maybe<number>;
	sellType: Maybe<string>;
	count: Maybe<number>;
	weight: Maybe<number>;
	soldCount: Maybe<number>;
	soldWeight: Maybe<number>;
	weightStepSize: Maybe<number>;
	price: Maybe<number>;
	orders: Maybe<Array<Maybe<BoatOrder>>>;
};
