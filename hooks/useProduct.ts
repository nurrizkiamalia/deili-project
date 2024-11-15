// hooks/useProduct.ts

"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Product } from '../types/datatypes';
import { uploadImageToCloudinary } from '../utils/uploadImageToCloudinary'; // Import Cloudinary upload function

export const useProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        setProducts(response.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Create a new product
  const addProduct = async (product: Omit<Product, 'id'>, image: File) => {
    try {
      const imageUrl = await uploadImageToCloudinary(image);  // Upload image first
      const response = await axios.post('/api/products', { ...product, image_url: imageUrl });
      setProducts([...products, response.data]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Update an existing product
  const updateProduct = async (id: number, product: Omit<Product, "id">, image?: File) => {
    setLoading(true);
    setError(null);
    try {
      let imageUrl = product.image_url;
      if (image) {
        imageUrl = await uploadImageToCloudinary(image);
      }
      const response = await axios.put(`/api/products/${id}`, { ...product, image_url: imageUrl });
      setProducts(products.map((p) => (p.id === id ? response.data : p)));
    } catch (err: any) {
      setError("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  // Delete a product
  const deleteProduct = async (id: number) => {
    try {
      await axios.delete(`/api/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return { products, loading, error, addProduct, updateProduct, deleteProduct };
};
