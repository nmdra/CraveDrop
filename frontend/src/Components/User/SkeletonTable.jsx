const SkeletonRow = () => (
    <tr className="animate-pulse border-b border-gray-200 bg-white">
        <td className="px-6 py-4">
            <div className="h-4 w-32 rounded bg-gray-300"></div>
        </td>
        <td className="px-6 py-4">
            <div className="h-4 w-24 rounded bg-gray-300"></div>
        </td>
        <td className="px-6 py-4">
            <div className="h-4 w-20 rounded bg-gray-300"></div>
        </td>
        <td className="px-6 py-4">
            <div className="h-4 w-28 rounded bg-gray-300"></div>
        </td>
    </tr>
)

const SkeletonTable = () => (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-left text-sm text-gray-500 rtl:text-right">
            <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
                <tr>
                    <th scope="col" className="px-6 py-3">
                        Order ID
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Total
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Date
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Status
                    </th>
                </tr>
            </thead>
            <tbody>
                {[...Array(5)].map((_, idx) => (
                    <SkeletonRow key={idx} />
                ))}
            </tbody>
        </table>
    </div>
)

export default SkeletonTable
