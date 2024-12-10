import React, { useState } from 'react';
import './App.css';
import NodesTable from './components/nodes/NodesTable';

function App() {
  const [tab, setTab] = useState('servers');

  return (
      <div className="terminal">
        <div className="container">
          <header>
            <h1>ROBCO INDUSTRIES (TM)</h1>
            <h2>MONITORING SYSTEM V1.0</h2>

            <div className="tab-buttons">
              <button
                  onClick={() => setTab('servers')}
                  className={tab === 'servers' ? 'active' : ''}
              >
                SERVERS
              </button>
              <button
                  onClick={() => setTab('accounts')}
                  className={tab === 'accounts' ? 'active' : ''}
              >
                ACCOUNTS
              </button>
            </div>
          </header>

          <main>
            {tab === 'servers' ? (
                <NodesTable />
            ) : (
                <div className="accounts-view">
                  <h3>ACCOUNTS SYSTEM</h3>
                  <p>FEATURE COMING SOON...</p>
                </div>
            )}
          </main>
        </div>
      </div>
  );
}

export default App;