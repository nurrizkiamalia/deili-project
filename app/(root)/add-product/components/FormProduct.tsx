"use client";
import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useCategory } from "@/hooks/useCategory";
import { useFoodNameSuggestions } from "@/hooks/useFoodNameSuggestions";
import { useBackgroundChangeSuggestions } from "@/hooks/useBackgroundChangeSuggestions";
import { useProduct } from "@/hooks/useProduct";
import { Category } from "@/types/datatypes";

interface FormProductProps {
  initialValues: any;
  onSubmit: (values: any) => Promise<void>;
}

const FormProduct: React.FC<FormProductProps> = ({ initialValues, onSubmit }) => {
  const {
    categories,
    loading: loadingCategories,
    error: errorCategories,
  } = useCategory();
  const { addProduct } = useProduct();
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
    processedImage,
    loading: loadingBackground,
    error: errorBackground,
    suggestBackgroundChange,
  } = useBackgroundChangeSuggestions();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (processedImage && suggestedImages.length > 0) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const background = new Image();
          const foreground = new Image();

          background.src = suggestedImages[0];
          foreground.src = processedImage;

          background.onload = () => {
            foreground.onload = () => {
              canvas.width = background.width;
              canvas.height = background.height;

              ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

              const scaleFactor = 0.8;
              const xOffset =
                (canvas.width - foreground.width * scaleFactor) / 2;
              const yOffset =
                (canvas.height - foreground.height * scaleFactor) / 2;

              ctx.globalAlpha = 0.9;
              ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
              ctx.shadowBlur = 15;
              ctx.shadowOffsetX = 5;
              ctx.shadowOffsetY = 5;

              ctx.drawImage(
                foreground,
                xOffset,
                yOffset,
                foreground.width * scaleFactor,
                foreground.height * scaleFactor
              );

              ctx.globalAlpha = 1;
              ctx.shadowColor = "transparent";
            };
          };
        }
      }
    }
  }, [processedImage, suggestedImages]);

  const handleSaveProduct = async (values: any) => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.toBlob(async (blob) => {
        if (blob) {
          // Convert Blob to File, giving it a name and setting the type
          const file = new File([blob], "combined-image.png", { type: "image/png" });
  
          // Call onSubmit with form values and the combined image file
          await onSubmit({ ...values, image: file });
        }
      }, "image/png");
    }
  };  

  const handleBackgroundChange = (file: File, prompt: string) => {
    if (file && prompt) {
      console.log("Selected image file:", file);
      suggestBackgroundChange(file, prompt);
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
        onSubmit={onSubmit}
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

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="price"
              >
                Price
              </label>
              <Field
                name="price"
                type="number"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <ErrorMessage
                name="price"
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

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Background Command
              </label>
              <Field
                name="background_command"
                type="text"
                placeholder="Describe the new background"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onBlur={(e: any) => {
                  const imageFile = (
                    document.querySelector(
                      "input[name='image_url']"
                    ) as HTMLInputElement
                  )?.files?.[0];
                  if (imageFile && e.target.value) {
                    handleBackgroundChange(imageFile, e.target.value);
                  }
                }}
              />
              <p className="text-xs text-red-500">
                click everywhere to generate the image
              </p>
            </div>

            {loadingBackground ? (
              <div>Generating background...</div>
            ) : errorBackground ? (
              <div className="text-red-500">{errorBackground}</div>
            ) : (
              <div className="mb-6">
                <canvas ref={canvasRef} className="w-full rounded" />
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
