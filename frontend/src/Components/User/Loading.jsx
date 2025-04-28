import React from 'react'
import farmcartLogo from '../../assets/logo.png'

function Loading() {
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="flex flex-col items-center">
                {/* Logo */}
                <img
                    src={farmcartLogo}
                    alt="Site Logo"
                    className="mb-4 h-8 animate-pulse"
                />

                {/* Spinner */}
                <div
                    className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                    role="status"
                >
                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !border-0 !p-0 !whitespace-nowrap ![clip:rect(0,0,0,0)]">
                        Loading...
                    </span>
                </div>

                {/* Skeleton Loader for content */}
                <div className="mt-8 space-y-4">
                    <div className="h-6 w-48 animate-pulse rounded-md bg-gray-300"></div>
                    <div className="h-6 w-64 animate-pulse rounded-md bg-gray-300"></div>
                    <div className="h-6 w-40 animate-pulse rounded-md bg-gray-300"></div>
                </div>
            </div>
        </div>
    )
}

export default Loading
