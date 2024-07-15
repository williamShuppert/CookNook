import { ChangeEventHandler, FocusEventHandler, KeyboardEvent } from "react"

interface IngredientProps {
    editMode: boolean
    value: string
    onChange: ChangeEventHandler<HTMLInputElement>
    onEnterKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void
    onBlur?: FocusEventHandler<HTMLInputElement>
}

const Ingredient = ({ editMode, value, onChange, onEnterKeyDown, onBlur }: IngredientProps) => {

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.nativeEvent.key === "Enter")
            onEnterKeyDown?.(e)
    }

    return (
        <div>
            {editMode ? (
                <input
                    value={value}
                    onChange={onChange}
                    onKeyDown={handleKeyDown}
                    onBlur={onBlur}
                    placeholder="Enter ingredient here!"
                />
            ) : (
                <div className="input">{value}</div>
            )}

        </div>
    )
}

export default Ingredient