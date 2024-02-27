import { useNavigate } from 'react-router-dom'
import { useLoginMutation, useRegisterMutation } from '../../../redux/slices/authApiSlice.js'
import { setUser } from '../../../redux/slices/authSlice.js'
import './style.scss'
import { useState } from 'react'
import { useDispatch } from 'react-redux'

const AuthPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [login, { isLoading }] = useLoginMutation()
    const [register] = useRegisterMutation()

    const [authState, setAuthState] = useState('login')
    const [errors, setErrors] = useState({})
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    const toggleAuthState = () => {
        setErrors({})
        setUsername('')
        setPassword('')
        setAuthState(prev => prev == 'login' ? 'register' : 'login')
    }

    const handleSubmit = async e => {
        e.preventDefault()
        setErrors({})
        const errors = {}

        if (!username) errors.username = 'username required'
        if (!password) errors.password = 'password required'

        if (Object.keys(errors).length > 0)
            return setErrors(errors)

        if (authState == 'login')
            login({ username, password }).unwrap()
                .then(user => {
                    dispatch(setUser(user))
                    navigate('/')
                })
                .catch(_ => setErrors({response: 'Incorrect login' }))
        else if (authState == 'register')
            register({ username, email: email == '' ? null : email, password }).unwrap()
                .then(user => {
                    dispatch(setUser(user))
                    navigate('/')
                })
                .catch(err => setErrors({response: err.data.message}))
    }

    const handleGoogle = async (e) => {
        e.preventDefault()
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`
    }

    const handleRefresh = async () => {
        fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
            method: 'POST',
            credentials: 'include'
        }).then(res => res.json()).then(res => console.log(res))
        .catch(err => console.log(err))
    }

    return (
        <div className='auth-page'>
            <form onSubmit={handleSubmit}>
                <div className='input-group'>
                    <label htmlFor="username">Username</label>
                    <input id="username" name="username" type="text" value={username} onChange={e => setUsername(e.target.value)}/>
                    {errors.username && <span className="error-message">
                        {errors.username}
                    </span>}
                </div>

                {authState=='register' &&
                    <div className='input-group'>
                        <label htmlFor="email">Email</label>
                        <input id="email" name="email" type="text" value={email} onChange={e => setEmail(e.target.value)}/>
                        {errors.username && <span className="error-message">
                            {errors.email}
                        </span>}
                    </div>
                }

                <div className='input-group'>
                    <label htmlFor="password">Password</label>
                    <input id="password" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)}/>
                    {errors.password && <span className="error-message">
                        {errors.password}
                    </span>}
                </div>

                <input disabled={isLoading} type="submit" value={authState} />

                <button onClick={handleGoogle}>Continue with Google</button>

                <span className='auth-state-message'>
                    {authState == 'register'
                        ? "Already have an account"
                        : "Don't have an account"
                    }
                    ? Click <span onClick={toggleAuthState}>here</span>.
                </span>

                {errors.response && <span className='error-message'>{errors.response}</span>}
            </form>

            <button onClick={handleRefresh}>Refresh</button>
        </div>
    )
}

export default AuthPage