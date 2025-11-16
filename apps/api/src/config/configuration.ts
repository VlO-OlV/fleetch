export default () => ({
  port: process.env.PORT ? parseInt(process.env.PORT) : 3001,
  database: process.env.DATABASE_URL,
  frontend: process.env.FRONTEND_URL,
  auth: {
    accessSecret: process.env.ACCESS_SECRET,
    refreshSecret: process.env.REFRESH_SECRET,
    accessTTL: process.env.ACCESS_TTL,
    refreshTTL: process.env.REFRESH_TTL,
    sessions: process.env.SESSIONS ? parseInt(process.env.SESSIONS) : 3,
  },
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  aws: {
    accessKey: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucket: process.env.AWS_S3_BUCKET_NAME,
  },
});
