import React from 'react';

//Styles
import './App.css';
//Components
import BarcelonaMapGl from './containers/Map/BarcelonaMapGl';
import Navbar from "./components/Navbar"
import Footer from './components/Footer/Footer'
import 'bootstrap/dist/css/bootstrap.min.css';
import CitySelection from './components/CitySelection/CitySelection';


class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {selectedCity: 'Barcelona'};
    this.year = new Date().getFullYear()
  }


  handleSelectCity = (city) => {
    this.setState({
      selectedCity: city[0].id,
      latitude: city[0].coordinates[0],
      longitude: city[0].coordinates[1]
    })
    console.log('city in App.js', city)
  };

  render(){
    return (   
      <div className="App">
        <h1>{this.state.selectedCity}</h1>
        <BarcelonaMapGl
                  mapboxApiAccessToken={} 
                  selectedCity={this.state.selectedCity} 
                  latitude={this.state.latitude} 
                  longitude={this.state.longitude}/>
        <Navbar handleSelectCity={this.handleSelectCity}></Navbar>
        <Footer year={this.year}/>
      </div>
    );
  }
}
export default App;