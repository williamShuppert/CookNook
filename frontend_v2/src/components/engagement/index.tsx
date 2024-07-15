import './style.scss'

interface EngagementProps {
    icon: string
    value: number
}

const Engagement = ({icon, value}: EngagementProps) => {
  return (
    <button className="engagement">
        <img className="icon" src={icon} />
        <span>{value}</span>
    </button>
  )
}

export default Engagement