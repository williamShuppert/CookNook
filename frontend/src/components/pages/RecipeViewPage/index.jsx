import './index.scss'
import arrowLeft from '/src/assets/icons/arrow-left-solid.svg'
import ellipsis from '/src/assets/icons/ellipsis-solid.svg'
import SectionHeader from '../../common/SectionHeader'
import GeneralRecipeInfo from '../../common/GeneralRecipeInfo'
import Interactions from './Interactions'
import { motion } from 'framer-motion'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { api, recipeUpdated, selectRecipeById } from '../../../redux/slices/searchPageSlice'

const RecipeViewPage = () => {
    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()
    const pageRef = useRef()
    const { id: paramId } = useParams()
    const desiredId = paramId ? paramId : location.state.recipe.id

    const [recipe, setRecipe] = useState(
        useSelector(selectRecipeById(desiredId))
    )

    useEffect(() => {

        const getRecipe = async () => {
            if (recipe?.id == desiredId) return
            try {
                const foundRecipe = await dispatch(api.getRecipe(desiredId)).unwrap()
                if (!foundRecipe)
                    navigate('/search')
                else
                    setRecipe(foundRecipe)
            } catch {
                navigate('/search')
            }
        }
        getRecipe()

    }, [recipe, dispatch, desiredId])

    const handleRecipeUpdate = (updatedRecipe) => {
        dispatch(recipeUpdated(updatedRecipe)) // attempt to update redux
        setRecipe(updatedRecipe) // update this component
        dispatch(api.putRecipe(updatedRecipe)) // update db
    }

    const handleNav = () => {
        pageRef.current.style.top = -window.scrollY + 'px' // About to animate out, set top to prevent scroll snapping
        navigate('/search')
    }

    const onAnimationComplete = style => {
        pageRef.current.style.position = 'absolute' // Allow scrolling on recipe view and moves component to top of page

        if (style.x == 0) // Finished animated in
            window.scrollTo(0,0) // Snap to top of page
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

                    <Interactions recipe={recipe} setRecipe={handleRecipeUpdate} />
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