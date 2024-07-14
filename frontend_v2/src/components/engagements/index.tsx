import './style.scss'
import Engagement from '../engagement'
import starReg from '/../frontend/src/assets/icons/star-regular.svg'
import bookmarkReg from '/../frontend/src/assets/icons/bookmark-regular.svg'

const Engagements = () => {
  return (
    <div className='engagements'>
        <Engagement icon={starReg} value={0} />
        <Engagement icon={bookmarkReg} value={0} />
    </div>
  )
}

export default Engagements