import React from 'react';
import './App.css';
import axios from 'axios';
import ReactMapboxGl, { Source, Layer, Feature, Marker, GeoJSONLayer } from 'react-mapbox-gl';
const cors = 'https://cors-anywhere.herokuapp.com/'
const votingLocationsEndpoint = 'https://services1.arcgis.com/79kfd2K6fskCAkyg/ArcGIS/rest/services/OpenDataJeflib/FeatureServer/16/query?where=1%3D1&outFields=*&outSR=4326&f=json'
const busRoutesEndpoint = 'https://ags1.lojic.org/arcgis/rest/services/LOJIC/AGOLTARC/MapServer/1/query?where=1%3D1&outFields=*&outSR=4326&f=json'
const Map = ReactMapboxGl({
  accessToken:
    'pk.eyJ1IjoibWFyY3dyaWdodCIsImEiOiJjazN2cWdoYTEwMXlmM29waXM0cWtuNms2In0.FxNLrnmdS-yQxRDqkFoPgQ',
});
const markerUrl = 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png'

const linePaint: MapboxGL.LinePaint = {
  'line-color': 'red',
  'line-width': 5
};

const geojson = {
  'type': 'FeatureCollection',
  'features': [
    {
      'type': 'Feature',
      'geometry': {
        'type': 'LineString',
        'coordinates': [
          [-85.77517097945368, 38.22742739111536],
          [-85.77518578329975, 38.2273448060474],
          [-85.77518812719283, 38.22733207337732],
          [-85.77518877399258, 38.22732142266926],
          [-85.77518709961217, 38.22726239717217],
          [-85.77517777752107, 38.22721222569671],
          [-85.7751650936868, 38.22716776256417],
          [-85.77514636918572, 38.22712578143165],
          [-85.77511354924303, 38.22707574525703],
          [-85.77504989555976, 38.22700808866059],
          [-85.77497762326867, 38.22694449254009],
          [-85.77476083236552, 38.22675490512381],
          [-85.77465886765184, 38.22666603501575],
          [-85.77449572981914, 38.226523550784414],
          [-85.77447755680812, 38.22650782469458],
          [-85.77418012066879, 38.22629096709665],
          [-85.77419768679796, 38.22607034004008],
          [-85.77420963317466, 38.225996718165646],
          [-85.7745250357219, 38.22424932924941],
          [-85.77460128362598, 38.22381817679562],
          [-85.77461175553677, 38.22375727959569],
          [-85.77461486467304, 38.223615113309904],
          [-85.77459774773457, 38.223545990495744],
          [-85.77457393997345, 38.22348982875784],
          [-85.77455094547545, 38.22345168301259],
          [-85.77451645571593, 38.223404926390195]
        ]
      }
    }
  ]
};

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

  busPath = () => {
    return this.state.routes.map(route => {
      // console.log(path.geometry.paths[0])
      route.geometry.paths.map(path => {
        let newPath = []
        newPath = path.map(coord => {
          //console.log(coord)
            return [coord[0], coord[1]]
        })
          //console.log(newPath)
          const newGeoComponent = {
            'type': 'FeatureCollection',
            'features': [
              {
                'type': 'Feature',
                'geometry': {
                  'type': 'LineString',
                  'coordinates': [
                    [102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]
                  ]
                }
              }
            ]
          };
          
          //console.log(newGeoComponent);
          console.log('json')
          return <GeoJSONLayer
            data={geojson}
            linePaint={linePaint}
          />
      })
    })
  }

  render() {
    // console.log(this.state.routes[0])
    const featuresArr = this.state.locations.map(feature => {
      return <Feature key={feature.attributes.OBJECTID} coordinates={[feature.geometry.x, feature.geometry.y]} />
    })
    // const busPath = this.state.routes.map(path => {
    //   console.log(path.geometry.paths[0])
    //   let features = path.geometry.paths.map(route => {
    //     return <Feature geometry="lineString" coordinates={[route[0], route[1]]} />
    //   })
    //   return features
    // })
    // })
    return (
      
      (this.state.routes !== undefined) ?
        <div className="App" >
          <Map
            style="mapbox://styles/mapbox/dark-v10"
            containerStyle={{
              height: '100vh',
              width: '100vw'
            }}
            center={[-85.758711, 38.248979]}
          >
            <Layer type="symbol" id="marker" layout={{ 'icon-image': 'marker-15' }}>
              {featuresArr}
            </Layer>
            <GeoJSONLayer
            data={geojson}
            linePaint={linePaint}
          />
            {/* {this.busPath()} */}

          </Map>;
      </div>
        :
        <div>
          <p>Loading...</p>
        </div>
    );
  }
}
export default App;
