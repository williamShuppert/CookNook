import './index.scss'
import starReg from '/src/assets/icons/star-regular.svg'
import starSolid from '/src/assets/icons/star-solid.svg'
import bookmarkReg from '/src/assets/icons/bookmark-regular.svg'
import bookmarkSolid from '/src/assets/icons/bookmark-solid.svg'
import commentReg from '/src/assets/icons/comment-regular.svg'
import { useState } from 'react'
import Drawer from '../../../common/Drawer'

const Interactions = ({recipe, setRecipe, comments}) => {
    // const [userRating, setUserRating] = useState(-1)
    // const [bookmarked, setBookmarked] = useState(false)
    const [ratingOpen, setRatingOpen] = useState(false)

    const handleRateClick = () => {
        setRatingOpen(prev => !prev)
    }

    const handleUserRating = (userRating) => {
        if (userRating == recipe?.userRating)
            setRecipe({
                ...recipe,
                userRating: -1
            })
        else 
            setRecipe({
                ...recipe,
                userRating
            })
    }

    const handleBookmarkClick = () => {
        setRecipe({
            ...recipe,
            userBookmarked: !recipe.userBookmarked,
            bookmarks: recipe.bookmarks + (recipe.userBookmarked?-1:1)
        })
    }

    return (
        <div className="interactions">
            <button onClick={handleRateClick}>
                <img className="icon" src={recipe?.userRating!=-1?starSolid:starReg} />
                <span>{recipe?.rating}</span>
            </button>
            <button  onClick={handleBookmarkClick}>
                <img className="icon" src={recipe?.userBookmarked?bookmarkSolid:bookmarkReg} />
                <span>{recipe?.bookmarks}</span>
            </button>
            {/* <button>
                <img className="icon" src={commentReg} />
                <span>{comments}</span>
            </button> */}

            <Drawer name="your rating" isOpen={ratingOpen} handleClose={() => setRatingOpen(false)}>
                <div className="stars">
                    {[1,2,3,4,5].map(rating =>
                        <img
                            key={rating}
                            className="icon"
                            src={recipe?.userRating>=rating?starSolid:starReg}
                            onClick={() => handleUserRating(rating)}
                        />
                    )}
                </div>
            </Drawer>
        </div>
    )
}

export default Interactions