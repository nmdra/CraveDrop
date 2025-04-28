import { useState } from 'react'
import axios from 'axios'
import { useAuthContext } from './useAuthContext'
import { useNavigate } from 'react-router-dom'

export const useLogin = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const { dispatch } = useAuthContext()
    const navigate = useNavigate()

    const login = async (email, password) => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await axios.post('/api/user/auth', {
                email,
                password,
            })

            const { user, accessToken } = response.data

            // Save token and user info separately
            localStorage.setItem('token', accessToken)
            localStorage.setItem('user', JSON.stringify(user))

            // Dispatch user info and token to auth context
            dispatch({ type: 'LOGIN', payload: { user, token: accessToken } })

            setIsLoading(false)
            navigate('/dashboard')
        } catch (error) {
            console.error(error)
            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                setError(error.response.data.message)
            } else {
                setError('Internal server error. Please try again later.')
            }
            setIsLoading(false)
        }
    }

    return { error, isLoading, login }
}
