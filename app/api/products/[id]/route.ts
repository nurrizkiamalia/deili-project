import { NextRequest, NextResponse } from "next/server";
import { Client } from "pg";

// Initialize the database client
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect();

// GET request: Fetch a product by its ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  
  if (!id) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  try {
    const result = await client.query("SELECT * FROM products WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

// PUT request: Update an existing product
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { category_id, food_name, image_url } = await req.json();

  if (!category_id || !food_name || !image_url) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const result = await client.query(
      "UPDATE products SET category_id = $1, food_name = $2, image_url = $3 WHERE id = $4 RETURNING *",
      [category_id, food_name, image_url, id]
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// DELETE request: Delete a product by its ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  try {
    const result = await client.query("DELETE FROM products WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
