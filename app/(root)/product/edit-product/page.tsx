"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import EditProduct from './components/EditProduct';
import { Product } from '@/types/datatypes';
import { useProduct } from '@/hooks/useProduct';

const EditProductPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { products, loading, error } = useProduct();

  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (id && products.length > 0) {
      const foundProduct = products.find((product) => product.id === parseInt(id as string));
      setProduct(foundProduct || null);
    }
  }, [id, products]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="container mx-auto">
      <EditProduct product={product} />
    </div>
  );
};

export default EditProductPage;
