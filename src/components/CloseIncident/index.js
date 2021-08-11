import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';

import conections from '../../conections';

import Loading from '../Loading';
import Step1 from './Steps/Step1';
import { styles } from './styles';

const CloseIncident = (props) => {
  const { show, setShow } = props;

  const [ loading, setLoading ] = useState(false);
  const [ SECTORS, SET_SECTORS ] = useState([]);
  const [ INCIDENTS, SET_INCIDENTS ] = useState([]);

  // Step 1
  const [ date, setDate ] = useState(null);
  const [ hour, setHour ] = useState(null);
  const [ name, setName ] = useState(null);
  const [ coords, setCoords ] = useState(null);
  const [ nameOficial, setNameOficial ] = useState(null);
  const [ sector, setSector ] = useState(null);
  const [ incidentType, setIncidentType ] = useState(null);
  const [ incidentTypeOther, setIncidentTypeOther ] = useState(null);

  useEffect(() => {
    _init();
  }, []);

  const _init = async () => {
    setLoading(true);
    let resS = await conections.getAllPoliceSector();
    if (resS.data && resS.data.data && resS.data.data.getAllPoliceSector)
      SET_SECTORS(resS.data.data.getAllPoliceSector);

    let resI = await conections.getAllPoliceIncidentType();
    if (resI.data && resI.data.data && resI.data.data.getAllPoliceIncidentType)
      SET_INCIDENTS(resI.data.data.getAllPoliceIncidentType);
    setLoading(false);
  };

  return (
    <Modal show={show} centered={true} size={'xl'} backdrop={true} onHide={() => setShow(false)}>
      <Modal.Header>Reporte - Desactivar Alerta</Modal.Header>
      <Modal.Body>
        {loading ? (
          <Loading />
        ) : (
          <div>
            <Step1
              SECTORS={SECTORS}
              INCIDENTS={INCIDENTS}
              date={date}
              setDate={setDate}
              hour={hour}
              setHour={setHour}
              name={name}
              setName={setName}
              coords={coords}
              setCoords={setCoords}
              nameOficial={nameOficial}
              setNameOficial={setNameOficial}
              sector={sector}
              setSector={setSector}
              type={incidentType}
              setType={setIncidentType}
              typeOther={incidentTypeOther}
              setTypeOther={setIncidentTypeOther}
            />
          </div>
        )}
      </Modal.Body>
      <Modal.Footer style={styles.buttonsFooter}>
        <Button style={styles.button} variant='success' disabled={loading}>
          Continuar
        </Button>
        <Button style={styles.button} variant='danger'>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CloseIncident;
