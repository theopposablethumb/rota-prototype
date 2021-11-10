import React from 'react';

import Activity from './Activity';
import Colleague from './Colleague';
import Modal from './Modal';

class Shift extends React.Component {
    state = { 
        open: false,
        assign: false,
        currentShift: this.props.id,
        prevColleague: null,
        currentColleague: this.props.assignedSupport,
        newColleague: null,
        newColleagueAlreadyWorking: false,
        newColleagueOverTime: false,
        modal: null
    }

    capitalise = (s) => {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    openShift(e) {
        e.preventDefault();
        if (this.state.open === false) {
            this.setState({open: true});
        } else {
            this.setState({open: false})
        }
    }

    selectShift() {
        if (this.props.id === this.props.selected) {
            return 'selected';
        } else {
            return '';
        }
    }

    totalVisitsDuration() {
        let visits = this.props.activities.filter(activity => {return activity.type === 'visit'});
        let duration = [];

        visits.forEach(visit => {
            duration.push(visit.duration);
        });
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        return duration.reduce(reducer);
    }

    numberOfVisits() {
        let visits = this.props.activities.filter(activity => {return activity.type === 'visit'});
        if (visits > 1) {
            return visits.length + ' visits';
        } else {
            return visits.length + ' visit';
        }
    }

    renderActivity(activity) {
        if (activity.type === 'visit') {
            return (
                <div className="visit" key={activity.person}>
                    <h4>{activity.person}</h4>
                    <p>{this.capitalise(activity.day)}: {activity.startTime} - {activity.endTime}</p>
                </div>
            )
        } else if (activity.type === 'free') {
            return (
                <div className="free" key={activity.person}>
                    <h4>{this.capitalise(activity.day)}: {activity.startTime} - {activity.endTime}</h4>
                    <p>Available time for team support</p>
                </div>
            )
        }
    }

    // Team Shift specific functions start here

    wswShifts(wsw, shift) {
        let wswShifts = [];
        wsw.shifts.forEach(shift => {
            wswShifts.push(this.props.shifts.find(s => {return s.id === shift.id}))
        });
        let sameDay = wswShifts.filter(s => {return s.day === shift.day});
        let sameTime = sameDay.filter(s => {return s.startTime.slice(-2) === shift.startTime.slice(-2)});
        if (sameTime.length > 0) {
            return sameTime;
        } else {
            return null;
        }
    }

    checkOvertime(support) {
        let hoursWorked = (support.shifts.length * 5) + 5;
        if (hoursWorked > support.contractedHours) {
            this.setState({
                newColleagueOverTime: true,
                modal: {
                    type: 'overtime',
                    heading: 'You\'re about to schedule Overtime',
                    content: 'The teams contracted hours haven’t been fully scheduled yet, and this will impact the teams magic number score. Here are a few suggestions which may help keep the rota balanced.',
                    bullets: ['Schedule another Wellbeing Support Worker, some Support Workers haven’t had their full hours scheduled', 'Schedule another Wellbeing Support Worker, some Support Workers haven’t had their full hours scheduled', 'Review the teams shifts', 'Some shifts have free time which could accomodate a scheduled visit', 'Some shifts may have visits which can be moved to accomodate other visits'],
                    options: [{label: 'continue', type: 'confirm'}, {label: 'cancel', type: 'cancel'}]
                }
            });
            return true;
        } else {
            return false;
        }
    }

    checkAlreadyWorking(shift, support) {
        if (shift) {
            this.setState({
                newColleagueAlreadyWorking: true,
                modal: {
                    type: 'alreadyWorking',
                    heading: `${support.name} is already working at that time`,
                    content: `${support.name.split(" ")[0]} can't be in two places at once :) please select another colleague to cover this shift`,
                    options: [{label: 'confirm', type: 'cancel'}]
                }
            });
            return true;
        } else {
            return false;
        }
    }

    closeModal = () => {
        this.setState(state => {return ({modal: null, assign: false, newColleague: null})});
    }

    confirmModal = (type) => {
        if (type === 'overtime') {
            this.setState({newColleagueOverTime: false, modal: null, assign: false})
        } else {
            this.setState(state => {return ({modal: null, assign: false})}); 
        }
        this.setState({assign: false, prevColleague: this.state.currentColleague, currentColleague: this.state.newColleague, newColleague: null});
        this.props.updateColleague(this.state.newColleague.id, this.state.currentColleague.id, this.props.id);
    }

    //also need to check is doing 3 subsequent shifts in a row... how do I do that?
    assignWSW(e, wsw) {
        e.preventDefault();
        let shift = this.props.shifts.find(shift => {return(shift.id === this.props.id)}); //the current shift
        let support = this.props.colleagues.find(colleague => {return(colleague.id === wsw)}); // the new colleague
        this.setState({newColleague: support});
        let sameShift = this.wswShifts(support, shift);
        this.checkOvertime(support);
        this.checkAlreadyWorking(sameShift, support);
        let overtime = this.checkOvertime(support);
        let alreadyWorking = this.checkAlreadyWorking(sameShift, support);
        if (!overtime && !alreadyWorking) {
            this.setState({prevColleague: this.state.currentColleague, currentColleague: support, newColleague: null});
            this.props.updateColleague(support.id, this.state.currentColleague.id, this.props.id);
        }
    }

    clearPrevColleague() {
        this.setState({prevColleague: null});
    }

    shiftAssignment() {
        if (this.props.assignToShift() === this.props.id && this.state.prevColleague !== null) {
            return (
                <div onClick={() => {this.props.selectShift(this.props.id)}} className="support">
                    <Colleague id={this.state.currentColleague.id} />
                </div>
                
            );
        } if(this.props.assignToShift() === this.props.id && this.state.prevColleague === null) {
            return (
                <div className="support">
                    <button className="dark" onClick={(e) => this.assignWSW(e, this.props.colleagueAssignment)}>Assign colleague</button>
                </div>
            );
        } 
        else {
            return (
                <div onClick={() => {this.props.selectShift(this.props.id)}} className="support">
                    <Colleague id={this.state.currentColleague.id} />
                </div>
            );
        }
    }

    render() {
        const open = this.state.open ? 'shift' : 'shift close';
        return (
            <div className={`${open} ${this.selectShift()}`}>
                <button onClick={(e) => this.openShift(e)}>
                    <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTBweCIgaGVpZ2h0PSI1cHgiIHZpZXdCb3g9IjAgMCAxMCA1IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPHRpdGxlPlRyaWFuZ2xlPC90aXRsZT4KICAgIDxnIGlkPSJUZWFtLVNoaWZ0cyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IlNoaWZ0LVBsYW5uaW5nIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjgyLjAwMDAwMCwgLTg2Mi4wMDAwMDApIiBmaWxsPSIjMzAzMDMwIj4KICAgICAgICAgICAgPGcgaWQ9IlJ1bi1TdW1tYXJ5LUNvcHktMTkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIwLjAwMDAwMCwgODU0LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPHBvbHlnb24gaWQ9IlRyaWFuZ2xlIiBwb2ludHM9IjI2NyA4IDI3MiAxMyAyNjIgMTMiPjwvcG9seWdvbj4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+" alt="shift control" />
                </button>
                <h4 onClick={() => {this.props.selectShift(this.props.id)}}>{this.capitalise(this.props.day)}: {this.props.start} - {this.props.end} </h4>
                <div onClick={() => {this.props.selectShift(this.props.id)}} className="stats close">
                    <p>{this.numberOfVisits()}, {this.totalVisitsDuration()}hrs contact time</p>
                </div>
                <div onClick={() => {this.props.selectShift(this.props.id)}} className="stats open">
                    <p> {this.totalVisitsDuration()} hours in visits</p>
                    <p>X hour Y minutes travel time</p>
                </div>

                {this.props.activities.map(activity => <Activity key={activity.id} activity={activity} />)}
                
                {this.shiftAssignment()}
                
                <Modal content={this.state.modal} display={this.closeModal} confirm={this.confirmModal} />
            </div>
        );
    }
    
}

export default Shift;