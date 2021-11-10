import React from 'react';
import Helmet from 'react-helmet';

import TeamShifts from './components/TeamShifts';


const App = () => {
  return(
    <>
      <Helmet>
        <title>Team Hub BelleVie Care</title>
      </Helmet>
      <main>
        <div className="header dark section">
          <div className="content">
            <h1>BelleVie - Time scheduling</h1>
          </div>
        </div>
        <TeamShifts />
        <div className="footer dark section">
          <div className="content">
            <p>Designed and built by Brendan Meachen</p>
            <p>Please send questions and feedback to <a href="mailto: brendan.meachen@gmail.com">brendan.meachen@gmail.com</a></p>
          </div>
        </div>
      </main>
    </>
  )
}

export default App;