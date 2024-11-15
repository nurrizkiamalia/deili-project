"use client";

import React from 'react';
import FormProduct from '@/app/(root)/components/FormProduct';
import { useProduct } from '@/hooks/useProduct';
import { Product } from '@/types/datatypes';

const EditProduct: React.FC<{ product: Product }> = ({ product }) => {
  const { updateProduct } = useProduct();

  const initialValues = {
    category_id: product.category_id,
    food_name: product.food_name,     
    image_url: product.image_url,      
    price: product.price,
  };

  const handleSubmit = async (values: any) => {
    const updatedValues = {
      ...values,
      category_id: values.category_id || product.category_id,
      food_name: values.food_name || product.food_name,
    };
    await updateProduct(product.id, updatedValues, values.image || null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-center my-8">Edit Product</h1>
      <FormProduct initialValues={initialValues} onSubmit={handleSubmit} />
    </div>
  );
};

export default EditProduct;
