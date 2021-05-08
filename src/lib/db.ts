const store = {};

export const db = <T>(tableName: string) => {
	store[tableName] = store[tableName] || {};
	const table = store[tableName];
	return {
		delete: async (id: string) => {
			delete table[id];
		},
		create: async (id: string, body: T) => {
			table[id] = body;
			return table[id];
		},
		update: async (id: string, body: T) => {
			table[id] = {
				...table[id],
				...body,
			};
			return table[id];
		},
		getOne: async (id: string) => {
			return table[id];
		},
		getOneOrThrow: async (id: string) => {
			const item = table[id];
			if (!item) {
				throw new Error("Not Found");
			}
			return item;
		},
	};
};

db.transaction = async <A, B>(a: Promise<A>, b: Promise<B>, undo: Function) => {
	try {
		return {
			success: true,
			result: await Promise.all([a, b]),
		};
	} catch (err) {
		await undo();
		return {success: false, err};
	}
};
