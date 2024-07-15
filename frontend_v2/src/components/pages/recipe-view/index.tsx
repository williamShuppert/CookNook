import { SetStateAction, useState } from "react"
import Engagements from "../../engagements"
import Incrementor from "../../incrementor"
import Section from "../../section-title"
import recipeImage from '/../frontend/public/Cheesy-Spinach-Panini.jpeg'
import { Recipe } from "../../../interfaces/recipe"
import List from "../../list"
import Ingredient from "../../ingredient"
import './style.scss'
import Direction from "../../direction"

const RecipeView = () => {
  const [recipe, setRecipe] = useState({
    name: 'Cheesy Spinach Panini',
    author: {
      name: 'Hello Fresh'
    },
    servings: 2,
    ingredients: ["1 tsp dried oregano", "1 clove garlic", "1 lemon", "1 tomato", "4 tbsp mayonnaise", "2 tsp Dijon mustard", "2.5 ounce spinach", "2 tbsp cream cheese", "4 slice sourdough bread", "1/2 cup feta cheese", "1/2 cup mozzarella", "2 tsp cooking oil", "1/4 tsp sugar", "2 tbsp butter", "salt and pepper"],
    directions: ["Peel and mince or grate garlic. Quarter lemon. Thinly slice tomato into rounds and season with salt and pepper.", "In a small bowl, combine mayonnaise, mustard, 1/4 tsp sugar, juice from one lemon wedge, and a pinch of garlic. Season with salt and pepper to taste.", "Heat a drizzle of oil in a large pan over medium-high heat. Add spinach and remaining garlic; season with salt and pepper. Cook, stirring, until spinach is wilted, 2-3 minutes. Transfer spinach to a second small bowl; stir in cream cheese until combined. Turn off heat. Wipe out pan.", "Spread half the sourdough slices with creamy spinach; top with even layers of feta, mozzarella, and tomato. Spread remaining sourdough slices with Dijonnaise (save some for serving). Close sandwiches.", "Melt 1 tbsp butter in pan used for spinach over medium heat. Once hot, add sandwiches and push around in pan until melted butter has absorbed. Cook until bread is golden brown and cheese is slightly melted, 5-6 minutes. Add another 1 tbsp butter to pan, then flip sandwiches and push around again until melted butter has absorbed. Cook until bread is golden brown and cheese is fully melted, 4-6 minutes."]
  } as Recipe)

  const [servings, setServings] = useState(recipe.servings)
  const [editMode, setEditMode] = useState(true)

  const setIngredients = (action: SetStateAction<string[]>) => {
    setRecipe(prev => ({
      ...prev,
      ingredients: typeof action === "function"
        ? action(prev.ingredients)
        : action
    }))
  }

  const setDirections = (action: SetStateAction<string[]>) => {
    setRecipe(prev => ({
      ...prev,
      directions: typeof action === "function"
        ? action(prev.directions)
        : action
    }))
  }

  return (
    <div id="recipe-view">
      <header>
          <h1 className="recipe-name">{recipe.name}</h1>
          <h2 className="author-name">{recipe.author.name}</h2>
      </header>

      <div id="recipe-image">
        <div className="sqr-image-container">
          <img src={recipeImage} />
        </div>
      </div>

      <div className="engagements-container">
        <Engagements />
      </div>

      <button onClick={() => setEditMode(prev => !prev)}>{editMode ? "View" : "Edit"}</button>

      <Section name="servings">
        <Incrementor value={servings} onChange={setServings} min={0} default={1} />
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
            onChange={e => setIngredients(recipe.ingredients.map((v,i) => i == index ? e.target.value : v))}
            onBlur={() => onBlur(ingredient, index)} 
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
          creator={(direction, index, onBlur) => <Direction key={index} step={index+1} value={direction} editMode={editMode}
            onChange={e => setDirections(recipe.directions.map((v,i) => i == index ? e.target.value : v))}
            onBlur={() => onBlur(direction, index)}
          />}
        />
      </Section>

    </div>
  )
}

export default RecipeView