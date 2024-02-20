import './style.scss'
import RecipeCard from './RecipeCard'
import { motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import porkBowl from '/pork-bowl.jpg'
import parmesanChickenImage from '/Crispy-Parmesan-chicken.avif'
import pastaParmesanImage from '/Pasta-Parmesan.jpg'
import chickenOrzoImage from '/Winner-winner-chicken-orzo-dinner.avif'
import koreanBeefImage from '/Korean-beef-bibimbap.avif'
import { useLocation, useNavigate } from 'react-router-dom'
import SearchInput from './SearchInput'

const SearchPage = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const [recipes, setRecipes] = useState([{
            id: 1,
            name: 'Moo Shu Pork Bowl',
            author: 'Hello Fresh',
            description: 'Lorem ipsum dolor sit amet consectetur. Ipsum sit dolor ac risus duis et ultrices commodo. Proin pharetra eget congue quis nunc eget. Id quis fermentum dolor commodo felis est amet aliquet tellus. Ultricies facilisi at sit at vitae morbi leo elementum. Est ipsum sagittis et vulputate ac vitae vitae etiam et. Sit pulvinar sit nulla netus a scelerisque integer. Enim euismod viverra fermentum tristique eget. Lectus sit at volutpat ut.',
            difficulty: 'easy',
            minutes: 20,
            calories: 750,
            rating: 4.8,
            ratings: 40,
            bookmarks: 28,
            userRating: -1,
            userBookmarked: false,
            image: porkBowl
        }, {
            id: 2,
            name: 'Crispy Parmesan Chicken',
            author: 'Hello Fresh',
            description: 'Lorem ipsum dolor sit amet consectetur. Ipsum sit dolor ac risus duis et ultrices commodo. Proin pharetra eget congue quis nunc eget. Id quis fermentum dolor commodo felis est amet aliquet tellus. Ultricies facilisi at sit at vitae morbi leo elementum. Est ipsum sagittis et vulputate ac vitae vitae etiam et. Sit pulvinar sit nulla netus a scelerisque integer. Enim euismod viverra fermentum tristique eget. Lectus sit at volutpat ut.',
            difficulty: 'easy',
            minutes: 20,
            calories: 750,
            rating: 4.6,
            ratings: 40,
            bookmarks: 58,
            userRating: -1,
            userBookmarked: false,
            image: parmesanChickenImage
        }, {
            id: 3,
            name: 'Pasta Parmesan',
            author: 'Hello Fresh',
            description: 'Lorem ipsum dolor sit amet consectetur. Ipsum sit dolor ac risus duis et ultrices commodo. Proin pharetra eget congue quis nunc eget. Id quis fermentum dolor commodo felis est amet aliquet tellus. Ultricies facilisi at sit at vitae morbi leo elementum. Est ipsum sagittis et vulputate ac vitae vitae etiam et. Sit pulvinar sit nulla netus a scelerisque integer. Enim euismod viverra fermentum tristique eget. Lectus sit at volutpat ut.',
            difficulty: 'easy',
            minutes: 20,
            calories: 750,
            rating: 4.9,
            ratings: 40,
            bookmarks: 41,
            userRating: -1,
            userBookmarked: false,
            image: pastaParmesanImage
        }, {
            id: 4,
            name: 'Winner Winner Chicken Orzo Dinner',
            description: 'Lorem ipsum dolor sit amet consectetur. Ipsum sit dolor ac risus duis et ultrices commodo. Proin pharetra eget congue quis nunc eget. Id quis fermentum dolor commodo felis est amet aliquet tellus. Ultricies facilisi at sit at vitae morbi leo elementum. Est ipsum sagittis et vulputate ac vitae vitae etiam et. Sit pulvinar sit nulla netus a scelerisque integer. Enim euismod viverra fermentum tristique eget. Lectus sit at volutpat ut.',
            author: 'Hello Fresh',
            difficulty: 'medium',
            minutes: 20,
            calories: 750,
            rating: 4.2,
            ratings: 40,
            bookmarks: 36,
            userRating: -1,
            userBookmarked: false,
            image: chickenOrzoImage
        }, {
            id: 5,
            name: 'Korean Beef Bibimbap',
            description: 'Lorem ipsum dolor sit amet consectetur. Ipsum sit dolor ac risus duis et ultrices commodo. Proin pharetra eget congue quis nunc eget. Id quis fermentum dolor commodo felis est amet aliquet tellus. Ultricies facilisi at sit at vitae morbi leo elementum. Est ipsum sagittis et vulputate ac vitae vitae etiam et. Sit pulvinar sit nulla netus a scelerisque integer. Enim euismod viverra fermentum tristique eget. Lectus sit at volutpat ut.',
            author: 'Hello Fresh',
            difficulty: 'medium',
            minutes: 20,
            calories: 750,
            rating: 4.2,
            ratings: 40,
            bookmarks: 36,
            userRating: -1,
            userBookmarked: false,
            image: koreanBeefImage
        }
    ])
    
    const setRecipe = useCallback((updatedRecipe) => {
        const index = recipes.findIndex(recipe => recipe.id == updatedRecipe.id)
        
        setRecipes(recipes => [
            ...recipes.slice(0, index),
            updatedRecipe,
            ...recipes.slice(index + 1),
        ])
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