import React, { useState, useEffect } from 'react';
import Barcode from 'react-barcode';
import './App.css';

const fetchVin = type =>
  fetch(`/.netlify/functions/randomVin?type=${type}`)
    .then(res => res.json())
    .then(({ vin }) => vin);

const getVINfromPath = (path = window.location.pathname) =>
  path.split('/').slice(-1)[0] || null;

const App = () => {
  const [vin, setVin] = useState(getVINfromPath());
  const [loading, setLoading] = useState(false);

  const loadVin = async type => {
    try {
      setLoading(true);
      const vin = await fetchVin(type);
      setVin(vin);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReal = loadVin.bind(null, 'real');
  const handleFake = loadVin.bind(null, 'fake');
  const handleManual = () => {
    const vin = window.prompt('Enter VIN');
    if (vin) {
      setVin(vin);
    }
  };

  // On mount, get a vin if there wasn't already one in the path
  useEffect(() => {
    if (!vin) {
      handleReal();
    }
  }, []);

  // Make sure URL matches the current vin
  useEffect(() => {
    const desiredURL = vin ? `/vin/${vin}` : '/';
    if (window.location.pathname !== desiredURL) {
      window.history.pushState({}, document.title, desiredURL);
    }
  });

  // Listen for the back button to keep the vin in sync
  useEffect(
    () => {
      const matchStateToURL = event => {
        setVin(getVINfromPath(event.target.location.pathname));
      };
      window.addEventListener('popstate', matchStateToURL);
      return () => window.removeEventListener('popstate', matchStateToURL);
    },
    [vin]
  );

  return (
    <div className="App">
      <VinButtons
        onReal={handleReal}
        onFake={handleFake}
        onManual={handleManual}
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
    {loading ? (
      <div className="spinner" />
    ) : !vin ? null : (
      <Barcode value={vin} />
    )}
  </div>
);

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

export default App;
