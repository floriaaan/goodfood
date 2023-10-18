import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  base: "/src/tests",
  // test: {
  //   setupFiles: ["./src/tests/setup.ts"],
  // },
});
