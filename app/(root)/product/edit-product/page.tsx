// EditProductPage.tsx
"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'; 
import EditProduct from './components/EditProduct';
import { Product } from '@/types/datatypes';
import { useProduct } from '@/hooks/useProduct';

const EditProductPage: React.FC = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { products, loading, error } = useProduct();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (id && products.length > 0) {
      const foundProduct = products.find((product) => product.id === parseInt(id, 10));
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

// Wrap in Suspense to handle async behavior
export default function WrappedEditProductPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditProductPage />
    </Suspense>
  );
}
