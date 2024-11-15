"use client";

import React from 'react';
import FormProduct from '../components/FormProduct';
import { useProduct } from '@/hooks/useProduct';
import { useRouter } from 'next/navigation';

const AddProduct: React.FC = () => {
  const { addProduct } = useProduct();
  const router = useRouter();

  const initialValues = {
    category: '',
    foodName: '',
    image: null,
    price: '',
  };

  const handleSubmit = async (values: any) => {
    const { image_url, ...productData } = values; 
    try {
      await addProduct(productData, image_url); 
      router.push('/product');
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };
  

  return (
    <div>
      <h1 className="text-2xl font-bold text-center my-8">Add New Product</h1>
      <FormProduct initialValues={initialValues} onSubmit={handleSubmit} />
    </div>
  );
};

export default AddProduct;
