import { ReactNode } from 'react'
import './style.scss'

const SectionTitle = ({ children, name }: { children: ReactNode, name: string }) => {
    return (
        <div className='section'>
            <div className='section-title'>{name}</div>
            {children}
        </div>
    )
}

export default SectionTitle