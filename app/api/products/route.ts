import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM products');
    return NextResponse.json(result.rows); // Return all products as JSON
  } catch (err: any) {
    console.error('Error fetching products:', err.message);
    return NextResponse.json({ error: err.message || 'An error occurred' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json(); // Parse incoming JSON body
    const { category_id, food_name, image_url } = data;

    if (!category_id || !food_name || !image_url) {
      return NextResponse.json(
        { error: 'Missing required fields: category_id, food_name, image_url' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      'INSERT INTO products (category_id, food_name, image_url) VALUES ($1, $2, $3) RETURNING *',
      [category_id, food_name, image_url]
    );

    return NextResponse.json(result.rows[0], { status: 201 }); // Return newly created product
  } catch (err: any) {
    console.error('Error creating product:', err.message);
    return NextResponse.json({ error: err.message || 'An error occurred' }, { status: 500 });
  }
}