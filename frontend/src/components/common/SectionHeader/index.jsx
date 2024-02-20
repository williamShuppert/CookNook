import './index.scss'

const SectionHeader = ({title}) => {
  return (
    <div className="section-header">
      <h2 className='small-caps'>{title}</h2>
    </div>
  )
}

export default SectionHeader