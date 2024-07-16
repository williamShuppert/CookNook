import { ChangeEvent, FocusEvent, useEffect, useRef, useState } from 'react'
import { clamp } from '../../util/clamp'
import plusIcon from '/../frontend/src/assets/icons/plus-solid.svg'
import minusIcon from '/../frontend/src/assets/icons/minus-solid.svg'
import './style.scss'

interface IncrementorProps {
  value: number
  default?: number
  min?: number
  max?: number
  onChange: (newValue: number) => void
}

const Incrementor = ({ value, default: defaultVal, min, max, onChange }: IncrementorProps) => {
  const [text, setText] = useState(value.toString())
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!input.current) return

    input.current.style.width = "1px"
    input.current.style.width = input.current.scrollWidth + 4 + "px"
  }, [text])

  useEffect(() => {
    // need this bc rerenders don't happen if props change, only when state changes
    setText(value.toString())
  }, [value])

  const setValue = (num: number | string): number => {
    if (typeof(num) === 'string')
      num = Number.parseFloat(num)

    const newValue = clamp(isNaN(num) ? 0 : num, min, max)

    onChange(newValue)
    return newValue
  }

  const handleIncrement = (i: number) => {
    setText(setValue(value + i).toString())
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputEvent = e.nativeEvent as InputEvent
    const newText = e.target.value

    if (inputEvent.inputType.includes("delete")) { // allow backspace
      setText(newText)
      setValue(newText)
      return
    }
    
    const newChar = inputEvent.data ?? ""

    if (!Number.isInteger(Number.parseInt(newChar)) && newChar != '.' && newChar != '-') return // only allow numbers, decimals, and negative signs
    
    if (newChar == '.' && text.includes('.')) return // only allow only one decimal
    else if (newChar == '-' && (text.includes('-') || newText[0] != '-')) return // only allow one negative at the 0th index

    setText(e.target.value)
    setValue(newText)
  }

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (e.target.value == "")
      return setText(setValue(0).toString())

    setText(setValue(e.target.value).toString())
  }

  return (
    <div className="incrementor">
      <button className="circle" onClick={_ => handleIncrement(-1)}>
        <img className="icon" src={minusIcon} />
      </button>

      <input ref={input} type='text' value={text} onChange={handleInputChange} onBlur={handleBlur} placeholder={(defaultVal || clamp(0, min, max)).toString()} />
      
      <button className="circle" onClick={_ => handleIncrement(1)}>
        <img className="icon" src={plusIcon} />
      </button>
    </div>
  )
}

export default Incrementor