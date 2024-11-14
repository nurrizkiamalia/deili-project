"use client";

import { useRouter } from "next/navigation";

interface ButtonProps{
    children?: JSX.Element | React.ReactNode;
    className?: string;
    links?: string;
}

const ButtonToPage: React.FC<ButtonProps> = ({children, className, links}) => {

    const router = useRouter();

    return(
        <>
        <button className={` ${className}`} onClick={ () => router.push(`${links}`)}>
            {children}
        </button>
        </>
    )
}

export default ButtonToPage