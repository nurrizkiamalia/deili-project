"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { ProductImage } from '../types/datatypes';

export const useProductImage = () => {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('/api/product_images');
        setImages(response.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const addImage = async (image: Omit<ProductImage, 'id'>) => {
    try {
      const response = await axios.post('/api/product_images', image);
      setImages([...images, response.data]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteImage = async (id: number) => {
    try {
      await axios.delete(`/api/product_images/${id}`);
      setImages(images.filter(img => img.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return { images, loading, error, addImage, deleteImage };
};
