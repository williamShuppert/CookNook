import pluralize from 'pluralize'
import { useClickedOutside } from '../../../hooks/clicked-outside'
import { UnitTypesAffectedByServingSize, extractMeasurements } from '../../../utils/ingredient'
import './style.scss'
import { useRef, useState } from 'react'

// TODO:
// 1. check if type should be multiplied (specialized, time, and length units are not multiplied)
// 2. pluralize the unit if necessary
const Ingredient = ({ multiplier }) => {
    multiplier = multiplier == 0 ? 1 : multiplier
    const inputRef = useRef()
    const [isEditing, setIsEditing] = useState(false)
    const [value, setValue] = useState('')
    useClickedOutside(inputRef, () => setIsEditing(false))

    const handleKeyDown = (event) => {
        if (isEditing && event.key === 'Enter')
            setIsEditing(false)
    }

    const handleMeasurementClick = (e, token) => {
        e.stopPropagation()
        console.log(token)
    }

    const getMeasurementValue = (token) => {
        if (UnitTypesAffectedByServingSize.includes(token.unitType))
            return token.value.mul(multiplier)
        return token.value
    }

    if (isEditing) return (
        <input ref={inputRef} className="ingredient-input" autoFocus type="text" value={value} onChange={e => setValue(e.target.value)} onKeyDown={handleKeyDown} />
    )

    return (
        <div className="ingredient" onClick={() => setIsEditing(true)} >
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