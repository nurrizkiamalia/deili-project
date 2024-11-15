"use client";

import React, { useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useCategory } from "@/hooks/useCategory";
import { useBackgroundChangeSuggestions } from "@/hooks/useBackgroundChangeSuggestions";
import { Category } from "@/types/datatypes";
import { useFoodNameSuggestions } from "@/hooks/useFoodNameSuggestions";

interface FormProductProps {
  initialValues: any;
  onSubmit: (values: any) => Promise<void>;
}

const FormProduct: React.FC<FormProductProps> = ({ initialValues, onSubmit }) => {
  const { categories, loading: loadingCategories, error: errorCategories } = useCategory();
  const [selectedCategory, setSelectedCategory] = useState<string>(initialValues.category || ""); // For food name suggestions
  const { suggestions, loading: loadingSuggestions, error: errorSuggestions } = useFoodNameSuggestions(selectedCategory);
  const { loading: loadingBackground, error: errorBackground, suggestBackgroundChange } = useBackgroundChangeSuggestions();

  const [backgroundCommand, setBackgroundCommand] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [compositedImage, setCompositedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>, setFieldValue: (field: string, value: any) => void) => {
    const selectedName = e.target.value;
    setSelectedCategory(selectedName);

    const category = categories.find((cat) => cat.name === selectedName);
    const categoryId = category ? category.id : "";
    setFieldValue("category_id", categoryId); // Set category_id as the ID
  };

  const handleBackgroundChange = async () => {
    if (!imageFile || !backgroundCommand.trim()) {
      console.error("Image file and prompt are required.");
      return;
    }

    try {
      const { foregroundUrl, backgroundUrl } = (await suggestBackgroundChange(imageFile, backgroundCommand)) || {};
      if (!foregroundUrl || !backgroundUrl) {
        console.error("Failed to retrieve either the foreground or background URL.");
        return;
      }

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        const foreground = new Image();
        const background = new Image();

        foreground.crossOrigin = "anonymous";
        background.crossOrigin = "anonymous";

        background.src = backgroundUrl;
        foreground.src = foregroundUrl;

        background.onload = () => {
          canvas.width = background.width;
          canvas.height = background.height;

          ctx?.drawImage(background, 0, 0, canvas.width, canvas.height);

          foreground.onload = () => {
            const scaleFactor = 0.8;
            const xOffset = (canvas.width - foreground.width * scaleFactor) / 2;
            const yOffset = (canvas.height - foreground.height * scaleFactor) / 2;

            ctx?.drawImage(foreground, xOffset, yOffset, foreground.width * scaleFactor, foreground.height * scaleFactor);
            setCompositedImage(canvas.toDataURL("image/png"));
          };
        };
      }
    } catch (err) {
      console.error("Error generating composite image:", err);
    }
  };

  const handleSaveProduct = async (values: any) => {
    if (compositedImage) {
      await onSubmit({ ...values, image_url: compositedImage });
    }
  };

  if (loadingCategories) return <div>Loading categories...</div>;
  if (errorCategories) return <div>{errorCategories}</div>;

  return (
    <div className="max-w-md mx-auto mt-10">
      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object({
          category_id: Yup.string().required("Category is required"),
          food_name: Yup.string().required("Food name is required"),
          price: Yup.string().required("Price is required"),
          image_url: Yup.mixed().required("Image is required"),
        })}
        onSubmit={handleSaveProduct}
      >
        {({ setFieldValue }) => (
          <Form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            {/* Category Dropdown */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category_id">
                Category
              </label>
              <Field
                as="select"
                name="category_id"
                className="shadow border rounded w-full py-2 px-3 text-gray-700"
                onChange={(e: any) => handleCategoryChange(e, setFieldValue)}
              >
                <option value="">Select a category</option>
                {categories.map((category: Category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="category_id" component="div" className="text-red-500 text-xs italic" />
            </div>

            {/* Food Name Suggestions */}
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

            {/* Food Name Input */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="food_name">
                Food Name
              </label>
              <Field name="food_name" type="text" className="shadow border rounded w-full py-2 px-3 text-gray-700" />
              <ErrorMessage name="food_name" component="div" className="text-red-500 text-xs italic" />
            </div>

            {/* Price Input */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                Price
              </label>
              <Field name="price" type="number" className="shadow border rounded w-full py-2 px-3 text-gray-700" />
              <ErrorMessage name="price" component="div" className="text-red-500 text-xs italic" />
            </div>

            {/* Image Upload and Background Command */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image_url">
                Image Upload
              </label>
              <input
                name="image_url"
                type="file"
                onChange={(event) => {
                  if (event.currentTarget.files) {
                    const file = event.currentTarget.files[0];
                    setFieldValue("image_url", file);
                    setImageFile(file);
                  }
                }}
                className="shadow border rounded w-full py-2 px-3 text-gray-700"
              />
              <ErrorMessage name="image_url" component="div" className="text-red-500 text-xs italic" />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="backgroundCommand">
                Background Command
              </label>
              <input
                type="text"
                id="backgroundCommand"
                className="shadow border rounded w-full py-2 px-3 text-gray-700"
                value={backgroundCommand}
                onChange={(e) => setBackgroundCommand(e.target.value)}
              />
              <p className="text-xs text-red-500">Provide a prompt for the background image</p>
            </div>

            <div className="mb-6">
              <button
                type="button"
                onClick={handleBackgroundChange}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                
              >
                {loadingBackground ? "Generating..." : "Generate Background"}
              </button>
            </div>

            {compositedImage && (
              <div className="mb-6">
                <p className="text-gray-700 text-sm font-bold mb-2">Generated Composite Preview:</p>
                <img src={compositedImage} alt="Composite preview" className="w-full h-auto rounded shadow-md" />
              </div>
            )}

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Submit
              </button>
            </div>
          </Form>
        )}
      </Formik>
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default FormProduct;
