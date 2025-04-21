// Create a file at server/api/health.js or server/routes/api/health.js
export default defineEventHandler((event) => {
  return {
    status: "ok",
    timestamp: new Date().toISOString(),
  };
});
