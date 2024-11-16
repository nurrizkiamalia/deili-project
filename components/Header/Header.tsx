import Link from "next/link"

const Header: React.FC = () => {
    return(
        <>
        <div className="py-3 px-5 bg-green-500 text-white w-full text-center">
            <Link href='/' className="text-2xl font-bricolage font-bold tracking-tighter">Deili name & image enhancer</Link>
        </div>
        </>
    )
}

export default Header