import './style.scss'
import { memo, useEffect } from 'react'
import GeneralRecipeInfo from '../../../common/GeneralRecipeInfo'
import starReg from '/src/assets/icons/star-regular.svg'
import starSolid from '/src/assets/icons/star-solid.svg'
import bookmarkReg from '/src/assets/icons/bookmark-regular.svg'
import bookmarkSolid from '/src/assets/icons/bookmark-solid.svg'
import { useNavigate } from 'react-router-dom'

const RecipeCard = ({ recipe, setRecipe, onClick }) => {
    const navigate = useNavigate()

    const handleCardClick = () => {
        onClick(recipe)

        // navigate('/', {state: {
        //     recipe,
        //     scrollY: window.scrollY
        // }})

        // prevent height of document from going to zero between animations
        // document.documentElement.style.minHeight = '1000%'
    }

    const handleRatingClick = e => {
        e.stopPropagation()

        setRecipe({
            ...recipe,
            userRating: recipe.userRating == -1 ? 5 : -1
        })
    }

    const handleBookmarkClick = e => {
        e.stopPropagation()

        setRecipe({
            ...recipe,
            userBookmarked: !recipe.userBookmarked,
            bookmarks: recipe.bookmarks + (recipe.userBookmarked?-1:1)
        })
    }

    return (
        <div className='recipe-card' onClick={handleCardClick}>
            <div className="sqr">
                <img src={recipe.image} />
                <button className='ratings' onClick={handleRatingClick}>
                    <img className="icon star" src={recipe.userRating!=-1?starSolid:starReg} />
                    <span>{recipe.rating}</span>
                </button>
                <button className='bookmarks' onClick={handleBookmarkClick}>
                    <img className="icon" src={recipe.userBookmarked?bookmarkSolid:bookmarkReg} />
                    <span>{recipe.bookmarks}</span>
                </button>
            </div>
            <div className="body">
                <div className="name-and-author">
                    <h1>{recipe.name}</h1>
                    <span >{recipe.author}</span>
                </div>

                <GeneralRecipeInfo difficulty={recipe.difficulty} minutes={recipe.minutes} calories={recipe.calories} noBorder={true} />
            </div>
        </div>
    )
}

export default memo(RecipeCard)