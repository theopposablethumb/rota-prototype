import React from 'react';
import Colleague from './Colleague';
import {colleagues} from './../data';

class Team extends React.Component {

    selectedColleague = (id) => {
        if (this.props.selectedColleague === id) {
            return 'selected';
        } else if (this.props.selectedColleague) {
            return 'unselected';
        } else {
            return null;
        }
    }

    render() {
        return(
            <ul className="team">
                {colleagues.map(colleague => {
                    return (
                        <li onClick={() => this.props.selectColleague(colleague.id)} key={colleague.id} className={this.selectedColleague(colleague.id)}>
                            <Colleague id={colleague.id} monthView={true} />
                        </li>
                    )
                })}
            </ul>
        )  
    }
}

export default Team;