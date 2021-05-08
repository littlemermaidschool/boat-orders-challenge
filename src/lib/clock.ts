import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"; // dependent on utc plugin
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const clock = (
	{now = () => Date.now()} = {},
	asDayJsUTC = () => dayjs(new Date(now())).tz("UTC"),
) => ({
	now,
	nowSeconds: () => Math.floor(now() / 1000),
	iso8601: () => asDayJsUTC().format(),
	tomorrow: () => asDayJsUTC().add(1, "day"),
});

export type Clock = ReturnType<typeof clock>;
