"use client";

import React from "react";
import { useProduct } from "@/hooks/useProduct";
import ProductTable from "./ProductTable";

const RecentProduct: React.FC = () => {
  const { products, deleteProduct, loading } = useProduct();

  const handleDeleteProduct = async (id: number) => {
    await deleteProduct(id);
    window.location.reload();
  };

  return (
    <div className="bg-slate-200 rounded-xl p-5 flex flex-col gap-3">
      <h2 className="capitalize text-lg font-bricolage font-semibold">
        Recent Products
      </h2>
      <hr className="border-dspDarkGray" />
      <ProductTable
        products={products}
        onDeleteProduct={handleDeleteProduct}
        loading={loading}
        limit={3} // Show only the first 3 products
      />
    </div>
  );
};

export default RecentProduct;
