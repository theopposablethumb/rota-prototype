import React from 'react';
import {colleagues, shifts} from './../data'; 
import Progress from './Progress';
import {reducer} from '../util/helpers';

let Colleague = (props) => {
    let wsw = colleagues.find(colleague => {return colleague.id === props.id});
    let shiftIds = [];
    let shiftsWorked = [];
    let activities = [];
    let visits = [];

    wsw.shifts.forEach(shift => { shiftIds.push(shift.id)});

    shiftIds.forEach(i => {
        let result = shifts.find(shift => {return shift.id === i});
        shiftsWorked.push(result);
    })
    
    shiftsWorked.forEach(shift => {
        shift.activities.forEach(
            activity => {
                if (activity.type === 'visit') {
                    visits.push(activity.duration)
                }
                activities.push(activity.duration)
            }
        )
    });

    let hoursScheduled = activities.reduce(reducer);
    let visitingHours = visits.reduce(reducer);
    let contractedHours = wsw.contractedHours;
    let scheduled = 'hours scheduled';
    let contactTime = 'hours contact time'

    let overtime = hoursScheduled - contractedHours;

    let hasOvetime = () => {
        if (overtime > 0) {
            return <Progress overtime={true} total={contractedHours} complete={overtime} />
        }
    } 

    let renderColleagueDetails = () => {
        if (props.monthView) {
            hoursScheduled = hoursScheduled * 4;
            contractedHours = contractedHours * 4;
            visitingHours = visitingHours * 4;
            scheduled = 'hrs';
            contactTime = 'hrs contact time';
            return (
                <div>
                    <p>{hoursScheduled} / {contractedHours} {scheduled}</p>
                    <p>{visitingHours} {contactTime}</p>
                </div>
            )
        } else if (props.supportView) {
            hoursScheduled = parseInt(hoursScheduled * 4.34);
            contractedHours = parseInt(contractedHours * 4.34);
            visitingHours = parseInt(visitingHours * 4.34);
            scheduled = 'hours';
            contactTime = 'hours contact time';
            return (
                <div>
                    <h4>{wsw.name}</h4>
                    <p><em>{wsw.role}</em></p>
                    <Progress total={contractedHours} complete={hoursScheduled} />
                    {hasOvetime()}
                    <p>{hoursScheduled} / {contractedHours} {scheduled}</p>
                    <p>{visitingHours} {contactTime}</p>
                </div>
            )
        } else {
            return (
                <div>
                    <p>{hoursScheduled} / {contractedHours} hours scheduled</p>
                    <p>{visitingHours} hours contact time</p>
                </div>
            )
        }
    }
    



    return (
        <div className="colleague">
            <img src={wsw.photo} alt={wsw.name} title={wsw.name} />
            {renderColleagueDetails()}
        </div>
    )
}

export default Colleague;