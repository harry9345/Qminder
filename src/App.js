import { React, Component } from "react";
import { Col, Container, Row } from "react-bootstrap";
import axios from "axios";

import Photos from "./Components/photo";
import classes from "./App.module.css";

class App extends Component {
  state = {
    venues: [],
    photosUrl: [],
  };

  componentDidMount() {
    this.getVenues();
  }
  // google map api
  renderMap = () => {
    loadScript(
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyB97teau2ZKw8JZu_zll6Sgtm6WqaQJPk4&callback=initMap&libraries=&v=weekly"
    );
    window.initMap = this.initMap;
  };
  // FourSQ venues
  getVenues = async () => {
    try {
      await axios
        .get("https://api.foursquare.com/v2/venues/explore?", {
          params: {
            client_id: "T0XQ22NTXUJVU0IPKNW4L34ROBGEA2NHX4ZUV5VMOLBEXC42",
            client_secret: "UVWYSTTJV1LTPQNBKRMDWMJM3NAN1Z4HGJBBSGAFWJM3BO2F",
            query: "Burger joint",
            near: "Tartu",
            v: "20211301",
          },
        })
        .then((response) => {
          this.setState(
            {
              venues: response.data.response.groups[0].items,
            },
            this.renderMap()
          );
          for (
            var i = 0;
            i < response.data.response.groups[0].items.length;
            i++
          ) {
            let venueId = response.data.response.groups[0].items[i].venue.id;
            this.getPhoto(venueId);
          }
        });
    } catch (error) {
      // Handle Error Here
      console.log(" My Error : " + error);
    }
  };

  // FourSQ Photo
  getPhoto = async (venueId) => {
    try {
      await axios
        .get(`https://api.foursquare.com/v2/venues/${venueId}/photos?`, {
          params: {
            client_id: "T0XQ22NTXUJVU0IPKNW4L34ROBGEA2NHX4ZUV5VMOLBEXC42",
            client_secret: "UVWYSTTJV1LTPQNBKRMDWMJM3NAN1Z4HGJBBSGAFWJM3BO2F",
            group: "venue",
            limit: "200",
            v: "20211301",
          },
        })
        .then((response) => {
          for (var i = 0; i < response.data.response.photos.items.length; i++) {
            this.setState({
              photosUrl: [
                response.data.response.photos.items[i].prefix +
                  "original" +
                  response.data.response.photos.items[i].suffix,
                ...this.state.photosUrl,
              ],
            });
          }
        });
    } catch (error) {
      console.log(" My photo Error : " + error);
    }
  };

  initMap = () => {
    // create map
    var map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: 58.378, lng: 26.7321 },
      zoom: 13,
    });
    // create circle
    const tartuBusStop = new window.google.maps.Circle({
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      map,
      center: { lat: 58.378, lng: 26.7321 },
      radius: 1000,
    });

    // bus stop pin
    const image =
      "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";
    const busStop = new window.google.maps.Marker({
      position: { lat: 58.378, lng: 26.7321 },
      map,
      title: "Tartu Bus Stop",
      icon: image,
    });

    // create an info window
    const infowindow = new window.google.maps.InfoWindow();

    // display dynamic markers
    this.state.venues.map((myVenue) => {
      const contentString = `
      <a href="/">${myVenue.venue.name}</a>
      `;

      // create markers
      var marker = new window.google.maps.Marker({
        position: {
          lat: myVenue.venue.location.lat,
          lng: myVenue.venue.location.lng,
        },
        map: map,
        title: myVenue.venue.name,
      });

      // add click on markers
      marker.addListener("click", () => {
        // change the content
        infowindow.setContent(contentString);
        // open an info marker
        infowindow.open(map, marker);
      });

      return marker;
    });
  };
  render() {
    return (
      <Container>
        <Row>
          <Col sm={8} id="map" className={classes.Map}></Col>
          <Photos images={this.state.photosUrl} key={this.state.venues.name} />
        </Row>
      </Container>
    );
  }
}

function loadScript(url) {
  var index = window.document.getElementsByTagName("script")[0];
  var script = window.document.createElement("script");
  script.src = url;
  script.async = true;
  script.defer = true;
  index.parentNode.insertBefore(script, index);
}

export default App;
