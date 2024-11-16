"use client";

import React from "react";
import FormProduct from "@/app/(root)/components/FormProduct";
import { useProduct } from "@/hooks/useProduct";
import { Product } from "@/types/datatypes";
import { useRouter } from "next/navigation";
import * as Yup from "yup";

const EditProduct: React.FC<{ product: Product }> = ({ product }) => {
  const { updateProduct } = useProduct();
  const router = useRouter();

  const initialValues = {
    category_id: product.category_id || "",
    food_name: product.food_name || "",
    image_url: product.image_url || "",
    price: product.price || "",
  };

  const validationSchema = Yup.object({
    category_id: Yup.string(),
    food_name: Yup.string(),
    price: Yup.number(),
    image_url: Yup.mixed(),
  });
  

  const handleSubmit = async (values: any) => {
    try {
      const updatedValues = Object.fromEntries(
        Object.entries(values).filter(([_, value]) => value !== "")
      );
      await updateProduct(product.id, updatedValues);
      alert("Product updated successfully!");
      router.push('/');
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product. Please try again.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-center my-8">Edit Product</h1>
      <FormProduct initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema} />
    </div>
  );
};

export default EditProduct;
