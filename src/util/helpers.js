export let reducer = (accumulator, currentValue) => accumulator + currentValue;

export let calculateTotalHours = (colleagues) => {
    let totalHours = [];
    colleagues.map(colleague => {return totalHours.push(colleague.contractedHours)});
    return totalHours.reduce(reducer);
}

export let calculateTotalVisits = (visits) => {
    let totalVisits = [];
    visits.map(visit => {return totalVisits.push(visit.duration)});
    return totalVisits.reduce(reducer);
};

export let numberOfVisits = (visits) => {
    let totalVisits = [];
    visits.map(visit => {return totalVisits.push(visit.duration)});
    return totalVisits.length;
}

export let calculateTotalOvertime = (colleagues) => {
    let totalOvertime = [];
    colleagues.map(colleague => {
        let hoursWorked = colleague.shifts.length * 5;
        if (hoursWorked > colleague.contractedHours) {
            return totalOvertime.push(hoursWorked - colleague.contractedHours)
        }
    });

    return totalOvertime.reduce(reducer);
}


export let calculatePercentage = (a, b) => {
    return Math.round((a / b) * 100);
} 