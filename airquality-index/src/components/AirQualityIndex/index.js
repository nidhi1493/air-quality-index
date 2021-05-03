import React, { Component } from 'react';

import './airQuality.css';

class AirQuality extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          "city": "Mumbai",
          "aqi": 179.56263876822666
        }, {
          "city": "Delhi",
          "aqi": 301.7728280914731
        }, {
          "city": "Chennai",
          "aqi": 141.71835457426621
        }, {
          "city": "Pune",
          "aqi": 223.87166078253136
        }, {
          "city": "Indore",
          "aqi": 51.40296789929337
        }, {
          "city": "Jaipur",
          "aqi": 138.30763678604075
        }
      ],
      aqiColor: [],
    }
  }

  componentDidMount = () => {
    this.webSocketCall();
  }

  webSocketCall = () => {
    //TODO: keep websocket url in a config file
    let webSocketObj = new WebSocket("ws://city-ws.herokuapp.com/");
    webSocketObj.onopen = () => {
      console.log("Connected ---->");
    }
    webSocketObj.onmessage = (evt) => {
      let message = JSON.parse(evt.data);
      this.setState({ data: message });
      console.log("response ------>", message);
      let aqiColor = this.getColor(message);
      this.setState({ aqiColor: aqiColor });
      console.log(aqiColor);
    }
    webSocketObj.onclose = () => {
      console.log("Connection closed ------>");
    }
  }

  renderTableHeader() {

    let header = Object.keys(this.state.data[0])
    return header.map((key, index) => {
      return <th key={index}>{key.toUpperCase()}</th>
    })
  }

  renderTableData() {
    let aqiColor = this.state.aqiColor || "#000000";
    return this.state.data.map((key, index) => {
      return (
        <tr>
          <td>{key["city"]}</td>
          <td style={{ color: aqiColor[index] }}>{parseFloat(parseFloat(key["aqi"]).toFixed(2))}</td>
        </tr>
      )
    })
  }

  getColor(aqi) {
    let color = [];
    aqi.forEach(i => {
      let index = parseFloat(parseFloat(i["aqi"]).toFixed(2));
      if (index >= 0 && index <= 50) {
        color.push("#009966");
      } else if (index > 50 && index < 100) {
        color.push("#FFDE33");

      } else if (index > 100 && index <= 200) {
        color.push("#FF9933");
      }
      else if (index > 200 && index <= 300) {
        color.push("#CC0033");

      } else if (index > 300 && index <= 400) {
        color.push("#660099");

      } else if (index > 400) {
        color.push("#7E0023");
      }
    });
    return color;
  }

  render() {
    return (
      <div>
        <h1 id='title'>Air Quality Index</h1>
        <table id='aqi'>
          <tbody>
            <tr>{this.renderTableHeader()}</tr>
            {this.renderTableData()}
          </tbody>
        </table>
      </div>
    )
  }
}

export default AirQuality;