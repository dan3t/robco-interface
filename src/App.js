import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [nodes, setNodes] = useState([]);
  const [tab, setTab] = useState('servers');

  useEffect(() => {
    // Подключаемся к нашему API
    fetch('http://150.241.97.114:3000/api/nodes')
        .then(res => res.json())
        .then(data => setNodes(data))
        .catch(err => console.error('Error fetching nodes:', err));
  }, []);

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
                <div className="servers-view">
                  <h3>CONNECTED NODES:</h3>
                  {nodes.length === 0 ? (
                      <p>SCANNING FOR NODES...</p>
                  ) : (
                      nodes.map(node => (
                          <div key={node.node_id} className="node-item">
                            <div className="node-header">
                      <span className={`status ${node.status.toLowerCase()}`}>
                        {node.status}
                      </span>
                              <span className="node-id">ID: {node.node_id}</span>
                            </div>
                            <div className="node-details">
                              <p>User: {node.username}</p>
                              <p>Points: {node.points}</p>
                              <p>Server: {node.server_name}</p>
                              <p>Last Update: {new Date(node.last_update).toLocaleString()}</p>
                            </div>
                          </div>
                      ))
                  )}
                </div>
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