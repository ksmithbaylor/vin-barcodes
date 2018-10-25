import React, { Component } from 'react';
import Barcode from 'react-barcode';
import './App.css';

const fetchVin = type =>
  fetch(`/.netlify/functions/randomVin?type=${type}`).then(res => res.json());

const fetchTotal = () =>
  fetch('/.netlify/functions/totalCount')
    .then(res => res.json())
    .then(json => json.total);

const getVINfromPath = (path) => path.split('/').slice(-1)[0]

class App extends Component {
  state = {
    vin: null,
    total: null,
    loading: false
  };

  async componentDidMount() {
    window.addEventListener('popstate', this.matchStateToURL.bind(this))
    try {
      const pathVIN = getVINfromPath(window.location.pathname)
      pathVIN ? this.setState({ vin: pathVIN }) : this.handleReal();
    } catch (err) {
      console.error(err);
    }
  }

  async fetchVin(type) {
    try {
      this.setState({ loading: true });
      const updates = await fetchVin(type);
      this.setState({ loading: false, ...updates });
      window.history.pushState({}, document.title, `/vin/${updates.vin}`);
    } catch (err) {
      console.error(err);
    }
  }

  matchStateToURL(event) {
    const pathVIN = getVINfromPath(event.target.location.pathname);
    this.setState({ vin: pathVIN })
  }

  handleReal = this.fetchVin.bind(this, 'real');
  handleFake = this.fetchVin.bind(this, 'fake');

  render() {
    return (
      <div className="App">
        <VinButtons onReal={this.handleReal} onFake={this.handleFake} />
        <BarcodeDisplay vin={this.state.vin} loading={this.state.loading} />
        <Info total={this.state.total} />
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

function Info({ total }) {
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

  const countInfo =
    total !== null ? `${total} VINs fetched so far!` : <>&nbsp;</>;

  return (
    <footer>
      Driven by {randomVinLink}. Made by Kevin Smith, who was tired of Googling
      "vin barcode" during development. Code on {githubLink}.<br />
      {countInfo}
    </footer>
  );
}

export default App;
