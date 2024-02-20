import './style.scss'
import searchIcon from '/src/assets/icons/magnifying-glass-solid.svg'
import addIcon from '/src/assets/icons/circle-plus-solid.svg'
import bookIcon from '/src/assets/icons/book-bookmark-solid.svg'
import profileIcon from '/src/assets/icons/user-solid.svg'
import homeIcon from '/src/assets/icons/house-solid.svg'
import { NavLink } from 'react-router-dom'

const NavBar = () => {
    return (
        <nav>
            <NavLink to="/" reloadDocument={false}>
                <img className="icon" src={homeIcon} />
            </NavLink>
            <NavLink to="/search" reloadDocument={false}>
                <img className="icon" src={searchIcon} />
            </NavLink>
            <NavLink to="/add">
                <img className="icon" src={addIcon} />
            </NavLink>
            <NavLink  to="/bookmarks">
                <img className="icon" src={bookIcon} />
            </NavLink>
            <NavLink  to="/profile">
                <img className="icon" src={profileIcon} />
            </NavLink>
        </nav>
    )
}


export default NavBar
