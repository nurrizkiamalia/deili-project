import { createClient } from 'redis';
import { promisify } from 'util';

const client = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD,
  database: Number(process.env.REDIS_DB),
});

client.on('error', (err: Error) => console.log('Redis error:', err));

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const delAsync = promisify(client.del).bind(client);

export { client, getAsync, setAsync, delAsync };
