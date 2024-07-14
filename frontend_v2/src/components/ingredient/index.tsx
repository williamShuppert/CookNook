import { KeyboardEvent } from "react"

interface IngredientProps {
    value: string
    onChange: (newValue: string) => void
    onEnterKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void
    onBlur?: () => void
}

const Ingredient = ({ value, onChange, onEnterKeyDown, onBlur }: IngredientProps) => {

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.nativeEvent.key === "Enter")
            onEnterKeyDown?.(e)
    }

    return (
        <div>
            <input
                value={value}
                onChange={e => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={onBlur}
                placeholder="Enter ingredient here!"
            />
        </div>
    )
}

export default Ingredient