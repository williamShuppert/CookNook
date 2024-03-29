import './style.scss'
import searchIcon from '/src/assets/icons/magnifying-glass-solid.svg'
import addIcon from '/src/assets/icons/circle-plus-solid.svg'
import bookIcon from '/src/assets/icons/book-bookmark-solid.svg'
import profileIcon from '/src/assets/icons/user-solid.svg'
import homeIcon from '/src/assets/icons/house-solid.svg'
import backIcon from '/src/assets/icons/arrow-left-solid.svg'
import { NavLink, Link } from 'react-router-dom'

const NavBar = () => {
    return (
        <nav>
            <Link to=".." reloadDocument={false}>
                <img className="icon" src={backIcon} />
            </Link>
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
