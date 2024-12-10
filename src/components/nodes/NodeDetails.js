import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const DetailSection = styled.div`
  margin: 20px 0;
`;

const Title = styled.h2`
  color: var(--amber-bright);
  margin-bottom: 20px;
  border-bottom: 2px solid var(--amber-primary);
  padding-bottom: 10px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin: 20px 0;
`;

const InfoCard = styled.div`
  background: var(--background-dark);
  border: 1px solid var(--amber-dim);
  padding: 15px;
`;

const NodeDetails = ({ node }) => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        // Здесь будем загружать историю поинтов
        fetch(`http://150.241.97.114:3000/api/points-history/${node.node_id}`)
            .then(res => res.json())
            .then(data => setHistory(data))
            .catch(console.error);
    }, [node.node_id]);

    return (
        <div>
            <Title>NODE DETAILS: {node.node_id}</Title>

            <Grid>
                <InfoCard>
                    <h3>STATUS</h3>
                    <p className={`status-badge ${node.status.toLowerCase()}`}>
                        {node.status}
                    </p>
                </InfoCard>

                <InfoCard>
                    <h3>USER INFO</h3>
                    <p>Username: {node.username}</p>
                    <p>Server: {node.server_name}</p>
                </InfoCard>

                <InfoCard>
                    <h3>POINTS</h3>
                    <p>Current: {node.points}</p>
                    <p>Last Update: {new Date(node.last_update).toLocaleString()}</p>
                </InfoCard>
            </Grid>

            <DetailSection>
                <h3>POINTS HISTORY</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={history}>
                        <XAxis
                            dataKey="timestamp"
                            tickFormatter={time => new Date(time).toLocaleDateString()}
                        />
                        <YAxis />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="points"
                            stroke="var(--amber-primary)"
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </DetailSection>
        </div>
    );
};

export default NodeDetails;