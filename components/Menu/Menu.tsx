import { ReactNode } from "react";
import { IoHome } from "react-icons/io5";
import Button from "../Button/ButtonToPage";
import { MdCollections } from "react-icons/md";

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
    icon: <MdCollections />,
    links: "/product",
  },
];

const Menu: React.FC<Menus> = ({className}) => {

  return (
    <div className={`py-5 px-5 ${className}`}>
      <ul className="flex items-center justify-between">
        {menuList.map((item, index) => {
          return (
            <li key={index} className="bg-green-600 rounded-full px-5 py-2 cursor-pointer hover:bg-green-900 hover:scale-105 transition-all duration-500">
              <Button links={item.links} className="text-white">{item.icon}</Button>
              <hr className="last:hidden" />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Menu;
