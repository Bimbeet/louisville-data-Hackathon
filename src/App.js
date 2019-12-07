import React from 'react';
import './App.css';
import axios from 'axios';
import ReactMapboxGl, { Layer, Feature, Marker } from 'react-mapbox-gl';

const cors = 'https://cors-anywhere.herokuapp.com/'
const votingLocationsEndpoint = 'https://services1.arcgis.com/79kfd2K6fskCAkyg/ArcGIS/rest/services/OpenDataJeflib/FeatureServer/16/query?where=1%3D1&outFields=*&outSR=4326&f=json'
const Map = ReactMapboxGl({
  accessToken:
    'pk.eyJ1IjoibWFyY3dyaWdodCIsImEiOiJjazN2cWdoYTEwMXlmM29waXM0cWtuNms2In0.FxNLrnmdS-yQxRDqkFoPgQ'
});
const markerUrl = 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png'

class App extends React.Component {
  state = {
    locations: []
  }

  componentDidMount() {
    this.getData()
  }

  getData() {
    axios.get(`${cors}${votingLocationsEndpoint}`)
      .then(response => { 
        console.log(response.data)
        this.setState({ locations: response.data.features})
      })
      .catch(err => { console.log(err) })
  }

  render() {
    console.log(this.state.locations)
    const featuresArr = this.state.locations.map(feature => {
      return <Feature key={feature.attributes.OBJECTID} coordinates={[feature.geometry.x, feature.geometry.y]}/>
    })
    return (
      <div className="App" >
        <header className="App-header">
          <h1>Louisville Data Hackathon Starter</h1>
        </header>
        <Map
          style="mapbox://styles/mapbox/streets-v9"
          containerStyle={{
            height: '100vh',
            width: '100vw'
          }}
          center={[-85.758711, 38.248979]}
        >
          <Layer type="symbol" id="marker" layout={{ 'icon-image': 'marker-15' }}>
            {featuresArr}
          </Layer>
          {/* <Marker
            coordinates={[-85.758711, 38.248979]}
            anchor="bottom">
            <img src={markerUrl} />
          </Marker> */}
        </Map>;
      </div>
    );
  }
}

export default App;
