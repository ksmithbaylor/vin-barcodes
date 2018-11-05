import React, { Component } from 'react';
import Barcode from 'react-barcode';
import './App.css';

const fetchVin = type =>
  fetch(`/.netlify/functions/randomVin?type=${type}`)
    .then(res => res.json())
    .then(({ vin }) => vin);

const getVINfromPath = path => path.split('/').slice(-1)[0];

class App extends Component {
  state = {
    vin: null,
    loading: false
  };

  async componentDidMount() {
    window.addEventListener('popstate', this.matchStateToURL);
    try {
      const pathVIN = getVINfromPath(window.location.pathname);
      pathVIN ? this.setState({ vin: pathVIN }) : this.handleReal();
    } catch (err) {
      console.error(err);
    }
  }

  async fetchVin(type) {
    try {
      this.setState({ loading: true });
      const vin = await fetchVin(type);
      this.setState({ loading: false, vin });
      window.history.pushState({}, document.title, `/vin/${vin}`);
    } catch (err) {
      console.error(err);
    }
  }

  matchStateToURL = event => {
    const pathVIN = getVINfromPath(event.target.location.pathname);
    this.setState({ vin: pathVIN });
  };

  handleReal = this.fetchVin.bind(this, 'real');
  handleFake = this.fetchVin.bind(this, 'fake');

  handleManual = () => {
    const vin = window.prompt('Enter VIN');
    if (vin) {
      this.setState({ vin });
    }
  };

  render() {
    return (
      <div className="App">
        <VinButtons
          onReal={this.handleReal}
          onFake={this.handleFake}
          onManual={this.handleManual}
        />
        <BarcodeDisplay vin={this.state.vin} loading={this.state.loading} />
        <Info />
      </div>
    );
  }
}

function VinButtons({ onReal, onFake, onManual }) {
  return (
    <div className="VinButtons">
      <button onClick={onFake}>Fake</button>
      <button onClick={onReal}>Real</button>
      <button onClick={onManual}>Manual</button>
    </div>
  );
}

function BarcodeDisplay({ vin, loading }) {
  const contents = loading ? (
    <div className="spinner" />
  ) : !vin ? null : (
    <Barcode value={vin} />
  );
  return <div className="BarcodeDisplay">{contents}</div>;
}

function Info() {
  const randomVinLink = (
    <a href="http://randomvin.com" target="_blank" rel="noopener noreferrer">
      RandomVIN.com
    </a>
  );

  const githubLink = (
    <a
      href="https://github.com/ksmithbaylor/vin-barcodes"
      target="_blank"
      rel="noopener noreferrer"
    >
      GitHub
    </a>
  );

  return (
    <footer>
      Driven by {randomVinLink}. Made by Kevin Smith, who was tired of Googling
      "vin barcode" during development. Code on {githubLink}.<br />
    </footer>
  );
}

export default App;
