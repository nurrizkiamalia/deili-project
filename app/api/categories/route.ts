import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM categories');
    return NextResponse.json(result.rows);
  } catch (err: any) {
    console.error('Error fetching categories:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    const result = await pool.query(
      'INSERT INTO categories (name) VALUES ($1) RETURNING *',
      [name]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err: any) {
    console.error('Error creating category:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}