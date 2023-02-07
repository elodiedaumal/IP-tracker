import img1 from './images/pattern-bg.png';
import arrow from './images/icon-arrow.svg';
import marker from './images/icon-location.svg';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const SectionBg = styled.section`
  background: center / cover no-repeat url(${img1});
  height: 25vh;
  text-align: center;
  padding: 1rem;
  display: flex;
  flex-direction: column;
`;
const SectionTitle = styled.h1`
  color: #fff;
  margin-bottom: 1.5rem;
  font-weight: 400;
  font-size: 1.5rem;
`;

const Form = styled.div`
   display: flex;
  justify-content: center;
  margin-bottom:2rem
  }
`;
const Input = styled.input`
  width: 90%;
  height: 3rem;
  border-radius: 10px 0px 0px 10px;
  cursor: pointer;
  padding: 1rem;
  border: none;
  @media (min-width: 500px) {
    width: 40%;
  }
`;

const Btn = styled.button`
background-color:var(--VeryDarkGray);
 height: 3rem;
 width:3rem;
   border-radius: 0px 10px 10px 0px;
   cursor: pointer;
   border:none;
   
  }
`;
const Value = styled.div`
background-color:#fff;
   border-radius: 10px;
   margin: auto;
   z-index:999;
   display:flex;
   flex-direction:column;
   row-gap:2rem;
   position:relative;
   padding:1rem;
   width:100%;
   @media (min-width: 500px) {
     flex-direction:row;
     column-gap:2rem;
     width:80%;
     text-align:left;
      padding:2rem;
  }
  }
`;
const Info = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
  @media (min-width: 500px) {
    width: 25%;
    border-right: 1px solid var(--DarkGray);
    &:nth-child(4) {
      border-right: none;
    }
  }
`;

const InfoText = styled.p`
 font-weight:800;
 font-size:22px;
 color:var(--VeryDarkGray)
  }
`;
const InfoTitle = styled.h3`
   color:var(--DarkGray);
   letter-spacing:2px;
   font-weight:500;
   font-size:12px
  }
`;

const myIcon = new L.Icon({
  iconUrl: marker,
  iconRetinaUrl: marker,
  popupAnchor: [-0, -0],
  iconSize: [30, 35],
});

const ititialurl = `https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.REACT_APP_ACCESS_KEY}`;

function App() {
  const [searchIp, setSearchIp] = useState('');
  const [locations, setLocations] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const getLocation = async () => {
    let url;
    if (searchIp) {
      url = `${ititialurl}&ip=${searchIp}`;
    } else {
      url = `${ititialurl}`;
    }
    try {
      const response = await axios.get(url);
      const locations = response.data;
      const { city, country_code2, ip, isp, latitude, longitude, zipcode } =
        locations;
      const { current_time } = locations.time_zone;
      const newLocation = {
        ip,
        isp,
        latitude,
        longitude,
        current_time,
        address: `${city}, ${country_code2} ${zipcode}`,
      };
      setLatitude(newLocation.latitude);
      setLongitude(newLocation.longitude);
      setLocations(newLocation);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    getLocation();
    return;
  };

  return (
    <>
      <SectionBg>
        <SectionTitle>IP Address Tracker</SectionTitle>
        <Form>
          <Input
            placeholder='Search for any IP adress or domain'
            type='text'
            value={searchIp}
            onChange={(e) => setSearchIp(e.target.value)}
          />
          <Btn className='btn' type='submit' onClick={handleSubmit}>
            <img src={arrow} alt='' />
          </Btn>
        </Form>

        <Value>
          <Info>
            <InfoTitle>IP ADDRESS</InfoTitle>
            <InfoText>{locations.ip}</InfoText>
          </Info>
          <Info>
            <InfoTitle>LOCATION</InfoTitle>
            <InfoText>{locations.address}</InfoText>
          </Info>
          <Info>
            <InfoTitle>TIME ZONE</InfoTitle>
            <InfoText>{locations.current_time}</InfoText>
          </Info>
          <Info>
            <InfoTitle>ISP</InfoTitle>

            <InfoText>{locations.isp}</InfoText>
          </Info>
        </Value>
      </SectionBg>

      <MapContainer
        center={[latitude, longitude]}
        key={locations.ip}
        zoom={13}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <Marker icon={myIcon} position={[latitude, longitude]}>
          <Popup>You are here!</Popup>
        </Marker>
      </MapContainer>
    </>
  );
}

export default App;
