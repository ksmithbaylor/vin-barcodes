import React, { useState, useEffect } from 'react';
import Barcode from 'react-barcode';
import './App.css';

export default () => {
  const [vin, setVin] = useState(vinFromPath());
  const [loading, withLoadingState] = useLoadingState();
  const loadVin = type => withLoadingState(() => fetchVin(type).then(setVin));

  // Keep the url in sync with the displayed vin
  useUrlSync(vin, setVin);

  // If there is no initial vin, load a real one
  useEffect(() => vin || loadVin('real'), []);

  return (
    <div className="App">
      <VinButtons
        onReal={() => loadVin('real')}
        onFake={() => loadVin('fake')}
        onManual={() => setVin(window.prompt('Enter VIN') || null)}
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

////////////////////////////////////////////////////////////////////////////////
// Helpers

const fetchVin = type =>
  fetch(`/.netlify/functions/randomVin?type=${type}`)
    .then(res => res.json())
    .then(({ vin }) => vin);

const vinFromPath = (path = window.location.pathname) =>
  path.split('/').slice(-1)[0] || null;

////////////////////////////////////////////////////////////////////////////////
// Custom hooks

const useLoadingState = () => {
  const [loading, setLoading] = useState(false);
  const withLoadingState = async task => {
    setLoading(true);
    await task();
    setLoading(false);
  };
  return [loading, withLoadingState];
};

const useUrlSync = (vin, setVin) => {
  // vin -> url
  useEffect(() => {
    const desiredURL = vin ? `/vin/${vin}` : '/';
    if (window.location.pathname !== desiredURL) {
      window.history.pushState({}, document.title, desiredURL);
    }
  });

  // url -> vin
  useEventListener('popstate', event =>
    setVin(vinFromPath(event.target.location.pathname))
  );
};

const useEventListener = (eventName, callback) => {
  useEffect(() => {
    window.addEventListener(eventName, callback);
    return () => window.removeEventListener(eventName, callback);
  }, []);
};
