import { FaArrowDown } from 'react-icons/fa'

const Hero = () => {
    const scrollToShopList = () => {
        const shopListSection = document.getElementById('food-list')
        if (shopListSection) {
            shopListSection.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <div>
            <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
                <div className="absolute top-0 right-0 left-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-[#b8f724] opacity-20 blur-[100px]"></div>
            </div>
            <div className="mx-auto h-[40vh] max-w-5xl">
                <div className="flex flex-col justify-center gap-y-8 text-center md:py-[6rem]">
                    <h1 className="mx-auto flex max-w-3xl items-center justify-center gap-2 rounded-full border border-[#b8f724] bg-[#f3ffc6] px-10 py-1 text-lg font-medium">
                        Delicious meals, lightning-fast delivery — Crave what
                        you love, we drop it fast.
                    </h1>
                    <h1 className="text-5xl font-medium">
                        FOOD, SNACKS, DRINKS & MORE <br />
                        DELIVERED RIGHT TO YOUR DOORSTEP
                    </h1>
                    <div
                        className="mx-auto flex max-w-5xl items-center justify-center gap-3 rounded-full border-2 border-[#99DD05] px-10 py-3 hover:cursor-pointer hover:bg-[#f5fce6]"
                        onClick={scrollToShopList}
                    >
                        <FaArrowDown size={18} />
                        Explore your Cravings.
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hero
