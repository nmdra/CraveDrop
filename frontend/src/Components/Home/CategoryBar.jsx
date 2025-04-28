import { Link } from 'react-router-dom'

const CategoryBar = () => {
    return (
        <div className="mx-auto max-w-7xl border-b py-5">
            <div className="flex items-center justify-center gap-10 text-center text-sm">
                <Link
                    to="/shops"
                    className="cursor-pointer text-sm text-black hover:text-green-600 hover:underline"
                >
                    Vegetables
                </Link>
                <Link
                    to="/shops"
                    className="cursor-pointer text-sm text-black hover:text-green-600 hover:underline"
                >
                    Fruits
                </Link>
                <Link
                    to="/shops"
                    className="cursor-pointer text-sm text-black hover:text-green-600 hover:underline"
                >
                    Spices
                </Link>
                <Link
                    to="/shops"
                    className="cursor-pointer text-sm text-black hover:text-green-600 hover:underline"
                >
                    Animal Products
                </Link>
            </div>
        </div>
    )
}

export default CategoryBar
