import { defineConfig } from "vite";

// O site é publicado no GitHub Pages em um subdiretório; sem `base`
// os caminhos dos assets quebram na versão de produção.
export default defineConfig({
  base: "/ong-maos-solidarias/",
  build: {
    outDir: "dist",
    sourcemap: false,
    assetsInlineLimit: 4096
  }
});
