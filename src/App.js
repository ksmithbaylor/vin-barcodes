import React, { useEffect } from 'react';
import Barcode from 'react-barcode';
import { useLoadingState, useUrlSync } from './customHooks';
import { vinFromPath, fetchVin } from './helpers';
import './App.css';

export default () => {
  const [vin, setVin, loading, loadVin] = useLoadingState(
    vinFromPath(),
    fetchVin
  );

  // Keep the url in sync with the displayed vin
  useUrlSync(vin ? `/vin/${vin}` : '/', path => setVin(vinFromPath(path)));

  // If there is no initial vin, load a real one
  useEffect(() => vin || loadVin('real'), []);

  return (
    <div className="App">
      <VinButtons
        onReal={() => loadVin('real')}
        onFake={() => loadVin('fake')}
        onManual={() => {
          const vin = window.prompt('Enter VIN');
          if (vin !== null) {
            setVin(vin);
          }
        }}
      />
      <BarcodeDisplay vin={vin} loading={loading} />
      <Info />
    </div>
  );
};

const VinButtons = ({ onReal, onFake, onManual }) => (
  <div className="VinButtons">
    <button onClick={onFake}>Fake</button>
    <button onClick={onReal}>Real</button>
    <button onClick={onManual}>Manual</button>
  </div>
);

const BarcodeDisplay = ({ vin, loading }) => (
  <div className="BarcodeDisplay">
    {loading ? <Spinner /> : vin ? <Barcode value={vin} /> : null}
  </div>
);

const Spinner = () => <div className="spinner" />;

const Info = () => (
  <footer>
    Driven by <RandomVinLink />. Made by Kevin Smith. Code on <GitHubLink />.
    <br />
  </footer>
);

const RandomVinLink = () => (
  <a href="http://randomvin.com" target="_blank" rel="noopener noreferrer">
    RandomVIN.com
  </a>
);

const GitHubLink = () => (
  <a
    href="https://github.com/ksmithbaylor/vin-barcodes"
    target="_blank"
    rel="noopener noreferrer"
  >
    GitHub
  </a>
);
