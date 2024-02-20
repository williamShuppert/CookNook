import './index.scss'
import porkBowl from '/pork-bowl.jpg'
import arrowLeft from '/src/assets/icons/arrow-left-solid.svg'
import ellipsis from '/src/assets/icons/ellipsis-solid.svg'
import SectionHeader from '../../common/SectionHeader'
import GeneralRecipeInfo from '../../common/GeneralRecipeInfo'
import Interactions from './Interactions'
import { motion } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

const RecipeViewPage = () => {
    const pageRef = useRef()
    const [recipe, setRecipe] = useState()

    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (location.state?.recipe == null) {
            navigate('/search')
            return;
        }
        
        setRecipe(location.state.recipe)
    }, [])

    const handleNav = () => {
        pageRef.current.style.top = -window.scrollY + 'px' // About to animate out, set top to prevent scroll snapping
        navigate('/search')
    }

    const onAnimationComplete = style => {
        pageRef.current.style.position = 'absolute' // Allow scrolling on recipe view and moves component to top of page

        if (style.x == 0) // Finished animated in
            window.scrollTo(0,0); // Snap to top of page
        else // Finished animating out
            pageRef.current.style.display = 'none' // Prevent any visual errors
    }

    const onAnimationStart = style => {
        pageRef.current.style.position = 'fixed' // Disables scrolling on this component
        pageRef.current.style.left = '0'
        pageRef.current.style.right = '0'

        if (style.x == 0) // Started animating in
            pageRef.current.style.top = '0'

        window.scrollTo(0, location.state?.scrollY) // Scroll to saved scroll location
    }

    return (
        <motion.div
            ref={pageRef}
            className='recipe-view-page'
            transition={{ ease: 'easeInOut', duration: .4}}
            initial={{x: '100%'}}
            animate={{x: 0}}
            exit={{x: '100%'}}

            onAnimationComplete={onAnimationComplete}
            onAnimationStart={onAnimationStart}
        >
            <header>
                <div>
                    <button className='button-circle' onClick={handleNav}>
                        <img className='icon' src={arrowLeft} />
                    </button>
                </div>

                <div className="name-and-author">
                    <h1 className="page-title">{recipe?.name}</h1>
                    <span>{recipe?.author}</span>
                </div>

                <div>
                    <button className='button-circle'><img className='icon' src={ellipsis} /></button>
                </div>
            </header>

            <div className="page">

                <div className="hero">
                    <div className="sqr">
                        <img src={recipe?.image} />
                    </div>

                    <Interactions recipe={recipe} setRecipe={setRecipe} />
                </div>

                <GeneralRecipeInfo difficulty={recipe?.difficulty} minutes={recipe?.minutes} calories={recipe?.calories} />

                <p className="description">
                    {recipe?.description}
                    {recipe?.description}
                    <span>(click to keep reading)</span>
                </p>

                <SectionHeader title="ingredients" />
            </div>
        </motion.div>
    )
}

export default RecipeViewPage