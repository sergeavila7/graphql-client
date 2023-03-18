import Layout from '../components/Layout';
import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Client from '../components/Client';
const GET_CLIENTS_USER = gql`
  query getClientSeller {
    getClientSeller {
      id
      name
      lastname
      email
      company
    }
  }
`;
const Home = () => {
  const router = useRouter();

  // Consulta de Apollo
  const { data, loading, error, client } = useQuery(GET_CLIENTS_USER);

  if (loading) return 'Cargando...';

  if (!data.getClientSeller) {
    client.clearStore();
    router.push('/login');
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Layout>
        <h1 className='text-2xl text-gray-800 font-light'>Clientes</h1>
        <Link href='/newClient'>
          <a className='bg-blue-800 py-2 px-5 mt-5 inline-block text-white rounded text-sm hover:bg-blue-900 mb-3 uppercase font-bold w-full lg:w-auto text-center'>
            Nuevo cliente
          </a>
        </Link>
        <div className='overflow-x-scroll'>
          <table className='table-auto shadow-md mt-10 w-full w-lg'>
            <thead className='bg-gray-800'>
              <tr className='text-white'>
                <th className='w-1/5 py-5'>Nombre</th>
                <th className='w-1/5 py-5'>Empresa</th>
                <th className='w-1/5 py-5'>Email</th>
                <th className='w-1/5 py-5'>Eliminar</th>
                <th className='w-1/5 py-5'>Editar</th>
              </tr>
            </thead>
            <tbody className='bg-white'>
              {data.getClientSeller.map((client) => (
                <Client key={client.id} client={client} />
              ))}
            </tbody>
          </table>
        </div>
      </Layout>
    </div>
  );
};

export default Home;
