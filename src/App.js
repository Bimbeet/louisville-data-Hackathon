import React from 'react';
import './App.css';
import axios from 'axios';

const dataset = require('./csv/inspections.json');
const cors = 'https://cors-anywhere.herokuapp.com/'
const votingLocationsEndpoint = 'https://services1.arcgis.com/79kfd2K6fskCAkyg/ArcGIS/rest/services/OpenDataJeflib/FeatureServer/16/query?where=1%3D1&outFields=*&outSR=4326&f=json'
let parsedJson = []

class App extends React.Component {

  parseData() {
    let parsedJson = dataset.map(data => {
      console.log(data)
      // return JSON.parse(data)
    })
    console.log(parsedJson)
  }

  componentDidMount() {
    this.getData()
    this.renderMap()
    console.log(dataset[0])

  }

  renderMap() {
    const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
    mapboxgl.accessToken = 'pk.eyJ1IjoibWFyY3dyaWdodCIsImEiOiJjazN2cWdoYTEwMXlmM29waXM0cWtuNms2In0.FxNLrnmdS-yQxRDqkFoPgQ';
    var map = new mapboxgl.Map({
      container: 'mapDiv',
      style: 'mapbox://styles/mapbox/streets-v11'
    });
  }

  getData() {
    axios.get(`${cors}${votingLocationsEndpoint}`)
      .then(response => { console.log(response.data) })
      .catch(err => { console.log(err) })
  }

  render() {
    return (
      <div className="App" >
        <header className="App-header">
          <h1>Louisville Data Hackathon Starter</h1>
        </header>
        <div id='mapDiv'></div>
      </div>
    );
  }
}

export default App;
