import { useState, useEffect } from 'react'
import useSWR, { mutate } from 'swr'
import axios from 'axios'
import Loading from '../../Components/User/Loading'

const fetcher = (url) =>
    axios
        .get(url, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        .then((res) => res.data.user)

function Settings() {
    const {
        data: user,
        error,
        isLoading,
    } = useSWR('/api/user/', fetcher, {
        dedupingInterval: 5 * 60 * 1000,
    })

    const [firstname, setFirstName] = useState('')
    const [lastname, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [contactNumber, setContactNumber] = useState('')
    const [birthday, setBirthday] = useState('')
    const [password, setPassword] = useState('')

    const [address, setAddress] = useState({
        street: '',
        city: '',
        postalCode: '',
        country: '',
    })

    const [errors, setErrors] = useState({})
    const [successMsg, setSuccessMsg] = useState('')
    const [deleteConfirm, setDeleteConfirm] = useState(false)

    useEffect(() => {
        if (user) {
            setFirstName(user.firstname || '')
            setLastName(user.lastname || '')
            setEmail(user.email || '')
            setBirthday(user.birthday?.substring(0, 10) || '')
            setContactNumber(user.mobileNumbers?.[0]?.number || '')
            setAddress({
                street: user.address?.street || '',
                city: user.address?.city || '',
                postalCode: user.address?.postalCode || '',
                country: user.address?.country || '',
            })
        }
    }, [user])

    const validateForm = () => {
        const newErrors = {}
        if (!firstname.trim()) newErrors.firstname = 'First name is required.'
        if (!lastname.trim()) newErrors.lastname = 'Last name is required.'
        if (!email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/))
            newErrors.email = 'Invalid email format.'
        if (!/^\d{10}$/.test(contactNumber))
            newErrors.contactNumber = 'Phone number must be 10 digits.'
        if (birthday < '1950-01-01' || birthday > '2010-12-31')
            newErrors.birthday = 'Birthday must be between 1950 and 2010.'
        if (password && password.length < 6)
            newErrors.password = 'Password must be at least 6 characters.'

        if (
            !address.street.trim() ||
            !address.city.trim() ||
            !address.postalCode.trim() ||
            !address.country.trim()
        ) {
            newErrors.address = 'All address fields are required.'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSaveChanges = async () => {
        if (!validateForm()) return

        try {
            await axios.put(
                '/api/user/',
                {
                    firstname,
                    lastname,
                    email,
                    password: password || undefined,
                    contactNumber,
                    birthday,
                    defaultAddress: { ...address },
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            )

            setSuccessMsg('User updated successfully.')
            setErrors({})
            setPassword('')
            mutate('/api/user/')
        } catch (err) {
            setSuccessMsg('')
            setErrors({
                server: err.response?.data?.message || 'Update failed.',
            })
        }
    }

    const handleDeleteAccount = async () => {
        try {
            await axios.delete('/api/user/', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
            localStorage.removeItem('token')
            window.location.href = '/login'
        } catch (err) {
            setErrors({ server: 'Failed to delete account. Try again.' })
        }
    }

    if (error) {
        return (
            <div className="mt-10 text-center text-red-500">
                Failed to load user data. Please try again.
            </div>
        )
    }

    if (isLoading || !user) return <Loading />

    return (
        <div className="min-h-screen bg-neutral-100 p-8">
            <div className="mx-auto max-w-4xl rounded-lg border-2 border-green-600 bg-white p-8 shadow-md">
                <h2 className="mb-6 text-2xl font-semibold text-gray-700">
                    Account Settings
                </h2>

                {successMsg && (
                    <p className="mb-4 text-green-600">{successMsg}</p>
                )}
                {errors.server && (
                    <p className="mb-4 text-red-500">{errors.server}</p>
                )}

                <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
                    <div>
                        <label className="block text-gray-700">
                            First Name
                        </label>
                        <input
                            type="text"
                            value={firstname}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full rounded-md border p-2"
                            maxLength={20}
                        />
                        {errors.firstname && (
                            <p className="text-sm text-red-500">
                                {errors.firstname}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-700">Last Name</label>
                        <input
                            type="text"
                            value={lastname}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full rounded-md border p-2"
                            maxLength={20}
                        />
                        {errors.lastname && (
                            <p className="text-sm text-red-500">
                                {errors.lastname}
                            </p>
                        )}
                    </div>

                    <div className="col-span-2">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-md border p-2"
                            maxLength={25}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-700">
                            Phone Number
                        </label>
                        <input
                            type="text"
                            value={contactNumber}
                            onChange={(e) =>
                                setContactNumber(
                                    e.target.value
                                        .replace(/\D/g, '')
                                        .slice(0, 10)
                                )
                            }
                            className={`w-full rounded-md border p-2 ${
                                errors.contactNumber ? 'border-red-500' : ''
                            }`}
                        />
                        {errors.contactNumber && (
                            <p className="text-sm text-red-500">
                                {errors.contactNumber}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-700">Birthday</label>
                        <input
                            type="date"
                            value={birthday}
                            onChange={(e) => setBirthday(e.target.value)}
                            className="w-full rounded-md border p-2"
                            min="1950-01-01"
                            max="2010-12-31"
                        />
                        {errors.birthday && (
                            <p className="text-sm text-red-500">
                                {errors.birthday}
                            </p>
                        )}
                    </div>

                    <div className="col-span-2">
                        <h3 className="mt-4 mb-2 text-lg font-semibold text-gray-700">
                            Address
                        </h3>
                        {errors.address && (
                            <p className="text-sm text-red-500">
                                {errors.address}
                            </p>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700">
                                    Street
                                </label>
                                <input
                                    type="text"
                                    value={address.street}
                                    onChange={(e) =>
                                        setAddress({
                                            ...address,
                                            street: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-md border p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">
                                    City
                                </label>
                                <input
                                    type="text"
                                    value={address.city}
                                    onChange={(e) =>
                                        setAddress({
                                            ...address,
                                            city: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-md border p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">
                                    Postal Code
                                </label>
                                <input
                                    type="text"
                                    value={address.postalCode}
                                    onChange={(e) =>
                                        setAddress({
                                            ...address,
                                            postalCode: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-md border p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">
                                    Country
                                </label>
                                <input
                                    type="text"
                                    value={address.country}
                                    onChange={(e) =>
                                        setAddress({
                                            ...address,
                                            country: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-md border p-2"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-span-2">
                        <label className="mt-4 block text-gray-700">
                            New Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-md border p-2"
                            placeholder="Leave blank to keep current"
                        />
                        {errors.password && (
                            <p className="text-sm text-red-500">
                                {errors.password}
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-6 flex justify-between">
                    <button
                        onClick={handleSaveChanges}
                        className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                    >
                        Save Changes
                    </button>

                    <button
                        onClick={() => setDeleteConfirm(true)}
                        className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                    >
                        Delete Account
                    </button>
                </div>

                {deleteConfirm && (
                    <div className="mt-4 text-red-600">
                        <p>Are you sure you want to delete your account?</p>
                        <button
                            onClick={handleDeleteAccount}
                            className="mt-2 rounded bg-red-600 px-4 py-1 text-white hover:bg-red-700"
                        >
                            Confirm Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Settings
