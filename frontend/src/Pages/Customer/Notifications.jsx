import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { FiBell, FiCheckCircle, FiX } from 'react-icons/fi'

const fetcher = (url) => fetch(url).then((res) => res.json())

const Notifications = () => {
    const [userId, setUserId] = useState(null)

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'))
        if (storedUser?.userId) {
            setUserId(storedUser.userId)
        }
    }, [])

    const {
        data: notifications,
        mutate,
        isLoading,
    } = useSWR(userId ? `/api/notify/message/${userId}` : null, fetcher)

    const markAsRead = async (id) => {
        await fetch(`/api/notify/message/read/${id}`, {
            method: 'PATCH',
        })
        mutate()
    }

    const deleteNotification = async (id) => {
        await fetch(`/api/notify/message/${id}`, {
            method: 'DELETE',
        })
        mutate()
    }

    return (
        <div className="mx-auto max-w-5xl rounded-lg bg-white p-6 shadow-lg">
            <h1 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-800">
                <FiBell className="text-xl" />
                Notifications
            </h1>

            {!userId ? (
                <div className="text-center text-gray-500">
                    Please log in to view notifications.
                </div>
            ) : isLoading ? (
                <div className="text-center text-gray-500">Loading...</div>
            ) : notifications?.length === 0 ? (
                <div className="text-center text-gray-500">
                    No notifications
                </div>
            ) : (
                <div className="space-y-4">
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`flex items-center justify-between rounded-md border p-4 ${
                                notification.isRead
                                    ? 'bg-gray-100'
                                    : 'bg-blue-50'
                            }`}
                        >
                            <div className="flex flex-col space-y-2">
                                <p className="text-sm">{notification.title}</p>
                                <p className="text-xs text-gray-700">
                                    {notification.body}
                                </p>
                                <span className="text-xs text-gray-500">
                                    {new Date(
                                        notification.createdAt
                                    ).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                {!notification.isRead && (
                                    <button
                                        onClick={() =>
                                            markAsRead(notification.id)
                                        }
                                        className="text-green-600 hover:text-green-800"
                                    >
                                        <FiCheckCircle className="text-lg" />
                                    </button>
                                )}
                                <button
                                    onClick={() =>
                                        deleteNotification(notification.id)
                                    }
                                    className="text-red-600 hover:text-red-800"
                                >
                                    <FiX className="text-lg" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Notifications
