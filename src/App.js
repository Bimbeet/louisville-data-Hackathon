import React from 'react';
import './App.css';
import axios from 'axios';
import ReactMapboxGl, { Layer, Feature, Marker } from 'react-mapbox-gl';

const cors = 'https://cors-anywhere.herokuapp.com/'
const votingLocationsEndpoint = 'https://services1.arcgis.com/79kfd2K6fskCAkyg/ArcGIS/rest/services/OpenDataJeflib/FeatureServer/16/query?where=1%3D1&outFields=*&outSR=4326&f=json'
const busRoutesEndpoint = 'https://ags1.lojic.org/arcgis/rest/services/LOJIC/AGOLTARC/MapServer/1/query?where=1%3D1&outFields=*&outSR=4326&f=json'
const Map = ReactMapboxGl({
  accessToken:
    'pk.eyJ1IjoibWFyY3dyaWdodCIsImEiOiJjazN2cWdoYTEwMXlmM29waXM0cWtuNms2In0.FxNLrnmdS-yQxRDqkFoPgQ',
});
const markerUrl = 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png'

class App extends React.Component {
  state = {
    locations: [],
    routes: []
  }

  componentDidMount() {
    this.getVL()
    this.getPre()
  }

  getVL() {
    axios.get(`${cors}${votingLocationsEndpoint}`)
      .then(response => {
        this.setState({ locations: response.data.features })
      })
      .catch(err => { console.log(err) })
  }
  getPre() {
    axios.get(`${cors}${busRoutesEndpoint}`)
      .then(response => {
        console.log(response.data)
        this.setState({ routes: response.data.features })
      })
      .catch(err => { console.log(err) })
  }

  render() {
    console.log(this.state.routes)
    const featuresArr = this.state.locations.map(feature => {
      return <Feature key={feature.attributes.OBJECTID} coordinates={[feature.geometry.x, feature.geometry.y]} />
    })
    const busPath = this.state.routes.map(path => {
      console.log(path.geometry.paths)
      let features = path.geometry.paths.map(route => {
        return <Feature geometry="lineString" coordinates={[route[0], route[1]]} />
      })
      return features
    })
    return (
      <div className="App" >
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
          <Layer type="line" id="route" layout={{
            "line-join": "round",
            "line-cap": "round"
          }} paint={{
            "line-color": "#888",
            "line-width": 6
          }}>{busPath}</Layer>
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
