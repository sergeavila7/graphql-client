import React, { useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import dynamic from 'next/dynamic';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Components
import Layout from '../components/Layout';
const BEST_CLIENTS = gql`
  query BestClients {
    bestClients {
      total
      client {
        name
        email
      }
    }
  }
`;
const BestClients = () => {
  const { data, loading, error, startPolling, stopPolling } =
    useQuery(BEST_CLIENTS);

  useEffect(() => {
    startPolling(1000);
    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling]);

  if (loading) return 'Cargando...';

  console.log(data);

  const clientChart = [];

  data.bestClients &&
    data.bestClients.map((client, index) => {
      clientChart[index] = {
        ...client.client[0],
        total: client.total,
      };
    });
  console.log(clientChart);

  return (
    <Layout>
      <h1 className='text-2xl text-gray-800 font-light'>Mejores Clientes</h1>
      <ResponsiveContainer width={'99%'} height={550}>
        <BarChart
          width={600}
          height={500}
          data={clientChart}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey='total' fill='#8884d8' />
        </BarChart>
      </ResponsiveContainer>
    </Layout>
  );
};

export default BestClients;
