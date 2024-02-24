import { useNavigate } from 'react-router-dom'
import { useLoginMutation } from '../../../redux/slices/authApiSlice'
import { setUser } from '../../../redux/slices/authSlice'
import './style.scss'
import { useState } from 'react'

const AuthPage = () => {
    const navigate = useNavigate()
    const [login, { isLoading }] = useLoginMutation()

    const [authState, setAuthState] = useState('login')
    const [errors, setErrors] = useState({})
    const [username, setUsername] = useState('')
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

        login({ username, password }).unwrap()
            .then(res => {
                setUser(res)
                navigate('/')
            })
            .catch(_ => setErrors({response: 'Incorrect login' }))
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

                <div className='input-group'>
                    <label htmlFor="password">Password</label>
                    <input id="password" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)}/>
                    {errors.password && <span className="error-message">
                        {errors.password}
                    </span>}
                </div>

                <input disabled={isLoading} type="submit" value={authState} />

                <span className='auth-state-message'>
                    {authState == 'register'
                        ? "Already have an account"
                        : "Don't have an account"
                    }
                    ? Click <span onClick={toggleAuthState}>here</span>.
                </span>


                {errors.response && <span className='error-message'>{errors.response}</span>}
            </form>
        </div>
    )
}

export default AuthPage