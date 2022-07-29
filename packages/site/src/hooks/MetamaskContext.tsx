import {
  createContext,
  Dispatch,
  ReactNode,
  Reducer,
  useEffect,
  useReducer,
} from 'react';
import { isFlask } from '../utils';

type ISnap = {
  isInstalled: boolean;
  message: string;
};

export type MetamaskState = {
  filecoinSnap: ISnap;
  isFlask: boolean;
};

const initialState: MetamaskState = {
  filecoinSnap: {
    isInstalled: false,
    message: '',
  },
  isFlask: false,
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
  SET_INSTALLED_STATUS,
  SET_FLASK_DETECTED,
}

const reducer: Reducer<MetamaskState, MetamaskDispatch> = (state, action) => {
  switch (action.type) {
    case MetamaskActions.SET_INSTALLED_STATUS: {
      return {
        ...state,
        snap: action.payload,
      };
    }

    case MetamaskActions.SET_FLASK_DETECTED: {
      return {
        ...state,
        isFlask: action.payload,
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
    const detectFlask = async () => {
      const isFlaskDetected = await isFlask();
      console.log(isFlaskDetected);
      dispatch({
        type: MetamaskActions.SET_FLASK_DETECTED,
        payload: isFlaskDetected,
      });
    };

    detectFlask();
  }, []);

  return (
    <MetaMaskContext.Provider value={[state, dispatch]}>
      {children}
    </MetaMaskContext.Provider>
  );
};
