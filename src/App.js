import React, { Component } from 'react';
import Barcode from 'react-barcode';
import './App.css';

const randomVinUrl = type => `/.netlify/functions/randomVin?type=${type}`;

class App extends Component {
  state = {
    vin: null,
    loading: false
  };

  fetchVin(type) {
    console.log('fetching', type);
    this.setState({ loading: true }, () => {
      fetch(randomVinUrl(type))
        .then(response => response.text())
        .then(vin => {
          this.setState({ vin, loading: false });
        })
        .catch(err => {
          console.error(err);
        });
    });
  }

  handleReal = this.fetchVin.bind(this, 'real');
  handleFake = this.fetchVin.bind(this, 'fake');

  render() {
    return (
      <div className="App">
        <VinButtons onReal={this.handleReal} onFake={this.handleFake} />
        <BarcodeDisplay vin={this.state.vin} loading={this.state.loading} />
        <Info />
      </div>
    );
  }
}

function VinButtons({ onReal, onFake }) {
  return (
    <div className="VinButtons">
      <button onClick={onFake}>Fake VIN</button>
      <button onClick={onReal}>Real VIN</button>
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
      "vin barcode" during development. Code on {githubLink}.
    </footer>
  );
}

export default App;
