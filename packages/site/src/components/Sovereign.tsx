import { hexToBytes } from '@metamask/utils';
import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import React, { useState } from 'react';

import { defaultSnapOrigin } from '../config';
import { SignButton, SubmitButton } from './Buttons';

type SovereignState = {
  jsonRpcId: number;
  keyId: number;
  nonce: number;
  message?: string;
  tx?: string;
  sequencer?: string;
  status?: string;
};

export const Sovereign = () => {
  const initialState: SovereignState = {
    jsonRpcId: 0,
    keyId: 0,
    nonce: 0,
    message:
      '{"bank":{"Freeze":{"token_address":"sov1lta047h6lta047h6lta047h6lta047h6lta047h6lta047h6ltaq5s0rwf"}}}',
    sequencer: 'http://localhost:9000/',
    status: '',
  };
  const [state, setState] = useState(initialState);

  return (
    <div>
      <div>Key ID:</div>
      <div>
        <input
          type="text"
          value={state.keyId}
          onChange={(ev) => {
            const { value } = ev.target;

            // Allow only positive integers (whole numbers greater than or equal to zero)
            const regex = /^[0-9\b]+$/u; // Allows digits only
            if (value === '' || regex.test(value)) {
              setState({
                ...state,
                keyId: parseInt(value, 10),
              });
            }
          }}
        />
      </div>
      <div>Nonce:</div>
      <div>
        <input
          type="text"
          value={state.nonce}
          onChange={(ev) => {
            const { value } = ev.target;

            // Allow only positive integers (whole numbers greater than or equal to zero)
            const regex = /^[0-9\b]+$/u; // Allows digits only
            if (value === '' || regex.test(value)) {
              setState({
                ...state,
                nonce: parseInt(value, 10),
              });
            }
          }}
        />
      </div>
      <div>Signature message:</div>
      <div>
        <textarea
          value={state.message}
          onChange={(ev) =>
            setState({
              ...state,
              message: ev.target.value,
            })
          }
          placeholder="Signed message..."
          rows={5}
          cols={40}
        />
      </div>
      <div>
        <SignButton
          onClick={async () => {
            try {
              const { keyId, nonce, message } = state;
              const path = ['m', "44'", "1551'", `${keyId}'`];
              const params = {
                path,
                transaction: {
                  message,
                  nonce,
                },
              };

              const request = {
                method: 'wallet_invokeSnap',
                params: {
                  snapId: defaultSnapOrigin,
                  request: {
                    method: 'signTransaction',
                    params,
                  },
                },
              };

              const response = await window.ethereum.request<string>(request);
              setState({
                ...state,
                tx: response ?? '',
              });
            } catch (er) {
              setState({
                ...state,
                status: er.message,
              });
            }
          }}
        />
      </div>
      <div>Transaction:</div>
      <div>
        <input type="text" value={state.tx} readOnly />
      </div>
      <div>Sequencer:</div>
      <div>
        <input
          type="text"
          value={state.sequencer}
          placeholder="Sequencer address..."
          onChange={(ev) =>
            setState({
              ...state,
              sequencer: ev.target.value,
            })
          }
        />
      </div>
      <div>
        <SubmitButton
          onClick={async () => {
            try {
              state.jsonRpcId += 1;
              const requestData = {
                jsonrpc: '2.0',
                id: state.jsonRpcId,
                method: 'sequencer_acceptTx',
                params: [{ body: Array.from(hexToBytes(state.tx ?? '')) }],
              };
              const config: AxiosRequestConfig = {
                headers: {
                  'Content-Type': 'application/json',
                },
              };
              const response = await axios.post(
                state.sequencer ?? '',
                requestData,
                config,
              );
              setState({
                ...state,
                status: response.data,
              });
            } catch (er) {
              setState({
                ...state,
                status: er.message,
              });
            }
          }}
        />
      </div>
      <div>Status:</div>
      <div>
        <textarea
          value={state.status}
          placeholder="Response data..."
          rows={5}
          cols={40}
          readOnly
        />
      </div>
    </div>
  );
};
