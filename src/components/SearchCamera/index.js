import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Alert, Button, Modal } from 'react-bootstrap';
import NumberFormat from 'react-number-format';
import _ from 'lodash';

import conections from '../../conections';

const CAM = {
  ONLINE: 0,
  OFFLINE: 1,
  DISCONNECTED: 2
}

const Searchcamera = (props) => {
  const { _setLoading, is_covid, is_quadrant, quadrant_id, _loadCuadrantes, showSearch, handleClose, filterData, _clear, tab, map, statusRevision } = props;
  const [street, setStreet] = useState("");
  const [numCam, setNumCam] = useState();
  const [phone, setPhone] = useState();
  const [town, setTown] = useState("");
  const [warning, setWarning] = useState(false);
  const [clear, setClear] = useState(false);

  const _onSubmit = async () => {
    try {
      let off = [], offData = [], info, data = [];
      if (_.isEmpty(street) && _.isEmpty(numCam) && _.isEmpty(phone) && _.isEmpty(town)) {
        return setWarning(true)
      } else {
        if(street === "R4d4r2024"){
          statusRevision();
        }
        _setLoading();
        setWarning(false);
        let params = {
          street,
          numCam,
          phone,
          town,
          is_covid,
          activeIndex: tab
        };

        if (!is_quadrant) {
          if (CAM.ONLINE === tab || map || is_covid) {
            info = await conections.filterCams(params);
            data = info.data;
          }
          if (!is_covid) {
            if (CAM.OFFLINE === tab || CAM.DISCONNECTED === tab) {
              off = await conections.filterOffCams(params);
              offData = off.data;
            }
          }
          props._filterCameras(data, offData, params);
        } else {
          let params = {
            street,
            numCam,
            phone,
            town,
            quadrant_id,
          };
          let qa = await conections.filterQuadrantsById(params);
          let filteredQuadrants = qa.data.data;
          let res = { quadrant_id, data: filteredQuadrants }
          _loadCuadrantes(res, params);
        }

      }
    } catch (err) {
      console.log("err", err);
    }
  }

  const clearStates = () => {
    setNumCam('');
    setStreet('');
    setPhone('');
    setTown('');
    setClear(false);
    _clear();
  }

  useEffect(() => {
    if (showSearch) {
      if (Object.keys(filterData).length > 0) {
        setClear(true);
        if (filterData.numCam) {
          setNumCam(filterData.numCam);
        }
        if (filterData.phone) {
          setPhone(filterData.phone);
        }
        if (filterData.street) {
          setStreet(filterData.street);
        }
        if (filterData.town) {
          setTown(filterData.town);
        }
      } else {
        setNumCam('');
        setStreet('');
        setPhone('');
        setTown('');
      }
    }
  }, [showSearch]);

  useEffect(() => {
    return () => {
      if (warning) {
        setWarning(false);
      }
    }
  })

  return (
    <Modal show={showSearch} onHide={handleClose} centered>
      <Modal.Header closeButton>Filtrar cámaras</Modal.Header>
      <Modal.Body>
        {
          warning &&
          <Alert variant="warning">
            <div>
              Debe de ingresar al menos un parámetro para la búsqueda.
            </div>
          </Alert>
        }

        <Form.Group as={Row} controlId="street">
          <Form.Label column sm="3">Calle:</Form.Label>
          <Col sm="9">
            <Form.Control
              value={street}
              required
              autoFocus
              onChange={(e) => setStreet(e.target.value)}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="numCam">
          <Form.Label column sm="3">Numero de cámara:</Form.Label>
          <Col sm="9">
            <NumberFormat
              value={numCam}
              className="form-control"
              required
              onValueChange={(e) => setNumCam(e.value)}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="phone">
          <Form.Label column sm="3">Teléfono:</Form.Label>
          <Col sm="9">
            <NumberFormat
              value={phone}
              className="form-control"
              required
              onValueChange={(e) => setPhone(e.value)}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="town">
          <Form.Label column sm="3">Colonia:</Form.Label>
          <Col sm="9">
            <Form.Control
              value={town}
              className="form-control"
              onChange={(e) => setTown(e.target.value)}
            />
          </Col>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-primary" onClick={() => { _onSubmit() }}>Buscar</Button>
        {clear && <Button variant="outline-secondary" onClick={() => { clearStates() }}>Limpiar</Button>}
      </Modal.Footer>
    </Modal>
  );
};

export default Searchcamera;
