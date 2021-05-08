import {createBoatOrder} from "./boatOrder";
import {clock} from "./lib/clock";
import {db} from "./lib/db";

it("should create a boat order", async () => {
	await db("BOAT_STOCK").create("1", {
		count: 10,
		weight: 35,
	});
	await createBoatOrder(
		{
			date: "1",
			restaurantCode: "2",
			user: "3",
			boatStockId: "1",
			count: 1,
			exported: false,
			id: "3",
			prep: "true",
			status: "OPEN",
			weight: 3,
		},
		{
			clock: clock(),
			db: db,
		},
	);
});
