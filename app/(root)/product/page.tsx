"use client";

import Image from 'next/image';
import { useProduct } from '@/hooks/useProduct';
import { Product } from '@/types/datatypes';

const ProductList: React.FC = () => {
  const { products } = useProduct();

  return (
    <div className="flex flex-col gap-3 p-5 mt-5 mb-16">
      <h1 className="text-xl font-semibold font-bricolage">Product List</h1>
      <hr />
      <div className="flex flex-col gap-3 items-start">
        {products.map((product: Product, index) => {
          return (
            <div className="flex items-center justify-between gap-3" key={product.id}>
              <p>{index + 1}</p>
              <Image
                src={product.image_url}
                alt={product.food_name}
                width={100}
                height={100}
                className="rounded-xl"
              />
              <h3>{product.food_name}</h3>
              <p>{product.category_id}</p>
              <p>Rp{product.price}</p>
              <hr className="" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductList;
