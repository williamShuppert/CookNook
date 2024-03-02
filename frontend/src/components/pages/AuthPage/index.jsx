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
    const [passwordConfirm, setPasswordConfirm] = useState('')


    const toggleAuthState = () => {
        setErrors({})
        setUsername('')
        setPassword('')
        setEmail('')
        setPasswordConfirm('')
        setAuthState(prev => prev == 'login' ? 'register' : 'login')
    }

    const handleSubmit = async e => {
        e.preventDefault()
        setErrors({})
        const errors = {}

        if (!username) errors.username = 'username required'
        if (!password) errors.password = 'password required'
        if (authState == 'register' && passwordConfirm != password)
            errors.passwordConfirm = 'passwords do not match'

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
            <h1>CookNook</h1>
            <h2>- {authState} -</h2>
            <form onSubmit={handleSubmit}>
                <div className='input-group'>
                    <label htmlFor="username">Username</label>
                    <input id="username" name="username" type="text" value={username} onChange={e => setUsername(e.target.value)}/>
                    {errors.username && <span className="error-message">
                        {errors.username}
                    </span>}
                </div>

                {authState == 'register' &&
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

                {authState == 'register' &&
                    <div className='input-group'>
                        <label htmlFor="password-confirm">Confirm Password</label>
                        <input id="password-confirm" name="password-confirm" type="password" value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)}/>
                        {errors.username && <span className="error-message">
                            {errors.passwordConfirm}
                        </span>}
                    </div>
                }

                <input disabled={isLoading} type="submit" value={authState} />

                <span className='auth-state-message'>
                    {authState == 'register'
                        ? "Already have an account"
                        : "Don't have an account"
                    }
                    ? Click <span onClick={toggleAuthState}>here</span>.
                </span>

                {errors.response && <span className='error-message'>{errors.response}</span>}

                <div className="socials">
                    <button onClick={handleGoogle} className="gsi-material-button">
                        <div className="gsi-material-button-state"></div>
                        <div className="gsi-material-button-content-wrapper">
                            <div className="gsi-material-button-icon">
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlnsXlink="http://www.w3.org/1999/xlink" style={{display: 'block'}}>
                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                                <path fill="none" d="M0 0h48v48H0z"></path>
                            </svg>
                            </div>
                            <span className="gsi-material-button-contents">Sign in with Google</span>
                            <span style={{display: 'none'}}>Sign in with Google</span>
                        </div>
                    </button>
                </div>
            </form>

            {/* <button onClick={handleRefresh}>Refresh</button> */}

        </div>
    )
}

export default AuthPage