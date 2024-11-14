import { NextApiRequest, NextApiResponse } from 'next';
import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const result = await client.query('SELECT * FROM product_images');
      res.status(200).json(result.rows);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  } else if (req.method === 'POST') {
    const { product_id, image_url } = req.body;
    try {
      const result = await client.query(
        'INSERT INTO product_images (product_id, image_url) VALUES ($1, $2) RETURNING *',
        [product_id, image_url]
      );
      res.status(201).json(result.rows[0]);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}
