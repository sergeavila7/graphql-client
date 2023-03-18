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

const BEST_SELLERS = gql`
  query BestSellers {
    bestSellers {
      total
      seller {
        name
        email
      }
    }
  }
`;
const BestSellers = () => {
  const { data, loading, error, startPolling, stopPolling } =
    useQuery(BEST_SELLERS);

  useEffect(() => {
    startPolling(1000);
    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling]);

  if (loading) return 'Cargando...';

  console.log(data);

  const sellerChart = [];

  data.bestSellers &&
    data.bestSellers.map((seller, index) => {
      sellerChart[index] = {
        ...seller.seller[0],
        total: seller.total,
      };
    });
  console.log(sellerChart);

  return (
    <Layout>
      <h1 className='text-2xl text-gray-800 font-light'>Mejores Vendedores</h1>
      <ResponsiveContainer width={'99%'} height={550}>
        <BarChart
          width={600}
          height={500}
          data={sellerChart}
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

export default BestSellers;
