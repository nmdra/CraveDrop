import { useEffect, useState } from 'react'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { useNavigate } from 'react-router-dom'
import foodData from '../../mock/shop'

// Initialize mock adapter
const mock = new MockAdapter(axios, { delayResponse: 1000 }) // optional delay
mock.onGet('/api/foods').reply(200, foodData)
mock.onAny().passThrough()

const FoodList = () => {
    const [foods, setFoods] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        const fetchFoods = async () => {
            try {
                const { data } = await axios.get('/api/foods')
                setFoods(data)
            } catch (err) {
                console.error('Error fetching food items:', err)
                setError('Failed to fetch food items')
            } finally {
                setLoading(false)
            }
        }

        fetchFoods()
    }, [])

    if (loading) {
        return (
            <div className="grid grid-cols-1 gap-6 px-10 py-[5rem] md:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        role="status"
                        className="animate-pulse rounded-lg border border-gray-200 p-4 shadow"
                    >
                        <div className="mb-4 flex h-48 items-center justify-center rounded bg-gray-300" />
                        <div className="mb-2.5 h-4 w-3/4 rounded-full bg-gray-200"></div>
                        <div className="mb-2.5 h-4 w-1/2 rounded-full bg-gray-200"></div>
                        <div className="h-4 w-2/3 rounded-full bg-gray-200"></div>
                    </div>
                ))}
            </div>
        )
    }

    if (error) {
        return <p className="py-10 text-center text-red-500">{error}</p>
    }

    if (!foods.length) {
        return (
            <div className="py-20 text-center">
                <h2 className="text-2xl">No food items found.</h2>
                <button
                    className="mt-4 rounded bg-[#b8f724] px-6 py-3 hover:bg-[#f3ffc6]"
                    onClick={() => navigate('/')}
                >
                    Go Back
                </button>
            </div>
        )
    }

    return (
        <div id="food-list" className="mx-auto max-w-7xl py-[5rem]">
            <h1 className="pb-10 text-4xl">Trending</h1>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                {foods.map((food) => (
                    <div
                        key={food.id}
                        className="cursor-pointer rounded-lg border-2 border-[#b8f724] p-2 transition-transform hover:scale-105 hover:border-[#f3ffc6] hover:shadow-lg"
                        onClick={() => navigate(`/foods/${food.id}`)}
                    >
                        <img
                            src={food.image}
                            alt={food.name}
                            className="h-[200px] w-[300px] transform rounded-md object-cover transition-transform hover:scale-102"
                        />
                        <div className="flex flex-col gap-y-2 py-3">
                            <h1 className="text-xl">{food.name}</h1>
                            <div className="flex items-center gap-3">
                                <h1>{food.category}</h1>
                                <h1>{food.origin}</h1>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex items-center justify-center pt-10 pb-[6rem]">
                <button
                    className="rounded-lg bg-[#b8f724] px-10 py-4 hover:bg-[#f3ffc6]"
                    onClick={() => navigate('/home')}
                >
                    View More
                </button>
            </div>
            <div className="mx-auto h-[0.6vh] max-w-3xl bg-[#f3ffc6]"></div>
        </div>
    )
}

export default FoodList
