import './style.scss'
import RecipeCard from './RecipeCard'
import { motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { api, recipeUpdated, selectRecipes, selectRecipesStatus } from '../../../redux/slices/searchPageSlice'

const SearchPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const recipes = useSelector(selectRecipes)
    const recipesStatus = useSelector(selectRecipesStatus)

    const [search, setSearch] = useState('')

    useEffect(() => {
        if (recipesStatus == 'idle')
            dispatch(api.getRecipeSearch())
    }, [dispatch, recipesStatus])

    
    const setRecipe = useCallback((updatedRecipe) => {
        dispatch(recipeUpdated(updatedRecipe)) 
    }, [])

    const handleRecipeClick = useCallback(recipe => {
        navigate('/search/' + recipe.id, {state: {
            recipe,
            scrollY: window.scrollY
        }})
    }, [])

    return (
        <motion.div
            className='search-page'
            transition={{ ease: 'easeInOut', duration:.4, delay: .1}}
            initial={{x: -100}}
            animate={{x: 0}}
            exit={{x: -100}}
        >
            <div className="page-header">
                <h1>CookNook</h1>
                <h2>- recipe search -</h2>
            </div>

            <div className="input-group search-bar">
                <label htmlFor='search'>Search</label>
                <input id='search' type="search" value={search} onChange={e => setSearch(e.target.value)} required />
            </div>

            <div className="results">
                {recipes.map(recipe =>
                    <RecipeCard key={recipe.id} recipe={recipe} setRecipe={setRecipe} onClick={handleRecipeClick} />
                )}
            </div>
        </motion.div>
    )
}

export default SearchPage