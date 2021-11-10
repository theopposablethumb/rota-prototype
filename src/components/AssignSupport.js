import React, {useRef, useLayoutEffect, useState} from 'react';
import Progress from './Progress';
import Colleague from './Colleague';
import {calculateTotalHours, calculateTotalVisits, calculateTotalOvertime} from '../util/helpers';

let AssignSupport = (props) => {
    const [sticky, isSticky] = useState({
        elSticky: false
    });

    const stickyEl = useRef(null);

    useLayoutEffect(() => {
        const topPos = (element) => element.getBoundingClientRect().top;
        const getHeight = (element) => element.offsetHeight;
        const stickyElPos = topPos(stickyEl.current);
        
        const stickyElHeight = getHeight(stickyEl.current);
        
        const onScroll = () => {
            const scrollPos = window.scrollY;
            if (stickyElPos < scrollPos) {
                // Element scrolled to
                isSticky((state) => ({ ...state, elSticky: true }));
                let stickyElPercent = ((scrollPos - stickyElPos) * 100) / stickyElHeight;
                if (stickyElPercent > 100) stickyElPercent = 100;
                if (stickyElPercent < 0) stickyElPercent = 0;
            } else if (stickyElPos > scrollPos) {
                // Element scrolled away (up)
                isSticky((state) => ({ ...state, elSticky: false }))
            }
        }
        
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, []);

    let elStyle = sticky.elSticky ? 'sticky' : 'notSticky';


    let selectedColleague = (id) => {
        if (props.assignedColleague === id) {
            return 'selected';
        } else if (props.assignedColleague) {
            return 'unselected';
        } else {
            return null;
        }
    };


    let displayOvertime = () => {
        let overtime = calculateTotalOvertime(props.colleagues);
        if (overtime > 0) {
            return (
                <>
                    <p>{overtime} hours overtime, rota is unbalanced</p>
                    <Progress overtime={true} complete={calculateTotalOvertime(props.colleagues)} total={calculateTotalHours(props.colleagues)} />
                </>
            )
        }
    };

    return (
        <div className={`${props.open} assignSupport`}>
            
            <div className="handle"></div>
            <div className="inner">
                <h2>Assign Support for this shift</h2>
                <p>{calculateTotalVisits(props.visits) * 4} / {calculateTotalHours(props.colleagues) * 4} hours scheduled</p>
                <Progress complete={calculateTotalVisits(props.visits)} total={calculateTotalHours(props.colleagues)} />
                {displayOvertime()}
                <ul ref={stickyEl} className={elStyle} >
                {props.colleagues.map(colleague => {
                    return(
                        <li key={colleague.id} onClick={() => props.assignColleague(colleague.id)} className={selectedColleague(colleague.id)}>
                            <Colleague id={colleague.id} supportView={true} />
                        </li>
                    )
                })}
                </ul>
            </div>
        </div>
    )

}

export default AssignSupport;