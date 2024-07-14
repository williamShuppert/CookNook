import { ReactNode, KeyboardEvent, useEffect, useRef } from "react"
import plusIcon from '/../frontend/src/assets/icons/plus-solid.svg'

interface ListProps<T> {
    data: T[]
    setData: React.Dispatch<React.SetStateAction<T[]>>
    createEmpty: () => T
    creator: (data: T, index: number, onBlur: (value: T, index: number) => void) => ReactNode
    isEmpty: (data: T) => boolean
    query?: string
}

const List = <T,>({ data, setData, createEmpty, creator, isEmpty, query = "input" }: ListProps<T>) => {
    const parent = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // TODO: this should only be done when adding not removing
        focusField(-1) // set focus to newly created field
    }, [data.length])

    const focusField = (index: number) => {
        if (index == -1) index = data.length - 1

        const fields = (Array.from(parent.current!.querySelectorAll(query)) || []) as HTMLElement[]
        fields[index]?.focus()
    }

    const handleBlur = (value: T, index: number) => {
        if (!isEmpty(value)) return // only remove if field is empty
        if (index == data.length - 1) return // don't allow removal of last remaining field
        
        setData(prev => prev.filter((_, i) => index != i)) // remove current
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
        <div ref={parent} onKeyDown={handleKeyDown}>
            {data.map((v, i) => creator(v, i, handleBlur))}

            <button className="circle" onClick={handleAddButton}>
                <img className="icon" src={plusIcon} />
            </button>
        </div>
    )
}

export default List