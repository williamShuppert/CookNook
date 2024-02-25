import "./style.scss"
import xmarkSolid from '/src/assets/icons/xmark-solid.svg'
import SectionHeader from "../SectionHeader"
import { AnimatePresence, motion } from 'framer-motion'
import ReactDOM from 'react-dom'
import { useRef } from "react"
import { useClickedOutside } from "../../../hooks/clicked-outside"

const Drawer = ({name, children, isOpen, handleClose}) => {

    const drawerRef = useRef()
    useClickedOutside(drawerRef, handleClose)


    return ReactDOM.createPortal(
        <AnimatePresence>
            { isOpen && <motion.div
                onClick={e=>e.preventDefault()}
                className="drawer"
                ref={drawerRef}
                initial={{transform: 'translateY(100%)'}}
                animate={{transform: 'translateY(0)'}}
                exit={{transform: 'translateY(100%)'}}
            >
                <div className="header">
                    <SectionHeader title={name} />
                    <button
                        className='button-circle'
                        onClick={handleClose}
                    >
                        <img className='icon' src={xmarkSolid} />
                    </button>    
                </div>
                {children}
            </motion.div>}
        </AnimatePresence>, document.getElementById('drawers')
    )
}

export default Drawer