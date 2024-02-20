import './style.scss'
import RecipeCard from './RecipeCard'
import { motion } from 'framer-motion'
import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchInput from './SearchInput'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRecipes, recipeUpdated, selectRecipes, selectRecipesStatus } from '../../../features/recipes/recipesSlice'

const SearchPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const recipes = useSelector(selectRecipes)
    const recipesStatus = useSelector(selectRecipesStatus)

    useEffect(() => {
        if (recipesStatus == 'idle')
            dispatch(fetchRecipes())
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
            <h1 className='page-title'>Recipe Search</h1>

            <SearchInput />

            <div className="results">
                {recipes.map(recipe =>
                    <RecipeCard key={recipe.id} recipe={recipe} setRecipe={setRecipe} onClick={handleRecipeClick} />
                )}
            </div>
        </motion.div>
    )
}

export default SearchPage