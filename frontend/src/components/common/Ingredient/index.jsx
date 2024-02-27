import pluralize from 'pluralize'
import { UnitTypesAffectedByServingSize, extractMeasurements } from '../../../utils/ingredient'
import './style.scss'
import { useRef, useState } from 'react'

// TODO:
//   1: 1 apple -> 2 apples (pluralize the word after a single number or mixed number)
//   2: 1 fluid ounce (allow spaces in unit)
const Ingredient = ({ multiplier, value, onChange, disableEditing }) => {
    multiplier = multiplier == 0 ? 1 : multiplier
    const inputRef = useRef()
    const [isEditing, setIsEditing] = useState(false)

    const handleMeasurementClick = (e, token) => {
        // e.stopPropagation()
        console.log(token)
    }

    const getMeasurementValue = (token) => {
        if (UnitTypesAffectedByServingSize.includes(token.unitType))
            return token.value.mul(multiplier)
        return token.value
    }

    if (isEditing) return (
        <input ref={inputRef} className="ingredient-input" autoFocus type="text" value={value} onChange={onChange} onBlur={() => setIsEditing(false)} />
    )

    return (
        <div className="ingredient" onClick={() => !disableEditing && setIsEditing(true)} >
            <input type="text" onFocus={() => setIsEditing(true)} />
            {value == '' ? 'tap to add ingredient' : (
                extractMeasurements(value).map((token, i) => (
                    <span key={i}>
                        {!token.isMeasurement ? token.string : (
                            <strong onClick={e => handleMeasurementClick(e, token)}>
                                {' '}
                                {getMeasurementValue(token).toFraction(true)}
                                {' '}
                                {pluralize(token.unit ?? '', getMeasurementValue(token).valueOf())}
                            </strong>
                        )}
                    </span>
                ))
            )}
        </div>
    )
}

export default Ingredient