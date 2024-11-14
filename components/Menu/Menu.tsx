import { ReactNode } from "react";
import { IoHome } from "react-icons/io5";
import Button from "../Button/ButtonToPage";
import { BsCollectionFill } from "react-icons/bs";
import { BiUser } from "react-icons/bi";

interface MenuProps {
  icon: JSX.Element | ReactNode;
  links: string;
}

interface Menus{
    className?: string;
}

const menuList: MenuProps[] = [
  {
    icon: <IoHome />,
    links: "/",
  },
  {
    icon: <BsCollectionFill />,
    links: "/product",
  },
];

const Menu: React.FC<Menus> = ({className}) => {

  return (
    <div className={`py-3 px-5 bg-gray-200 rounded-2xl border border-dspGreen mb-2 ${className}`}>
      <ul className="flex items-center justify-between w-full gap-10">
        {menuList.map((item, index) => {
          return (
            <li key={index} className="  w-full">
              <Button links={item.links} className="text-white bg-dspGreen rounded-full px-5 py-2 cursor-pointer w-fit hover:bg-dspDarkGreen hover:scale-105 transition-all duration-500">{item.icon}</Button>
              <hr className=" border-r-2 last:hidden" />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Menu;
