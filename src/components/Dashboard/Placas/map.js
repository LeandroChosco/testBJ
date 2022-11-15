import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  Marker,
  InfoWindow,
} from "react-google-maps";
import circle from "../../../assets/images/circle.svg";
import { Row, Col} from "reactstrap";
export default function MapaGoogle({ setMarket, dataMap }) {
  function Map() {
    const [market, setSelectMarker] = useState(null);
    const [center, setCenter] = useState({ lat: 19.3984, lng: -99.15766 })
    const minName =(name)=>{
      const nameArray=name.split(' ')
      const nameMin = `${nameArray[0]} ${nameArray[1]} ${nameArray[2]}`
      return nameMin;
    }
    const porcent =(number)=>{

        const bNum=parseFloat(dataMap[0].totalCount)+parseFloat(dataMap[1].totalCount);
        let porcent =(parseFloat(number)/parseFloat (bNum) *100)
        return parseFloat(porcent).toFixed(2) ;
    } 
    const sizeBubble =(totalCount)=>{
     
      let count= parseInt(totalCount)
      let dm=0;
        switch (true) {
          case count <= 100:
              dm = count;
            break;
          	case count > 100 && count<= 1000:
              dm = (parseInt(count)/10)
            break;
            case count > 1000 && count<= 10000:
              dm = (parseInt(count)/100)
            break;
            case count > 10000 && count<= 100000:
              dm = (parseInt(count)/1000)
            break;
            case count > 100000 && count<= 10000000:
              dm = (parseInt(count)/10000)
            break;
          default:
            break;
        }
        return parseInt(dm);
    }
    useEffect(() => {
     
    }, [center])
    return (
      <Row>
        <Col xl={6} md={6} sm={6} style={{width:'300px'}}>
          <GoogleMap
            zoom={14}
            center={center}
          >
            {dataMap.length > 0 &&
              dataMap.map((lpr, index) => (
                <Marker
                  key={index}
                  position={{
                    lat: parseFloat(lpr.coord.latitude),
                    lng: parseFloat(lpr.coord.longitude),
                  }}
                  onClick={() => {
                    setCenter({ lat: lpr.coord.latitude, lng: lpr.coord.longitude })
                    setSelectMarker(lpr);
                  }}
                  icon={{
                    url: circle,
                    scaledSize:
                     new window.google.maps.Size(
                          sizeBubble(lpr.totalCount),
                          sizeBubble(lpr.totalCount)
                          )
                    
                  }}
                />
              ))}
          </GoogleMap>
        </Col>
        <Row className="absolute" >
        <Col  xl={3} md={3} sm={3}  style={{position:'absolute', marginLeft:'50%',bottom:'70%'}}>
        { 
              dataMap &&
                <Row  className="infoMap">
                {/* <h1>Detecciones por Cámara</h1> */}
   
                <Col xl={6} className="mt-5">
                  <span className="text-h1  text-porcent mb-4">{porcent(dataMap[0].totalCount)} %</span>
                  <p className="" style={{textAlign: "left"}}>{minName(dataMap[0].minName)}</p>
                </Col>

                <Col xl={6} className="mt-5">
                  <span className="text-h1  text-porcent mb-4">{porcent(dataMap[1].totalCount)} %</span>
                  <p className="" style={{textAlign: "left"}}>{minName(dataMap[1].minName)}</p>
                </Col>
                 </Row>
        }      
        </Col>   
        <Col style={{position:'absolute', marginLeft:'50%',bottom:'70%'}}  xl={3} md={3} sm={3} >
        {market ? (
            <div className="infoMap" style={{position:'absolute'}}>
            {/* <h1>Detalles por Cámara</h1> */}
              <Row >

                <Col className="py-4" xl={12}>
                  <h3 className="nameCol" >
                    {market.address}
                  </h3>
                </Col>
                <Col xl={6}>
                  <span className="text-h">{market.totalCount}</span>
                  <p>Conteo</p>
                </Col>
                <Col xl={6}>
                  <span className="text-h">{market.totalCoinc}</span>
                  <p>Coincidencias</p>
                </Col>
                <Col className="py-3">
                  <h5>
                    <b>Ranking Placas</b>
                  </h5>

                  <thead className="tableMap">
                    <tr className="tr">
                      <th className="th">Placa</th>
                      <th className="px-5 th">Coincidencia</th>
                      <th className="th">Vehículo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {market.plates.map((placa) => (
                      <tr className="tr">
                        <td className="th">{placa.plate}</td>
                        <td className="px-5 pt-2 th">{placa.totalCoinc}</td>
                        <td className="th">{placa.typeVehicule}</td>
                      </tr>
                    ))}
                  </tbody>
                </Col>
              </Row>
            </div>
        ) : 
        <div className="infoMap" style={{position:'absolute'}}>
        <Row >
                <Col className="py-4" xl={12}>
                  <h3 className="nameCol" >
                    {dataMap[0].address}
                  </h3>
                </Col>
                <Col xl={6}>
                  <span className="text-h">{dataMap[0].totalCount}</span>
                  <p>Conteo</p>
                </Col>
                <Col xl={6}>
                  <span className="text-h">{dataMap[0].totalCoinc}</span>
                  <p>Coincidencias</p>
                </Col>
                <Col className="py-3">
                  <h5>
                    <b>Ranking Placas</b>
                  </h5>

                  <thead className="tableMap">
                    <tr className="tr">
                      <th className="th">Placa</th>
                      <th className="px-5 th">Coincidencia</th>
                      <th className="th">Vehículo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataMap[0].plates.map((placa) => (
                      <tr className="tr">
                        <td className="th">{placa.plate}</td>
                        <td className="px-5 pt-2 th">{placa.totalCoinc}</td>
                        <td className="th">{placa.typeVehicule}</td>
                      </tr>
                    ))}
                  </tbody>
                </Col>
              </Row>
        </div>
        }
        </Col>

        </Row>

      </Row>
    );
  }

  const WrappedMap = withScriptjs(withGoogleMap(Map));
  return (
    <WrappedMap
      googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_APIKEY_C5VIRTUAL}`}
      loadingElement={<div style={{ height: `100%` }} />}
      containerElement={<div style={{ height: `100%` }} />}
      mapElement={<div style={{ height: `100%` }} />}
    />
  );
}
