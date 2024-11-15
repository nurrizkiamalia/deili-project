"use client";

import React from 'react';
import { useProduct } from '@/hooks/useProduct';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Product } from '@/types/datatypes';
import Image from 'next/image';
import { VscSettings } from 'react-icons/vsc';
import { useRouter } from 'next/navigation';

const RecentProduct: React.FC = () => {
  const { products, deleteProduct, loading } = useProduct();
  const router = useRouter();

  const handleDelete = async (id: number) => {
    await deleteProduct(id);
    window.location.reload();
  };

  return (
    <div className="bg-slate-200 rounded-xl p-5 flex flex-col gap-3">
      <h2 className="capitalize text-lg font-bricolage font-semibold">
        Recent Products
      </h2>
      <hr className="border-dspDarkGray" />
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="flex flex-col gap-5 items-stretch text-sm sm:text-base">
          {products.slice(0, 3).map((product: Product, index) => (
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
                  unoptimized // To bypass Next.js optimization if images don't load quickly
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
                    <DropdownMenuItem>See Product</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <button onClick={() => router.push(`/`)}>Update Product</button>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <button onClick={() => handleDelete(product.id)}>Delete Product</button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentProduct;
