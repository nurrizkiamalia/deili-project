"use client";

import React from "react";
import FormProduct from "@/app/(root)/components/FormProduct";
import { useProduct } from "@/hooks/useProduct";
import { useRouter } from "next/navigation";
import * as Yup from "yup";

const AddProduct: React.FC = () => {
  const { addProduct } = useProduct();
  const router = useRouter();

  const initialValues = {
    category: "",
    foodName: "",
    image: null,
    price: "",
  };

  const validationSchema = Yup.object({
    category_id: Yup.string().required("Category is required"),
    food_name: Yup.string().required("Food name is required"),
    price: Yup.number().required("Price is required"),
    image_url: Yup.mixed().required("Image is required"),
  });
  

  const handleSubmit = async (values: any) => {
    const { image_url, ...productData } = values;
    try {
      await addProduct(productData, image_url);
      alert("Product added successfully!");
      router.push("/product");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-center my-8">Add New Product</h1>
      <FormProduct initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema} />
    </div>
  );
};

export default AddProduct;
