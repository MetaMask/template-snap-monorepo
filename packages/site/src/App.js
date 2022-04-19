import { useState } from 'react';
import './App.css';

function App() {
  const [state, setState] = useState();

  const snapId = `local:http://localhost:8080`;

  const connect = async () => {
    await window.ethereum.request({
      method: 'wallet_enable',
      params: [{
        wallet_snap: { [snapId]: {} },
      }]
    })
  }

  const sendHello = async () => {
    try {
      const response = await window.ethereum.request({
        method: 'wallet_invokeSnap',
        params: [snapId, {
          method: 'hello'
        }]
      })
      setState(response);
    } catch (err) {
      console.error(err)
      alert('Problem happened: ' + err.message || err)
    }
  }

  return (
    <div className="App">
      <h1>Hello, Snaps!</h1>
      <details>
        <summary>Instructions</summary>
        <ul>
          <li>First, click "Connect". Then, try out the other buttons!</li>
          <li>Please note that:</li>
          <ul>
            <li>
              The <code>snap.manifest.json</code> and <code>package.json</code> must be located in the server root directory..
            </li>
            <li>
              The Snap bundle must be hosted at the location specified by the <code>location</code> field of <code>snap.manifest.json</code>.
            </li>
          </ul>
        </ul>
      </details>
      <br />

      <button onClick={connect}>Connect</button>
      <button onClick={sendHello}>Send Hello</button>

      <br />

      {state && `Snap replied with: ${state}`}
    </div>
  );
}

export default App;
