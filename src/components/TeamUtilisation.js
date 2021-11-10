import {calculatePercentage, calculateTotalHours, calculateTotalVisits, calculateTotalOvertime, numberOfVisits} from '../util/helpers';

let TeamUtilisation = (props) => {
    
    let capacity = calculateTotalHours(props.colleagues) * 4;
    let totalVisitingHours = calculateTotalVisits(props.visits) * 4;
    let visitsPercentage =  calculatePercentage(totalVisitingHours, capacity);

    let travel = Math.round((40 * numberOfVisits(props.visits)) / 60);
    let travelPercentage = calculatePercentage(travel, capacity);

    let benchTime = capacity - (totalVisitingHours + travel);
    let benchPercentage = calculatePercentage(benchTime, capacity);
    
    let overTime = calculateTotalOvertime(props.colleagues) * 4;
    let overTimePercentage = calculatePercentage(overTime, capacity); 

    
    //let holiday = null;
    //let sickness= null;
    
    //let storytelling = null;

    //let training = null;

    return (
        <div className="utilisation">
            <p>Shift utilisation for the {props.team} team is {visitsPercentage}%</p>
            <div className="barChart">
                <div className="visits" style={{width: visitsPercentage + '%'}}></div>
                <div className="travel" style={{width: travelPercentage + '%'}}></div>
                <div className="benchTime" style={{width: benchPercentage + '%'}}></div>
                <div className="overTime" style={{width: overTimePercentage + '%'}}></div>
            </div>
            <ul>
                <li className="visits">Visits</li>
                <li className="travel">Travel</li>
                <li className="benchTime">Bench time</li>
                <li className="overTime">OverTime</li>
            </ul>
        </div>
    )
}

export default TeamUtilisation;