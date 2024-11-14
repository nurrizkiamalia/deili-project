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
    await addProduct(values);
    router.push('/products')
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-center my-8">Add New Product</h1>
      <FormProduct initialValues={initialValues} onSubmit={handleSubmit} />
    </div>
  );
};

export default AddProduct;
