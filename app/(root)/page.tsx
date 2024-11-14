import ButtonToPage from "@/components/Button/ButtonToPage";
import Image from "next/image";
import { IoAdd } from "react-icons/io5";
import RecentProduct from "./components/RecentProduct";

export default function Home() {
  return (
    <main className="w-full p-5 mb-16 h-full flex flex-col gap-5 bottom-5">
      <div className="bg-dspGreen text-white rounded-xl p-5 flex flex-col gap-3 w-full">
        <h2 className="capitalize text-lg font-bricolage font-semibold">
          Food name suggestion & image enhancer
        </h2>
        <hr />
        <div className="">
          <ButtonToPage
            className="bg-white w-full text-dspGreen py-2 px-5 rounded-xl flex items-center gap-3"
            links="/add-product"
          >
            <IoAdd /> Add Product
          </ButtonToPage>
        </div>
      </div>
      <div>
        <RecentProduct />
      </div>
    </main>
  );
}
