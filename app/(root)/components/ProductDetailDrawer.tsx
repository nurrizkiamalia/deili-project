"use client";

import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Product } from "@/types/datatypes";

interface ProductDetailDrawerProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailDrawer: React.FC<ProductDetailDrawerProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  if (!product) return null;

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
          document.body.style.overflow = "auto";
        }
      }}
    >
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>{product.food_name}</DrawerTitle>
            <DrawerDescription>Product Details</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex flex-col gap-3">
              <Image
                src={product.image_url}
                alt={product.food_name}
                width={200}
                height={200}
                className="rounded-xl"
                unoptimized
              />
              <p>
                <strong>Category:</strong> {product.category_id}
              </p>
              <p>
                <strong>Food Name:</strong> {product.food_name}
              </p>
              <p>
                <strong>Price:</strong> Rp{product.price}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(product.created_at).toLocaleString()}
              </p>
            </div>
          </div>
          <DrawerFooter>
            <Button onClick={onClose}>Close</Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ProductDetailDrawer;
