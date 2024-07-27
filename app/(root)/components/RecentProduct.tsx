import { ProductList } from "@/data/data";
import Image from "next/image";

const RecentProduct: React.FC = () => {
  return (
    <>
      <div className="bg-slate-200 rounded-xl p-5 flex flex-col gap-3">
        <h2 className="capitalize text-lg font-bricolage font-semibold">
          recent product
        </h2>
        <hr className="border-dspDarkGray" />
        <div className="flex flex-col gap-3 items-start">
          {ProductList.map((product) => {
            return (
              <div
                className={`items-center justify-between gap-3 ${
                  product.id > 3 ? "hidden" : "flex"
                }`}
                key={product.id}
              >
                <p></p>
                <Image
                  src={`/assets/${product.image}`}
                  alt={product.name}
                  width={100}
                  height={100}
                  className="rounded-xl"
                />
                <h3>{product.name}</h3>
                <p>{product.category}</p>
                <p>Rp{product.price}</p>
                <hr />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default RecentProduct;
