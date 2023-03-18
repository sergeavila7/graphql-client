import Layout from '../components/Layout';
import Link from 'next/link';
import { gql, useQuery } from '@apollo/client';
import Order from '../components/Order';

const GET_ORDERS = gql`
  query getOrdersSeller {
    getOrdersSeller {
      id
      order {
        id
        amount
        name
      }
      client {
        id
        name
        lastname
        email
        phone
      }
      seller
      total
      state
    }
  }
`;

const Orders = () => {
  const { data, loading, error } = useQuery(GET_ORDERS);

  if (loading) return 'Cargando...';
  console.log(data);
  return (
    <div>
      <Layout>
        <h1 className='text-2xl text-gray-800 font-light'>Pedidos</h1>
        <Link href='/newOrder'>
          <a className='bg-blue-800 py-2 px-5 mt-5 inline-block text-white rounded text-sm hover:bg-blue-900 mb-3'>
            Nuevo pedido
          </a>
        </Link>

        {data && data.getOrdersSeller.length === 0 ? (
          <p className='mt-5 text-center text-2xl'>No hay pedidos aún</p>
        ) : (
          data &&
          data.getOrdersSeller.map((order) => (
            <Order key={order.id} order={order} />
          ))
        )}
      </Layout>
    </div>
  );
};

export default Orders;
