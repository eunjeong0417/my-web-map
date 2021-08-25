import React, { Component } from 'react';
import {
  InfoWindow,
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";
import Geocode from 'react-geocode';


Geocode.setApiKey('AIzaSyBcUyqcJVBmLUG1QVUz3KveAxeR620ujgU');


export class Map extends Component {

         state = {
            address: "",
            city: "",
            area: "",
            state: "",
            zoom: 15,
            height: 400,
            mapPosition: {
                lat: 0,
                lng: 0,
            },
            markerPosition: {
                lat: 0,
                lng: 0,
            }
        }

    getCity = (addressArray) => {
        let city = '';
        for (let i = 0; i < addressArray.length; i++){
            if (addressArray[i].types[0] && 'administrative_area_level_2' === addressArray[i].types[0]) {
                city = addressArray[i].long_name;
                return city;
            }
        }
    }

     getArea = (addressArray) => {
        let area = '';
        for (let i = 0; i < addressArray.length; i++) {
            if (addressArray[i].types[0]) {
                for (let j = 0; j < addressArray[i].types.length; j++) {
                    if ('sublocality_level_1' === addressArray[i].types[j] || 'locality' === addressArray[i].types[j]) {
                        area = addressArray[i].long_name;
                        return area;
                    }
                }
            }
        }
    };

    getState = (addressArray) => {
        let state = '';
        for (let i = 0; i < addressArray.length; i++) {
            for (let i = 0; i < addressArray.length; i++) {
                if (addressArray[i].types[0] && 'administrative_area_level_1' === addressArray[i].types[0]) {
                    state = addressArray[i].long_name;
                    return state;
                }
            }
        }
    };
        
    //onMarkerDragEnd로 위도, 경도 정보 확인
    //geocode로 위치 정보 찾는다
        onMarkerDragEnd = (event) => {
            let Lat = event.latLng.lat();
            let Lng = event.latLng.lng();

            Geocode.fromLatLng(Lat, Lng)
                .then(res => {
                    const address = res.results[0].formatted_address,
                        addressArray = res.results[0].address_components,
                        city = this.getCity(addressArray),
                        area = this.getArea(addressArray),
                        state = this.getState(addressArray);
                    
                    this.setState({
                        address: (address) ? address : '',
                    //address가 없으면 빈값으로 설정
                        area: (area) ? area : '',
                        city: (city) ? city : '',
                        state: (state) ? state : '',
                        markerPosition: {
                            lat: Lat,
                            lng: Lng,
                        },
                        mapPosition: {
                            lat: Lat,
                            lng: Lng,
                        },
                    })
                    
                })
            // console.log('Lat', Lat)
            // console.log('Lng', Lng)
        }



    render() {

       
        const MapWithAMarker = withScriptjs(withGoogleMap(props =>
  <GoogleMap
    defaultZoom={8}
    defaultCenter={{ lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng }}
  >
                <Marker
                    draggable={true}
                    onDragEnd={this.onMarkerDragEnd}
                    position={{ lat: this.state.markerPosition.lat, lng: this.state.markerPosition.lng }}>
                    <InfoWindow>
                        <div>hello</div>
                    </InfoWindow>
      </Marker>
    
  </GoogleMap>
));
        return (
            <div>
               <MapWithAMarker
  googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBcUyqcJVBmLUG1QVUz3KveAxeR620ujgU&v=3.exp&libraries=geometry,drawing,places"
  loadingElement={<div style={{ height: `100%` }} />}
  containerElement={<div style={{ height: `400px` }} />}
  mapElement={<div style={{ height: `100%` }} />}
/>

            </div>
        )
    }
}

export default Map;
