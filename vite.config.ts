import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// nothing fancy, just react + a fixed port so the tab stays put
export default defineConfig({
  // served under the repo path on github pages (leviathan-sps.github.io/Plan-tmr/)
  base: "/Plan-tmr/",
  plugins: [react()],
  server: { port: 5180, open: true },
});
