"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Category } from '../types/datatypes';

export const useCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories');
        setCategories(response.data);
      } catch (err: any) {
        console.error("Error fetching categories:", err);
        setError(err.response?.data?.error || err.message || 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);
  
  
  return { categories, loading, error };
};
