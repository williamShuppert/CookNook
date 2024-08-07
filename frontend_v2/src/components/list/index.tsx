import { ReactNode, FocusEvent, KeyboardEvent, useEffect, useRef } from "react"
import plusIcon from '/../frontend/src/assets/icons/plus-solid.svg'
import './style.scss'
import { usePrevious } from "../../hooks/use-previous"

interface ListProps<T> {
    editMode: boolean
    data: T[]
    setData: React.Dispatch<React.SetStateAction<T[]>>
    createEmpty: () => T
    creator: (data: T, index: number, onBlur: (index: number, e: FocusEvent) => void) => ReactNode
    isEmpty: (data: T) => boolean
    query?: string
}

const List = <T,>({ editMode, data, setData, createEmpty, creator, isEmpty, query = "input" }: ListProps<T>) => {
    const parent = useRef<HTMLDivElement>(null)
    const prevLength = usePrevious(data.length)

    useEffect(() => {
        // focus on last field if list gets longer
        if (data.length > prevLength)
            focusField(-1)
    }, [data.length])

    const focusField = (index: number) => {
        if (index == -1) index = data.length - 1

        const fields = (Array.from(parent.current!.querySelectorAll(query)) || []) as HTMLElement[]
        fields[index]?.focus()
    }

    const handleBlur = (index: number, e: FocusEvent) => {
        if (!isEmpty(data[index])) return // only remove if field is empty
        if (index == data.length - 1) return // don't allow removal of last remaining field

        setData(prev => prev.filter((_, i) => index != i)) // remove current
        
        // This fixes the focus. After removing a field the focus is off by one if it came after the removed field
        if (!e.relatedTarget) return // ensure there is a new focus
        const indexOfRelatedTarget = Array.from(parent.current?.querySelectorAll(query)||[]).indexOf(e.relatedTarget)
        if (indexOfRelatedTarget > index) focusField(indexOfRelatedTarget - 1)
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
        if (e.key !== "Enter") return
        if (e.shiftKey || e.ctrlKey) return // allow enter key when holding shift or ctr

        // get index of input
        const fields = (Array.from(parent.current!.querySelectorAll(query)) || []) as HTMLElement[]
        const i = fields.indexOf(e.target as HTMLElement)

        if (i == -1) return // return if focused on add button

        e.preventDefault()

        if (i == data.length - 1) // if last field is focused add a new ingredient input            
            return setData(prev => [...prev, createEmpty()])

        focusField(i + 1) // focus next ingredient
    }

    const handleAddButton = () => {
        if (isEmpty(data[data.length - 1]))
            return focusField(-1) // focus on last field if it's still empty

        setData(prev => [...prev, createEmpty()])
    }

    return (
        <div className="list" ref={parent} onKeyDown={handleKeyDown}>

            {editMode
                ? data.map((v, i) => creator(v, i, handleBlur))
                : data.filter(t => !isEmpty(t)).map((v, i) => creator(v, i, handleBlur))}


            { editMode && <button className="circle" onClick={handleAddButton}>
                <img className="icon" src={plusIcon} />
            </button>}
        </div>
    )
}

export default List