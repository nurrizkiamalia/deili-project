import { NextApiRequest, NextApiResponse } from 'next';
import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    const { category_id, food_name, image_url } = req.body;
    try {
      const result = await client.query(
        'UPDATE products SET category_id = $1, food_name = $2, image_url = $3 WHERE id = $5 RETURNING *',
        [category_id, food_name, image_url, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.status(200).json(result.rows[0]);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const result = await client.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.status(200).json(result.rows[0]);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
