import './index.scss'

const GeneralRecipeInfo = ({difficulty, minutes, calories, noBorder = false}) => {
  return (
    <div className={"general-recipe-info " + (noBorder?"no-border":"")}>
        <div className='difficulty'>
            <span className="small-caps">{difficulty}</span>
        </div>
        <div>
            <span>
                <span className='time'>{minutes}</span>
                <br />
                <span className="small-caps">minutes</span>
            </span>
        </div>
        <div>
            <span>
                <span className='calories'>{calories}</span>
                <br />
                <span className="small-caps">calories</span>
            </span>
        </div>
    </div>
  )
}

export default GeneralRecipeInfo