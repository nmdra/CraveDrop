import { process } from '../../lib/constants/data'

const ProcessCTA = () => {
    return (
        <div className="mx-auto max-w-7xl py-[5rem]">
            <div className="grid grid-cols-1 items-center justify-center gap-6 md:grid-cols-3">
                {process.map((item, index) => (
                    <div
                        key={index}
                        className="flex flex-col justify-center gap-y-4 text-center"
                    >
                        <h1 className="text-4xl text-[#04530D]">{item.id}.</h1>
                        <h1 className="text-xl font-semibold">{item.title}</h1>
                        <p className="text-sm text-neutral-500">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ProcessCTA
