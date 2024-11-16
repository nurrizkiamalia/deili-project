"use client";

import React from "react";
import { useProduct } from "@/hooks/useProduct";
import ProductTable from "../components/ProductTable";

const ProductList: React.FC = () => {
  const { products, deleteProduct, loading } = useProduct();

  const handleDeleteProduct = async (id: number) => {
    await deleteProduct(id);
    window.location.reload();
  };

  return (
    <div className="flex flex-col gap-3 p-5 mt-5 mb-16">
      <h1 className="text-xl font-semibold font-bricolage">Product List</h1>
      <hr />
      <ProductTable
        products={products}
        onDeleteProduct={handleDeleteProduct}
        loading={loading}
      />
    </div>
  );
};

export default ProductList;
