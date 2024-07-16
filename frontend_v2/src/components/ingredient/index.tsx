import { ChangeEventHandler, FocusEventHandler, KeyboardEvent, useEffect, useState } from "react"
import trashIcon from '/../frontend/src/assets/icons/trash-solid.svg'
import { boldMeasurements } from "../../util/ingredients"
import pluralize from "pluralize"
import './style.scss'

interface IngredientProps {
    editMode: boolean
    value: string
    onChange: ChangeEventHandler<HTMLInputElement>
    onEnterKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void
    onBlur?: FocusEventHandler<HTMLInputElement>
    onDelete?: () => void
    multiplier?: number
}

const Ingredient = ({ editMode, value, onChange, onEnterKeyDown, onBlur, onDelete, multiplier = 1 }: IngredientProps) => {
    const [ingredientTokens, setTokens] = useState(boldMeasurements(value))

    useEffect(() => {
        // TODO: this only needs to update after editing is completed
        setTokens(boldMeasurements(value))
    }, [value])

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.nativeEvent.key === "Enter")
            onEnterKeyDown?.(e)
    }

    return (
        <div className="ingredient">
            {editMode ? (
                <div className="ingredient-input">
                    <input
                        value={value}
                        onChange={onChange}
                        onKeyDown={handleKeyDown}
                        onBlur={onBlur}
                        placeholder="Enter ingredient here!"
                    />
                    <button onClick={onDelete}><img className="icon" src={trashIcon} /></button>
                </div>
            ) : (
                <div className="input">
                    {ingredientTokens.map((v,i) => v.bold ? 
                        <strong key={i}>{v.number! * multiplier} {pluralize(v.unit!, v.number! * multiplier)}</strong> : v.value
                    )}
                </div>
            )}

        </div>
    )
}

export default Ingredient