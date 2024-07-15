import { ChangeEventHandler, FocusEventHandler, KeyboardEvent } from "react"
import trashIcon from '/../frontend/src/assets/icons/trash-solid.svg'
import './style.scss'

interface IngredientProps {
    editMode: boolean
    value: string
    onChange: ChangeEventHandler<HTMLInputElement>
    onEnterKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void
    onBlur?: FocusEventHandler<HTMLInputElement>
    onDelete?: () => void
}

const Ingredient = ({ editMode, value, onChange, onEnterKeyDown, onBlur, onDelete }: IngredientProps) => {

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
                <div className="input">{value}</div>
            )}

        </div>
    )
}

export default Ingredient