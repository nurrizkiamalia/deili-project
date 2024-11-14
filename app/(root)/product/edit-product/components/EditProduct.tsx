import React from 'react';
import FormProduct from '@/app/(root)/components/FormProduct';
import { useProduct } from '@/hooks/useProduct';
import { Product } from '@/types/datatypes';

const EditProduct: React.FC<{ product: Product }> = ({ product }) => {
  const { updateProduct } = useProduct();

  const initialValues = {
    category: product.category_id,
    foodName: product.food_name,
    image: null,
    price: product.price,
  };

  const handleSubmit = async (values: any) => {
    await updateProduct(product.id, values);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-center my-8">Edit Product</h1>
      <FormProduct initialValues={initialValues} onSubmit={handleSubmit} />
    </div>
  );
};

export default EditProduct;
