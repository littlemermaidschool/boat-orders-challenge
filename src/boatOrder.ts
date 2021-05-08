import {v4 as uuidv4} from "uuid";
import {Clock} from "./lib/clock";
import {db} from "./lib/db";
import {BoatOrder, CreateBoatOrderInput} from "./lib/dbTypes";

type Context = {
	db: typeof db;
	clock: Clock;
};

/**
 * Creates a boat stock record given an input
 */
export const createBoatOrder = async (input: CreateBoatOrderInput, ctx: Context) => {
	let orderStatus;

	const id = uuidv4();
	const currentTime = ctx.clock.now();
	const isoTime = new Date(currentTime).toISOString();
	const unixTimeStamp = Math.floor(currentTime / 1000);

	// check if stock AND restaurant/customer exists
	const boatStock = await ctx.db("BOAT_STOCK").getOneOrThrow(input.boatStockId);
	await await ctx.db("CUSTOMER").getOne(input.restaurantCode);

	// Check if stock is valid
	if (boatStock.valid && boatStock.valid <= unixTimeStamp)
		throw new Error("Stock is no longer valid");

	// Check if required fields are available for the sell type
	if (boatStock.sellType === "EACH" && !boatStock.count)
		throw new Error("Boat stock is missing count. Required for sell type of EACH");
	if (boatStock.sellType === "KG" && !boatStock.weight)
		throw new Error("Boat stock is missing weight. Required for sell type of KG");

	// Get the amount that has been sold so far from the DB
	const currentSoldAmount =
		(boatStock.sellType === "KG" ? boatStock.soldWeight : boatStock.soldCount) || 0;
	const orderAmount = (boatStock.sellType === "KG" ? input.weight : input.count) || 0;
	const totalAmount = (boatStock.sellType === "KG" ? boatStock.weight : boatStock.count) || 0;
	const availableAmount = totalAmount - currentSoldAmount;

	// Calculate the new total amount sold due to the change in the order count/weight
	const newSoldAmount = currentSoldAmount + orderAmount;

	// If new sold amount is more than available amount - throw an error
	if (newSoldAmount > availableAmount) throw new Error("Can't sell more than what's available");

	// Set order status to PENDING if boat stock ETA is greater than tomorrow
	// Otherwise set to CONFIRMED
	const tomorrowUnixTimeStamp = ctx.clock.tomorrow().unix();
	if (boatStock.eta && boatStock.eta > tomorrowUnixTimeStamp) orderStatus = "PENDING";
	if (boatStock.eta && boatStock.eta <= tomorrowUnixTimeStamp) orderStatus = "CONFIRMED";

	// Clone boat stock for updating to DB
	const boatStockClone = JSON.parse(JSON.stringify(boatStock));
	delete boatStockClone.id;

	boatStockClone.updatedAt = isoTime;

	// Add the updated data to be relevant object
	if (boatStock.sellType === "KG") boatStockClone.soldWeight = newSoldAmount;
	if (boatStock.sellType === "EACH") boatStockClone.soldCount = newSoldAmount;

	const boatOrderInput = {
		id,
		boatOrderBoatStockId: input.boatStockId,
		count: input.count,
		weight: input.weight,
		date: unixTimeStamp,
		exported: false,
		restaurantCode: input.restaurantCode,
		status: orderStatus,
		updatedAt: isoTime,
		user: input.user,
		__typename: "BoatOrder",
	};

	await db.transaction(
		db<BoatOrder>("BOAT_ORDER").create(id, boatOrderInput),
		db("BOAT_STOCK").update(boatStock.id, boatStockClone),
		async () => {
			await db<BoatOrder>("BOAT_ORDER").delete(id);
			await db("BOAT_STOCK").update(boatStock.id, boatStockClone);
		},
	);

	const boatOrders = await db("BOAT_ORDER").getOneOrThrow(id);
	return boatOrders;
};
