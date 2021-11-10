import React from 'react';

class Activity extends React.Component {
    
    capitalise = (s) => {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    activityType = (activity) => {
        if (activity.type === 'visit') {
            return (
                <div className="visit">
                    <h4>{activity.person}</h4>
                    <p>{this.capitalise(activity.day)}: {activity.startTime} - {activity.endTime}</p>
                </div>
            );
        } else if (activity.type === 'free') {
            return (
                <div className="free">
                    <h4>{this.capitalise(activity.day)}: {activity.startTime} - {activity.endTime}</h4>
                    <p>Available time for team support</p>
                </div> 
            )
        }
    }
    
    render() {
        return (
            <>
                {this.activityType(this.props.activity)}
            </>
        )
    }
    
}

export default Activity;