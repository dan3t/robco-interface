import React, { useState, useEffect } from 'react';
import { Table, Clock, Server, Database, Activity } from 'lucide-react';

export default function NodesTable() {
    const [nodes, setNodes] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'last_update', direction: 'desc' });
    const [stats, setStats] = useState({ total: 0, online: 0, offline: 0 });

    useEffect(() => {
        // Загрузка данных
        const fetchData = async () => {
            try {
                const response = await fetch('http://150.241.97.114:3000/api/nodes');
                const data = await response.json();
                setNodes(data);

                // Обновляем статистику
                const online = data.filter(node => node.status === 'ONLINE').length;
                setStats({
                    total: data.length,
                    online,
                    offline: data.length - online
                });
            } catch (error) {
                console.error('Error fetching nodes:', error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 30000); // Обновление каждые 30 секунд
        return () => clearInterval(interval);
    }, []);

    // Функция сортировки
    const sortNodes = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedNodes = [...nodes].sort((a, b) => {
        if (sortConfig.key === 'last_update') {
            return sortConfig.direction === 'asc'
                ? new Date(a.last_update) - new Date(b.last_update)
                : new Date(b.last_update) - new Date(a.last_update);
        }
        return sortConfig.direction === 'asc'
            ? a[sortConfig.key] > b[sortConfig.key] ? 1 : -1
            : b[sortConfig.key] > a[sortConfig.key] ? 1 : -1;
    });

    return (
        <div className="nodes-container">
            {/* Статистика */}
            <div className="stats-panel">
                <div className="stat-item">
                    <Server className="stat-icon" />
                    <div className="stat-info">
                        <div className="stat-label">TOTAL NODES</div>
                        <div className="stat-value">{stats.total}</div>
                    </div>
                </div>
                <div className="stat-item">
                    <Activity className="stat-icon" />
                    <div className="stat-info">
                        <div className="stat-label">ONLINE</div>
                        <div className="stat-value text-green">{stats.online}</div>
                    </div>
                </div>
                <div className="stat-item">
                    <Database className="stat-icon" />
                    <div className="stat-info">
                        <div className="stat-label">OFFLINE</div>
                        <div className="stat-value text-red">{stats.offline}</div>
                    </div>
                </div>
            </div>

            {/* Таблица нод */}
            <div className="nodes-table">
                <table>
                    <thead>
                    <tr>
                        <th onClick={() => sortNodes('status')}>STATUS</th>
                        <th onClick={() => sortNodes('node_id')}>NODE ID</th>
                        <th onClick={() => sortNodes('username')}>USER</th>
                        <th onClick={() => sortNodes('server_name')}>SERVER</th>
                        <th onClick={() => sortNodes('points')}>POINTS</th>
                        <th onClick={() => sortNodes('last_update')}>LAST UPDATE</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortedNodes.map(node => (
                        <tr
                            key={node.node_id}
                            className={`node-row ${node.status.toLowerCase()}`}
                        >
                            <td>
                  <span className={`status-badge ${node.status.toLowerCase()}`}>
                    {node.status}
                  </span>
                            </td>
                            <td>{node.node_id}</td>
                            <td>{node.username}</td>
                            <td>{node.server_name}</td>
                            <td>{node.points}</td>
                            <td>
                                <div className="last-update">
                                    <Clock size={16} />
                                    {new Date(node.last_update).toLocaleString()}
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}