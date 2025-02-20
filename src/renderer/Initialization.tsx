import { useEffect } from 'react';
import styled from 'styled-components';
import { useChainState } from './states/chain/reducer';
import { typeChainID } from '../shared/constant/chain';
import useFetchAccounts from './hooks/useFetchAccount';
import useFetchTransaction from './hooks/useFetchTransaction';

interface Props extends SimpleComponent {}

function Initialization(props: Props) {
  useFetchAccounts();
  useFetchTransaction();

  return null;
}

export default Initialization;
