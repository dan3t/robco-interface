import React, { useState, useEffect } from 'react';
import { Table, Clock, Server, Database, Activity } from 'lucide-react';
import { Modal } from '../common/Modal';
import NodeDetails from './NodeDetails';
import styled from 'styled-components';

// Добавляем анимированные элементы
const AnimatedValue = styled.div`
  transition: all 0.3s ease-out;
  animation: ${props => props.highlight ? 'highlightValue 1s ease-out' : 'none'};

  @keyframes highlightValue {
    0% { color: var(--amber-bright); }
    50% { color: var(--status-online); }
    100% { color: var(--amber-bright); }
  }
`;

const SearchBar = styled.div`
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
`;

const SearchInput = styled.input`
  background: var(--background-light);
  border: 2px solid var(--amber-primary);
  color: var(--amber-bright);
  padding: 8px 12px;
  font-family: inherit;
  font-size: 16px;
  width: 300px;

  &:focus {
    outline: none;
    box-shadow: 0 0 10px var(--amber-primary);
  }
`;

const FilterButton = styled.button`
  &.active {
    background: var(--amber-primary);
    color: var(--background-dark);
  }
`;

export default function NodesTable() {
    const [nodes, setNodes] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'last_update', direction: 'desc' });
    const [stats, setStats] = useState({ total: 0, online: 0, offline: 0 });
    const [selectedNode, setSelectedNode] = useState(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [updatedNodes, setUpdatedNodes] = useState(new Set());

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://150.241.97.114:3000/api/nodes');
                const data = await response.json();

                // Находим обновленные ноды
                const newUpdatedNodes = new Set();
                data.forEach(newNode => {
                    const oldNode = nodes.find(n => n.node_id === newNode.node_id);
                    if (oldNode && oldNode.points !== newNode.points) {
                        newUpdatedNodes.add(newNode.node_id);
                    }
                });

                setNodes(data);
                setUpdatedNodes(newUpdatedNodes);

                // Через 2 секунды убираем подсветку
                setTimeout(() => setUpdatedNodes(new Set()), 2000);

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
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [nodes]);

    const sortNodes = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const filteredAndSortedNodes = [...nodes]
        .filter(node => {
            const matchesSearch = node.node_id.toLowerCase().includes(search.toLowerCase()) ||
                node.username.toLowerCase().includes(search.toLowerCase()) ||
                node.server_name.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = statusFilter === 'all' || node.status.toLowerCase() === statusFilter;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
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
            <div className="stats-panel">
                <div className="stat-item">
                    <Server className="stat-icon" />
                    <AnimatedValue highlight={stats.total !== nodes.length}>
                        <div className="stat-label">TOTAL NODES</div>
                        <div className="stat-value">{stats.total}</div>
                    </AnimatedValue>
                </div>
                <div className="stat-item">
                    <Activity className="stat-icon" />
                    <AnimatedValue highlight={stats.online !== nodes.filter(n => n.status === 'ONLINE').length}>
                        <div className="stat-label">ONLINE</div>
                        <div className="stat-value text-green">{stats.online}</div>
                    </AnimatedValue>
                </div>
                <div className="stat-item">
                    <Database className="stat-icon" />
                    <AnimatedValue highlight={stats.offline !== nodes.filter(n => n.status === 'OFFLINE').length}>
                        <div className="stat-label">OFFLINE</div>
                        <div className="stat-value text-red">{stats.offline}</div>
                    </AnimatedValue>
                </div>
            </div>

            <SearchBar>
                <SearchInput
                    type="text"
                    placeholder="Search nodes..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <FilterButton
                    onClick={() => setStatusFilter('all')}
                    className={statusFilter === 'all' ? 'active' : ''}
                >
                    All
                </FilterButton>
                <FilterButton
                    onClick={() => setStatusFilter('online')}
                    className={statusFilter === 'online' ? 'active' : ''}
                >
                    Online
                </FilterButton>
                <FilterButton
                    onClick={() => setStatusFilter('offline')}
                    className={statusFilter === 'offline' ? 'active' : ''}
                >
                    Offline
                </FilterButton>
            </SearchBar>

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
                    {filteredAndSortedNodes.map(node => (
                        <tr
                            key={node.node_id}
                            className={`node-row ${node.status.toLowerCase()} ${updatedNodes.has(node.node_id) ? 'updated' : ''}`}
                            onClick={() => setSelectedNode(node)}
                            style={{ cursor: 'pointer' }}
                        >
                            <td>
                  <span className={`status-badge ${node.status.toLowerCase()}`}>
                    {node.status}
                  </span>
                            </td>
                            <td>{node.node_id}</td>
                            <td>{node.username}</td>
                            <td>{node.server_name}</td>
                            <td>
                                <AnimatedValue highlight={updatedNodes.has(node.node_id)}>
                                    {node.points}
                                </AnimatedValue>
                            </td>
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

            <Modal
                isOpen={!!selectedNode}
                onClose={() => setSelectedNode(null)}
            >
                {selectedNode && <NodeDetails node={selectedNode} />}
            </Modal>
        </div>
    );
}