import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: "index.html",
        cart: "cart.html",
        product: "product.html",
        profile: "profile.html",
        checkout: "checkout.html",
      },
    },
  },
});
