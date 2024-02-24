import { useLocation, Navigate, Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectUser } from "../../../redux/slices/authSlice"

const RequireAuth = () => {
    const user = useSelector(selectUser())
    const location = useLocation()

    return (
        user
            ? <Outlet />
            : <Navigate to="/auth" state={{from: location}} replace />
    )
}

export default RequireAuth