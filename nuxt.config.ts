// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-03-18",
  devtools: { enabled: true },
  app: {
    head: {
      title: "Agenda",
      link: [{ rel: "icon", type: "image/x-icon", href: "/icon.svg" }],
    },
  },
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  modules: ["@pinia/nuxt"],
  plugins: ["~/plugins/auth.js"],
  nitro: {
    routeRules: {
      "/api/calendar/**": {
        cors: true,
        headers: {
          "Access-Control-Allow-Methods": "GET",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
        },
      },
    },
  },
});
