import {
  createContext,
  Dispatch,
  ReactNode,
  Reducer,
  useEffect,
  useReducer,
} from 'react';
import { isFlask, isSnapInstalled } from '../utils';

export type MetamaskState = {
  isSnapInstalled: boolean;
  isFlask: boolean;
  error: Error | undefined;
};

const initialState: MetamaskState = {
  isSnapInstalled: false,
  isFlask: false,
  error: undefined,
};
type MetamaskDispatch = { type: MetamaskActions; payload: any };

export const MetaMaskContext = createContext<
  [MetamaskState, Dispatch<MetamaskDispatch>]
>([
  initialState,
  () => {
    /* no op */
  },
]);

export enum MetamaskActions {
  SET_INSTALLED,
  SET_FLASK_DETECTED,
  SET_ERROR,
}

const reducer: Reducer<MetamaskState, MetamaskDispatch> = (state, action) => {
  switch (action.type) {
    case MetamaskActions.SET_INSTALLED: {
      return {
        ...state,
        isSnapInstalled: action.payload,
      };
    }

    case MetamaskActions.SET_FLASK_DETECTED: {
      return {
        ...state,
        isFlask: action.payload,
      };
    }

    case MetamaskActions.SET_ERROR: {
      return {
        ...state,
        error: action.payload,
      };
    }

    default: {
      return state;
    }
  }
};

export const MetaMaskProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    async function detectFlask() {
      const isFlaskDetected = await isFlask();

      dispatch({
        type: MetamaskActions.SET_FLASK_DETECTED,
        payload: isFlaskDetected,
      });
    }

    async function detectSnapInstalled() {
      const snapInstalled = await isSnapInstalled();
      dispatch({
        type: MetamaskActions.SET_INSTALLED,
        payload: snapInstalled,
      });
    }

    detectFlask();

    if (state.isFlask) {
      detectSnapInstalled();
    }
  }, [state.isFlask]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (state.error) {
      timeoutId = setTimeout(() => {
        console.log('plop');
        dispatch({
          type: MetamaskActions.SET_ERROR,
          payload: undefined,
        });
      }, 10000);
    }

    return () => timeoutId && clearTimeout(timeoutId);
  }, [state.error]);

  return (
    <MetaMaskContext.Provider value={[state, dispatch]}>
      {children}
    </MetaMaskContext.Provider>
  );
};
