import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { removeUser, setUser } from '../../../redux/slices/authSlice'

const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    const user = searchParams.get('user')
    if (user) {
      dispatch(setUser(JSON.parse(user)))
      navigate('/', {replace:true})
    } else {
      dispatch(removeUser())
      navigate('/auth', {replace:true})
    }
  }, [])

  return <>Loading</>
}

export default AuthCallbackPage