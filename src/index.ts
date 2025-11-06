import 'dotenv/config';
import app from './app';
import { connectDB } from './config/db';

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI missing');
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET missing');
  await connectDB(process.env.MONGO_URI);
  app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
}

bootstrap().catch(err => {
  console.error('Failed to start', err);
  process.exit(1);
});