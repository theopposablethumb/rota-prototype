import React from 'react';
import Helmet from 'react-helmet';

import Team from './Team';
import TeamCapacity from './TeamCapacity';
import TeamUtilisation from './TeamUtilisation';
import Meeting from './Meeting';
import Shift from './Shift';

import {colleagues, shifts, visits, week} from './../data';
import AssignSupport from './AssignSupport';

class TeamShifts extends React.Component {
    state = {
        shifts: shifts,
        visits: visits,
        colleagues: colleagues,
        selectedColleague: null,
        assignColleague: null,
        selectedShift: null
    }

    assignColleague = (colleague) => {
        this.setState({assignColleague: colleague});
        if (colleague === this.state.assignColleague) {
            this.setState({assignColleague: null})
        }
    }

    selectColleague = (colleague) => {
        this.setState({selectedColleague: colleague});
        if (colleague === this.state.selectedColleague) {
            this.setState({selectedColleague: null})
        }
    }

    //update colleague in state when assigning colleague to a shift. Since state contains some complex data structures this isn't straight forward...
    updateColleague = (newColleague, prevColleague, shift) => {
        let updatedColleagues = [...this.state.colleagues];
        let newCol = this.state.colleagues.find(colleague => colleague.id === newColleague);
        let prevCol = this.state.colleagues.find(colleague => colleague.id === prevColleague);
        let newColIndex = updatedColleagues.findIndex(x => x.id === newCol.id);
        let prevColIndex = updatedColleagues.findIndex(x => x.id === prevCol.id);
        
        let newColShift = newCol.shifts = [...newCol.shifts, {id: shift}];
        let prevColShift = prevCol.shifts.filter(s => s.id !== shift);

        newCol.shifts = newColShift;
        prevCol.shifts = prevColShift;
        
        colleagues[newColIndex] = newCol;
        colleagues[prevColIndex] = prevCol;
        
        this.setState({colleagues: updatedColleagues});
    }

    selectShift = (shift) => {
        this.setState({selectedShift: shift});
        if (shift === this.state.selectedShift) {
            this.setState({selectedShift: null});
        }
    }


    assignToShift = () => {
        if (this.state.assignColleague && this.state.selectedShift) {
            return this.state.selectedShift;
        }
    }

    renderShifts = () => {
        let displayedShifts = [];
        if (this.state.selectedColleague) {
            displayedShifts = this.state.shifts.filter(shift => {return shift.colleagues[0].id === this.state.selectedColleague});
            return (
                <div className="shifts">
                    {week.map(day => {return (
                        <div className={`day ${day}`}>
                            {displayedShifts.filter(shift => shift.day === day).map(shift => {
                                return(
                                    <Shift key={shift.id} colleagues={this.state.colleagues} shifts={this.state.shifts} id={shift.id} day={shift.day} start={shift.startTime} end={shift.endTime} activities={shift.activities} assignedSupport={shift.colleagues[0]} selectShift={this.selectShift} selected={this.state.selectedShift} assignToShift={this.assignToShift} colleagueAssignment={this.state.assignColleague} updateColleague={this.updateColleague} />
                                )
                            })}
                        </div>
                    )} )}
                </div>
            );
        } else {
            displayedShifts = this.state.shifts;
            return (
                <div className="shifts">
                    {week.map(day => {return (
                        <div className={`day ${day}`}>
                            <h2>{day}</h2>
                            {displayedShifts.filter(shift => shift.day === day).map(shift => {
                                return(
                                    <Shift key={shift.id} colleagues={this.state.colleagues} shifts={this.state.shifts} id={shift.id} day={shift.day} start={shift.startTime} end={shift.endTime} activities={shift.activities} assignedSupport={shift.colleagues[0]} selectShift={this.selectShift} selected={this.state.selectedShift} assignToShift={this.assignToShift} colleagueAssignment={this.state.assignColleague} updateColleague={this.updateColleague} />
                                )
                            })}
                        </div>
                    )} )}
                </div>
            );
        }
    }

    render() {
        return(
            <>
                <Helmet>
                    <title>Rota Prototype</title>
                </Helmet>
                <div className="teamStats">
                    <TeamCapacity colleagues={this.state.colleagues} visits={this.state.visits} />
                    <TeamUtilisation team={'Oxford'} shifts={this.state.shifts} colleagues={this.state.colleagues} visits={this.state.visits} />
                </div>
                <div className="rota">
                    <Team selectColleague={this.selectColleague} selectedColleague={this.state.selectedColleague} />
                    <AssignSupport colleagues={this.state.colleagues} visits={this.state.visits} assignColleague={this.assignColleague} assignedColleague={this.state.assignColleague} open={this.state.selectedShift ? 'open' : 'close'} shift={this.state.selectedShift} />
                    <Meeting />
                    <h2>Team Commited Working Hours</h2>
                    {this.renderShifts()}
                </div>
                
            </>
        )
    }
}

export default TeamShifts;