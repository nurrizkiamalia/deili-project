"use client";
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useCategory } from "@/hooks/useCategory";
import { useFoodNameSuggestions } from "@/hooks/useFoodNameSuggestions";
import { useBackgroundChangeSuggestions } from "@/hooks/useBackgroundChangeSuggestions";
import { useProduct } from "@/hooks/useProduct";
import { Category } from "@/types/datatypes";

interface FormProductProps {
  initialValues: any;
  onSubmit: (values: any, image: File) => void;
}

const FormProduct: React.FC<FormProductProps> = ({
  initialValues,
  onSubmit,
}) => {
  const {
    categories,
    loading: loadingCategories,
    error: errorCategories,
  } = useCategory();
  const { products } = useProduct();
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialValues.category
  );
  const {
    suggestions,
    loading: loadingSuggestions,
    error: errorSuggestions,
  } = useFoodNameSuggestions(selectedCategory);
  const {
    suggestedImages,
    originalImage,
    loading: loadingBackground,
    error: errorBackground,
    suggestBackgroundChange,
  } = useBackgroundChangeSuggestions();

  const validationSchema = Yup.object({
    category_id: Yup.string().required("Category is required"),
    food_name: Yup.string().required("Food name is required"),
    image_url: Yup.mixed()
      .test(
        "fileSize",
        "File size is too large",
        (value: any) => value && value.size <= 2 * 1024 * 1024
      )
      .test(
        "fileFormat",
        "Unsupported format",
        (value: any) =>
          value && ["image/jpeg", "image/jpg", "image/png"].includes(value.type)
      )
      .required("Image is required"),
  });

  const shouldGenerateImages = products.length < 5;

  if (loadingCategories) return <div>Loading categories...</div>;
  if (errorCategories) return <div>{errorCategories}</div>;

  return (
    <div className="max-w-md mx-auto mt-10">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          const formData = new FormData();
          formData.append("category_id", values.category_id);
          formData.append("food_name", values.food_name);
          formData.append("image_url", values.image_url);
          const imageFile = values.image_url; // Get the image file
          onSubmit(formData, imageFile); // Pass the image file
          resetForm();
          setSubmitting(false);
        }}
      >
        {({ setFieldValue }) => (
          <Form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="category_id"
              >
                Category
              </label>
              <Field
                as="select"
                name="category_id"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const value = e.target.value;
                  setFieldValue("category_id", value);
                  setSelectedCategory(value);
                }}
              >
                <option value="">Select a category</option>
                {categories.map((category: Category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="category_id"
                component="div"
                className="text-red-500 text-xs italic"
              />
            </div>
            <div className="mb-4">
              {loadingSuggestions ? (
                <div>Loading suggestions...</div>
              ) : errorSuggestions ? (
                <div>{errorSuggestions}</div>
              ) : (
                suggestions.length > 0 && (
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Food Name Suggestions
                    </label>
                    <ul>
                      {suggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )
              )}
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="food_name"
              >
                Food Name
              </label>
              <Field
                name="food_name"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <ErrorMessage
                name="food_name"
                component="div"
                className="text-red-500 text-xs italic"
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="image_url"
              >
                Image Upload
              </label>
              <input
                name="image_url"
                type="file"
                onChange={(event) => {
                  if (event.currentTarget.files) {
                    const file = event.currentTarget.files[0];
                    setFieldValue("image_url", file);
                    suggestBackgroundChange(file);
                  }
                }}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <ErrorMessage
                name="image_url"
                component="div"
                className="text-red-500 text-xs italic"
              />
            </div>

            {loadingBackground ? (
              <div>Generating background suggestions...</div>
            ) : errorBackground ? (
              <div className="text-red-500">{errorBackground}</div>
            ) : (
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Choose Background
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {originalImage && (
                    <div className="relative">
                      <img
                        src={originalImage}
                        alt="Original"
                        className="w-full rounded"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFieldValue("image_url", originalImage)
                        }
                        className="absolute top-0 right-0 mt-2 mr-2 bg-blue-500 text-white p-1 rounded text-xs"
                      >
                        Use Original
                      </button>
                    </div>
                  )}
                  {suggestedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Suggested Background ${index + 1}`}
                        className="w-full rounded"
                      />
                      <button
                        type="button"
                        onClick={() => setFieldValue("image_url", image)}
                        className="absolute top-0 right-0 mt-2 mr-2 bg-blue-500 text-white p-1 rounded text-xs"
                      >
                        Use This
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Submit
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FormProduct;
