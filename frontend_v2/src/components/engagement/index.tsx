import './style.scss'

interface EngagementProps {
    icon: string
    value: number
}

const Engagement = ({icon, value}: EngagementProps) => {
  return (
    <div className="engagement">
        <img className="icon" src={icon} />
        <span>{value}</span>
    </div>
  )
}

export default Engagement