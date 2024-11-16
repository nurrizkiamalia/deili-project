"use client";

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Product } from "@/types/datatypes";
import Image from "next/image";
import { VscSettings } from "react-icons/vsc";
import { useRouter } from "next/navigation";
import ProductDetailDrawer from "./ProductDetailDrawer";
import ConfirmationDialog from "@/components/ConfirmationDialog";

interface ProductTableProps {
  products: Product[];
  onDeleteProduct: (id: number) => void;
  loading: boolean;
  limit?: number; // Limit the number of displayed products (for RecentProduct)
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onDeleteProduct,
  loading,
  limit,
}) => {
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  const handleDeleteRequest = (id: number) => {
    setProductToDelete(id);
    setIsDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (productToDelete !== null) {
      onDeleteProduct(productToDelete);
      setIsDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const displayedProducts = limit ? products.slice(0, limit) : products;

  return (
    <>
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="flex flex-col gap-5 items-stretch text-sm sm:text-base">
          {displayedProducts.map((product: Product, index) => (
            <div
              className="flex items-center justify-between gap-3"
              key={product.id}
            >
              <p>{index + 1}</p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <Image
                  src={product.image_url}
                  alt={product.food_name}
                  width={100}
                  height={100}
                  className="rounded-xl"
                  unoptimized
                />
                <h3 className="font-semibold">{product.food_name}</h3>
              </div>
              <p>Rp{product.price}</p>
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger className="bg-dspGreen p-2 text-white">
                    <VscSettings />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>{product.food_name}</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <button onClick={() => handleViewProduct(product)}>
                        See Product
                      </button>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <button
                        onClick={() =>
                          router.push(`/product/edit-product?id=${product.id}`)
                        }
                      >
                        Update Product
                      </button>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <button onClick={() => handleDeleteRequest(product.id)}>
                        Delete Product
                      </button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedProduct && (
        <ProductDetailDrawer
          product={selectedProduct}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />
      )}

      <ConfirmationDialog
        isOpen={isDialogOpen}
        title="Delete Confirmation"
        description="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDialogOpen(false)}
      />
    </>
  );
};

export default ProductTable;
