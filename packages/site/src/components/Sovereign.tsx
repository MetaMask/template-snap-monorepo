import React, { useState } from 'react';
import { Schema } from 'borsh';
import { defaultSnapOrigin } from '../config';
import { ExecuteButton } from './Buttons';

const callMessageSchema: Schema = {
  struct: {
    message: 'string',
  },
};

type MethodSelectorState = `signTransaction` | `getPublicKey`;
type CurveSelectorState = `secp256k1` | `ed25519`;

type SovereignState = {
  method: MethodSelectorState;
  curve: CurveSelectorState;
  keyId: number;
  message?: string;
  request?: string;
  response?: string;
};

export const Sovereign = () => {
  const initialState: SovereignState = {
    method: `signTransaction`,
    curve: `secp256k1`,
    keyId: 0,
    message: 'Some signature message...',
  };
  const [state, setState] = useState(initialState);

  return (
    <div>
      <div>Method:</div>
      <div>
        <select
          value={state.method}
          onChange={(ev) =>
            setState({
              ...state,
              method: ev.target.value as MethodSelectorState,
            })
          }
        >
          <option value="signTransaction">Sign Transaction</option>
          <option value="getPublicKey">Get Public Key</option>
        </select>
      </div>
      <div>Curve:</div>
      <div>
        <select
          value={state.curve}
          onChange={(ev) =>
            setState({
              ...state,
              curve: ev.target.value as CurveSelectorState,
            })
          }
        >
          <option value="secp256k1">secp256k1</option>
          <option value="ed25519">ed25519</option>
        </select>
      </div>
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
      <div>Signature message:</div>
      <div>
        <textarea
          disabled={state.method !== `signTransaction`}
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
        <ExecuteButton
          onClick={async () => {
            const { method, curve, keyId, message } = state;

            const path = ['m', "44'", "1551'"];
            path.push(keyId.toString());

            let params;
            if (method === `signTransaction`) {
              params = {
                path,
                curve,
                schema: callMessageSchema,
                transaction: {
                  message: message || '',
                },
              };
            } else {
              params = {
                path,
                curve,
              };
            }

            const request = {
              method: 'wallet_invokeSnap',
              params: {
                snapId: defaultSnapOrigin,
                request: {
                  method,
                  params,
                },
              },
            };
            setState({
              ...state,
              request: JSON.stringify(request),
            });

            try {
              const response = await window.ethereum.request(request);
              setState({
                ...state,
                response: JSON.stringify(response),
              });
            } catch (e) {
              setState({
                ...state,
                response: e.message,
              });
            }
          }}
        />
      </div>
      <div>Request:</div>
      <div>
        <textarea
          disabled
          value={state.request}
          placeholder="Snap request..."
          rows={5}
          cols={40}
        />
      </div>
      <div>Response:</div>
      <div>
        <textarea
          disabled
          value={state.response}
          placeholder="Snap response..."
          rows={5}
          cols={40}
        />
      </div>
    </div>
  );
};
