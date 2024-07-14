import { SetStateAction, useState } from "react"
import Engagements from "../../engagements"
import Incrementor from "../../incrementor"
import Section from "../../section-title"
import recipeImage from '/../frontend/public/Crispy-Parmesan-chicken.avif'
import { Recipe } from "../../../interfaces/recipe"
import List from "../../list"
import Ingredient from "../../ingredient"
import './style.scss'

const RecipeView = () => {
  const [recipe, setRecipe] = useState({
    name: 'Crispy Parmesan Chicken',
    author: {
      name: 'Hello Fresh'
    },
    servings: 3,
    ingredients: ["1 cup water", "2 pinches salt"],
    directions: ["put water in cup", "stir in salt"]
  } as Recipe)

  const [servings, setServings] = useState(recipe.servings)

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

        <Section name="servings">
          <Incrementor value={servings} onChange={setServings} min={1} />
        </Section>

        <Section name="Ingredients">
          <List<string>
            data={recipe.ingredients}
            setData={setIngredients}
            createEmpty={() => ""}
            isEmpty={data => data == ""}
            creator={(ingredient, index, onBlur) => <Ingredient
              key={index} value={ingredient}
              onChange={(newValue) => setIngredients(recipe.ingredients.map((v,i) => i == index ? newValue : v))}
              onBlur={() => onBlur(ingredient, index)} 
            />}
          />
        </Section>

        <Section name="Directions">
          <List<string>
            data={recipe.directions}
            setData={setDirections}
            createEmpty={() => ""}
            isEmpty={data => data == ""}
            query="textarea"
            creator={(direction, index, onBlur) => <textarea
              key={index} value={direction}
              onChange={(e) => setDirections(recipe.directions.map((v,i) => i == index ? e.target.value : v))}
              onBlur={() => onBlur(direction, index)}
            />}
          />
        </Section>

    </div>
  )
}

export default RecipeView