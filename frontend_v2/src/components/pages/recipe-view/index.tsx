import { useState } from "react"
import Engagements from "../../engagements"
import Incrementor from "../../incrementor"
import Section from "../../section-title"
import './style.scss'

import recipeImage from '/../frontend/public/Crispy-Parmesan-chicken.avif'

const RecipeView = () => {
  const [servings, setServings] = useState(1)

  return (
    <div id="recipe-view">
        <header>
            <h1 className="recipe-name">Crispy Parmesan Chicken</h1>
            <h2 className="author-name">Author</h2>
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
          <div></div>
        </Section>

        <Section name="Directions">
          <div></div>
        </Section>

    </div>
  )
}

export default RecipeView