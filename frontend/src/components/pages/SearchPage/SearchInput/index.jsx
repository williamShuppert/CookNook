import React, { useState } from 'react'
import SearchBar from '../../../common/SearchBar'

const SearchInput = () => {
    const [search, setSearch] = useState('')

    return (
        <div>

            <SearchBar value={search} setValue={setSearch} />

            <hr />
        </div>
    )
}

export default SearchInput