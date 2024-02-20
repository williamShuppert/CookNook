import './style.scss'
import searchIcon from "/src/assets/icons/magnifying-glass-solid.svg"
import xIcon from "/src/assets/icons/xmark-solid.svg"

const SearchBar = ({value, setValue}) => {

    const handleClear = () => {
        setValue('')

    }

    return (
        <div className='search-bar'>
            <img src={searchIcon} className='icon' />
            <input type="search" placeholder="Search" value={value} onChange={e => setValue(e.target.value)} required />
            <img src={xIcon} className='icon' onClick={handleClear} />
        </div>
    )
}

export default SearchBar