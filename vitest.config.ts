import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		globals: true,
		environment: 'node',
		include: ['nodes/**/*.test.ts', 'credentials/**/*.test.ts'],
	},
});
