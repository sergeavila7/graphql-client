import Head from 'next/head';
import Layout from '../components/Layout';
import { gql, useQuery } from '@apollo/client';

const GET_CLIENTS_USER = gql`
  query getClientSeller {
    getClientSeller {
      id
      name
      lastname
      company
      email
      phone
      seller
    }
  }
`;

const Products = () => {
  // Consulta de Apollo
  const { data, loading, error } = useQuery(GET_CLIENTS_USER);
  console.log(data);
  console.log(loading);
  console.log(error);
  return (
    <div>
      <Layout>
        <h1 className='text-2xl text-gray-800 font-light'>Desde Clients</h1>
      </Layout>
    </div>
  );
};

export default Products;
