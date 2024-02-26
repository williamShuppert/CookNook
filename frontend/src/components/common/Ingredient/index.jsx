import { useClickedOutside } from '../../../hooks/clicked-outside'
import './style.scss'
import { useRef, useState } from 'react'

const Ingredient = () => {
    const inputRef = useRef()
    const [isEditing, setIsEditing] = useState(false)
    const [value, setValue] = useState('')
    useClickedOutside(inputRef, () => setIsEditing(false))

    const multiplier = 3

    const handleKeyDown = (event) => {
        if (isEditing && event.key === 'Enter')
            setIsEditing(false)
    }

    const boldMeasurements = () => {
        return value.split(' ').map(token => ({
            type: !isNaN(token) ? 'measurement' : 'string',
            value: ' ' + token,
            getValue: (multiplier) => {
                // TODO:
                // 1. check if type should be multiplied (non countable units are not multiplied)
                // 2. pluralize the unit if necessary
                return token * multiplier
            }
        }))
    }

    const handleMeasurementClick = (e, token) => {
        e.stopPropagation()
        console.log(token)
    }

    if (isEditing) return (
        <input ref={inputRef} className="ingredient" autoFocus type="text" value={value} onChange={e => setValue(e.target.value)} onKeyDown={handleKeyDown} />
    )

    return (
        <div className="ingredient" onClick={() => setIsEditing(true)} >
            {value == '' ? 'tap to add ingredient' : (
                boldMeasurements().map((token, i) => (
                    <span key={i}>
                        {token.type == 'string' ? token.value : (
                            <strong onClick={e => handleMeasurementClick(e, token)}> {token.getValue(multiplier)}</strong>
                        )}
                    </span>
                ))
            )}
        </div>
    )
}

export default Ingredient