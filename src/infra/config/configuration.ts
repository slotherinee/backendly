export default () => ({
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 4000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL,
  THROTTLE: {
    TTL: process.env.THROTTLE_TTL
      ? parseInt(process.env.THROTTLE_TTL, 10)
      : 60000,
    LIMIT: process.env.THROTTLE_LIMIT
      ? parseInt(process.env.THROTTLE_LIMIT, 10)
      : 100,
  },
});
