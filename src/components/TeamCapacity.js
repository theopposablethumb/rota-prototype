import {calculateTotalHours, calculateTotalOvertime, calculateTotalVisits} from '../util/helpers';

let TeamCapacity = (props) => {

    let capacity = calculateTotalHours(props.colleagues) * 4;
    let totalVisitingHours = calculateTotalVisits(props.visits) * 4;

    return (
        <div className="capacity">
            <p>Team capacity is <strong>{capacity} hours</strong></p>
            <p>The team are currently supporting {totalVisitingHours} hours of visits</p>
            <p className="overtime">{calculateTotalOvertime(props.colleagues) * 4} hours of overtime have been scheduled</p>
        </div>
    )
}

export default TeamCapacity;