import { SetStateAction, useEffect, useState } from "react"
import Engagements from "../../engagements"
import Incrementor from "../../incrementor"
import Section from "../../section-title"
import { Recipe } from "../../../interfaces/recipe"
import List from "../../list"
import Ingredient from "../../ingredient"
import './style.scss'
import Direction from "../../direction"
import { putRecipe, selectRecipe } from "../../../redux/recipesSlice"
import { useAppSelector } from "../../../redux/hooks"
import { useParams } from "react-router-dom"
import { useDispatch } from "react-redux"

const RecipeView = () => {
  const dispatch = useDispatch()
  const { id: paramId } = useParams()
  const recipe = useAppSelector(selectRecipe(paramId!))

  const [servings, setServings] = useState(recipe?.servings ?? 0)
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    if (recipe) return

    // TODO: attempt to fetch recipe and add to redux store otherwise show 404 recipe page
    dispatch(putRecipe({ id: paramId!, name: 'Not Found', servings: 1, rating: 4, bookmarks: 1, imageSrc: "", author: { id: '-1', name: 'Author'}, ingredients: [], directions: [] }))
  }, [])

  const setIngredients = (action: SetStateAction<string[]>) => {
    if (!recipe) return
    dispatch(putRecipe({
      ...recipe,
      ingredients: typeof action === "function"
        ? action(recipe.ingredients)
        : action
    } as Recipe))
  }

  const setDirections = (action: SetStateAction<string[]>) => {
    if (!recipe) return
    dispatch(putRecipe({
      ...recipe,
      directions: typeof action === "function"
        ? action(recipe.directions)
        : action
    } as Recipe))
  }

  const setRecipeServings = (action: SetStateAction<number>) => {
    if (!recipe) return
    dispatch(putRecipe({
      ...recipe,
      servings: typeof action === "function"
        ? action(recipe.servings)
        : action
    } as Recipe))
  }

  if (!recipe) return <>Loading...</>

  return (
    <div id="recipe-view">
      <header>
          <h1 className="recipe-name">{recipe.name}</h1>
          <h2 className="author-name">{recipe.author.name}</h2>
      </header>

      <div id="recipe-image">
        <div className="sqr-image-container">
          <img src={recipe.imageSrc} />
        </div>
      </div>

      <div className="engagements-container">
        <Engagements />
      </div>

      <button onClick={() => setEditMode(prev => !prev)}>{editMode ? "View" : "Edit"}</button>

      <Section name="servings">
        <Incrementor
          value={editMode ? recipe.servings : servings}
          onChange={editMode ? e => setRecipeServings(e) : setServings}
          min={0} default={1}
        />
      </Section>

      <Section name="Ingredients">
        <List<string>
          editMode={editMode}
          data={recipe.ingredients}
          setData={setIngredients}
          createEmpty={() => ""}
          isEmpty={data => data == ""}
          creator={(ingredient, index, onBlur) => <Ingredient
            key={index} value={ingredient} editMode={editMode}
            multiplier={servings/recipe.servings}
            onChange={e => setIngredients(prev => prev.map((v,i) => i == index ? e.target.value : v))}
            onBlur={e => onBlur(index, e)} 
            onDelete={() => setIngredients(prev => prev.filter((_,i) => i != index))}
          />}
        />
      </Section>

      <Section name="Directions">
        <List<string>
          editMode={editMode}
          data={recipe.directions}
          setData={setDirections}
          createEmpty={() => ""}
          isEmpty={data => data == ""}
          query="textarea"
          creator={(direction, index, onBlur) => <Direction 
            key={index} step={index+1} 
            multiplier={servings/recipe.servings}
            value={direction} editMode={editMode}
            onChange={e => setDirections(prev => prev.map((v,i) => i == index ? e.target.value : v))}
            onBlur={e => onBlur(index, e)}
            onDelete={() => setDirections(prev => prev.filter((_,i) => i != index))}
          />}
        />
      </Section>

    </div>
  )
}

export default RecipeView