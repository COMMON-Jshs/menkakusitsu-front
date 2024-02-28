import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import { compression } from "vite-plugin-compression2";
import generouted from "@generouted/react-router/plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), generouted(), compression()],
});
