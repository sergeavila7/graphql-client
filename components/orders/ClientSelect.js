import React, { useState, useEffect, useContext } from 'react';
import Select from 'react-select';
import { gql, useMutation, useQuery } from '@apollo/client';
import OrderContext from '../../context/orders/OrderContext';

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
const ClientSelect = () => {
  const [client, setClient] = useState([]);
  // Context
  const orderContext = useContext(OrderContext);
  const { addClient } = orderContext;
  // Consultat la BD
  const { data, loading, error } = useQuery(GET_CLIENTS_USER);

  useEffect(() => {
    addClient(client);
  }, [client]);

  if (loading) return 'Cargando..';

  const { getClientSeller } = data;

  const selectClient = (client) => {
    setClient(client);
  };

  return (
    <div>
      <p className='mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold'>
        1.- Asigna un cliente al pedido
      </p>
      <Select
        className='mt-3'
        isClearable={true}
        options={getClientSeller}
        onChange={(client) => selectClient(client)}
        getOptionValue={(clients) => clients.id}
        getOptionLabel={(clients) => `${clients.name} ${clients.lastname}`}
        placeholder='Busque o seleccione el cliente'
        noOptionsMessage={() => 'No hay resultados'}
      />
    </div>
  );
};

export default ClientSelect;
