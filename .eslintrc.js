module.exports = {
	root: true,
	parser: "@typescript-eslint/parser",
	plugins: ["jest", "@typescript-eslint", "import"],
	extends: [
		"@pesky-fish/eslint-config/javascript",
		"prettier",
		"plugin:@typescript-eslint/recommended",
	],
	env: {
		"jest/globals": true,
	},
	ignorePatterns: ["src/__generated__"],
	settings: {
		"import/resolver": {
			"babel-module": {},
			node: {
				extensions: [".js", ".jsx", ".ts", ".tsx"],
			},
			typescript: {
				alwaysTryTypes: true,
			},
		},
		"import/parsers": {
			"@typescript-eslint/parser": [".ts", ".tsx"],
		},
	},
	rules: {
		"@typescript-eslint/no-var-requires": 0,
		"@typescript-eslint/explicit-module-boundary-types": "off",
		"@typescript-eslint/explicit-function-return-type": "off",
		"@typescript-eslint/naming-convention": "off",
		"@typescript-eslint/ban-types": "off",
		"import/no-extraneous-dependencies": 0,
		"import/prefer-default-export": 0,
	},
};
