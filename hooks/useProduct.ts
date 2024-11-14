"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Product } from '../types/datatypes';

export const useProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  const uploadImageToCloudinary = async (image: File) => {
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!); // Ensure this is set in your environment variables
    formData.append('cloud_name', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!); // Ensure this is set in your environment variables

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      return response.data.secure_url;
    } catch (err: any) {
      setError('Failed to upload image to Cloudinary');
      throw err;
    }
  };

  const addProduct = async (product: Omit<Product, 'id'>, image: File) => {
    try {
      const imageUrl = await uploadImageToCloudinary(image);
      const response = await axios.post('/api/products', { ...product, image_url: imageUrl });
      setProducts([...products, response.data]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const updateProduct = async (id: number, product: Omit<Product, 'id'>, image?: File) => {
    try {
      let imageUrl = product.image_url;
      if (image) {
        imageUrl = await uploadImageToCloudinary(image);
      }
      const response = await axios.put(`/api/products/${id}`, { ...product, image_url: imageUrl });
      setProducts(products.map(p => (p.id === id ? response.data : p)));
    } catch (err: any) {
      setError(err.message);
    }
  };

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
