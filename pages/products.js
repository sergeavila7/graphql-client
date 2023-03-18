import Layout from '../components/Layout';
import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';

// Components
import Product from '../components/Product';

const GET_PRODUCTS = gql`
  query GetProducts {
    getProducts {
      id
      name
      stock
      price
    }
  }
`;

const Products = () => {
  // Consultar productos
  const { data, loading, error } = useQuery(GET_PRODUCTS);
  console.log(data);

  if (loading) return 'Cargando...';

  return (
    <div>
      <Layout>
        <h1 className='text-2xl text-gray-800 font-light'>Productos</h1>
        <Link href='/newProduct'>
          <a className='bg-blue-800 py-2 px-5 mt-5 inline-block text-white rounded text-sm hover:bg-blue-900 mb-3'>
            Agregar producto
          </a>
        </Link>
        <div className='overflow-x-scroll'>
          <table className='table-auto shadow-md mt-10 w-full w-lg'>
            <thead className='bg-gray-800'>
              <tr className='text-white'>
                <th className='w-1/5 py-5'>Nombre</th>
                <th className='w-1/5 py-5'>Existencia</th>
                <th className='w-1/5 py-5'>Precio</th>
                <th className='w-1/5 py-5'>Eliminar</th>
                <th className='w-1/5 py-5'>Editar</th>
              </tr>
            </thead>
            <tbody className='bg-white'>
              {data &&
                data.getProducts.map((product) => (
                  <Product key={product.id} product={product} />
                ))}
            </tbody>
          </table>
        </div>
      </Layout>
    </div>
  );
};

export default Products;
