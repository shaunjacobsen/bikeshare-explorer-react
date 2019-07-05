import React, { Component } from 'react';
import axios from 'axios';
import { MainMap } from './components/MainMap';
import { DataContainer } from './components/DataContainer';

import './styles/styles.css';

class App extends Component {
  state = {
    stations: [],
    selectedFromStation: undefined,
    fromStationStats: undefined,
  };

  componentDidMount() {
    axios.get(`${process.env.REACT_APP_API_URL}/stations`).then(res => {
      console.log(res);
      this.setState(
        prevState => ({ stations: res.data, selectedFromStation: res.data[0] }),
        () => {
          this.getStationStatistics(res.data[0].id);
        },
      );
    });
  }

  handleChangeFromStation = id => {
    this.setState(
      prevState => ({
        ...prevState,
        selectedFromStation: this.state.stations.find(
          station => station.id == id,
        ),
      }),
      () => {
        this.getStationStatistics(id);
      },
    );
  };

  getStationStatistics = (fromStationId, toStationId = undefined) => {
    const api = process.env.REACT_APP_API_URL;
    const query = toStationId
      ? `${api}/stats/from/${fromStationId}/to/${toStationId}`
      : `${api}/stats/from/${fromStationId}?r=id,start_station_id,count_trips,duration_mean,duration_median,duration_stddev,count_by_date_hour`;
    axios.get(query).then(res => {
      this.setState(prevState => ({
        ...prevState,
        fromStationStats: res.data,
      }));
    });
  };

  render() {
    return (
      <div className="App">
        <div className="map-container">
          <MainMap
            stations={this.state.stations}
            center={
              this.state.selectedFromStation && [
                parseFloat(this.state.selectedFromStation.longitude),
                parseFloat(this.state.selectedFromStation.latitude),
              ]
            }
          />
        </div>
        <DataContainer
          stations={this.state.stations}
          selectedFromStation={this.state.selectedFromStation}
          handleChangeFromStation={this.handleChangeFromStation}
          fromStationStats={this.state.fromStationStats}
        />
      </div>
    );
  }
}

export default App;
