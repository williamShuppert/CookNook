import { ChangeEventHandler, FocusEventHandler, useEffect, useRef, useState } from 'react'
import trashIcon from '/../frontend/src/assets/icons/trash-solid.svg'
import './style.scss'
import { MeasurementToken, parseMeasurements } from '../../util/ingredients'

interface DirectionProps {
    step: number
    value: string
    onChange: ChangeEventHandler<HTMLTextAreaElement>
    onBlur: FocusEventHandler<HTMLTextAreaElement>
    editMode: boolean
    onDelete?: () => void
    multiplier?: number
}

const Direction = ({ step, value, onChange, onBlur, editMode, onDelete, multiplier = 1 }: DirectionProps) => {
    const [completed, setCompleted] = useState(false)
    const textarea = useRef<HTMLTextAreaElement>(null)
    
    const [ingredientTokens, setTokens] = useState<MeasurementToken[]>()

    useEffect(() => {
        setTokens(parseMeasurements(value))
    }, [value])

    useEffect(() => {
        autoSize()
    }, [value, editMode])

    const autoSize = () => {
        if (!textarea.current) return

        textarea.current.style.height = "1px"
        textarea.current.style.height = textarea.current.scrollHeight + 1 + "px"
    }

    return (
        <div className={`direction  ${completed&&!editMode&&"completed"}`}>
            <button className='step-number circle' disabled={editMode} onClick={() => setCompleted(prev => !prev)}>{step}</button>
            
            {editMode ? (
                <div className="direction-input">
                    <textarea
                        className="content"
                        ref={textarea}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        placeholder='Enter directions here!'
                    />
                    <button onClick={onDelete}><img className="icon" src={trashIcon} /></button>
                </div>
            ) : (
                <div className={`content input ${completed&&"completed"}`} onClick={() => setCompleted(prev => !prev)}>
                    {ingredientTokens?.map((v,i) => v(multiplier, i))}
                </div>
            )}
            
        </div>
    )
}

export default Direction