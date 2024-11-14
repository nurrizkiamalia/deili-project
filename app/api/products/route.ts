import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM products');
    return NextResponse.json(result.rows);
  } catch (err: any) {
    console.error('Error fetching products:', err.message || err);
    return NextResponse.json({ error: err.message || 'An error occurred' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const category_id = data.get('category_id') as string;
    const food_name = data.get('food_name') as string;
    const image_url = data.get('image_url') as File;

    if (!category_id || !food_name || !image_url ) {
      throw new Error('Missing required fields');
    }

    // Handle the image upload to Cloudinary (or any other service) here
    // const imageUrl = await uploadImageToCloudinary(image_url);

    const result = await pool.query(
      'INSERT INTO products (category_id, food_name, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [category_id, food_name, image_url]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err: any) {
    console.error('Error creating product:', err.message || err);
    return NextResponse.json({ error: err.message || 'An error occurred' }, { status: 500 });
  }
}
