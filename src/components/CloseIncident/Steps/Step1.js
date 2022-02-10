import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';

const Step1 = (props) => {
  const { SECTORS, INCIDENTS } = props;
  const { date, hour, name, coords, nameOficial, sector, type, typeOther } = props;
  const { setDate, setHour, setName, setCoords, setNameOficial, setSector, setType, setTypeOther } = props;

  const [ canWrite, setCanWrite ] = useState(false);

  useEffect(() => {
    const found = INCIDENTS.find((i) => i.name === type);
    setCanWrite(found && found.can_write);
  }, [ type ]);
  useEffect(() => {
    if (!canWrite) setTypeOther(null);
  }, [ canWrite ]);

  return (
    <div>
      <Form.Group>
        <Form.Label>FECHA DE LOS HECHOS:</Form.Label>
        <Form.Control
          type='date'
          name='date'
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder='...'
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>HORA DE LOS HECHOS:</Form.Label>
        <Form.Control
          type='text'
          name='hour'
          value={hour}
          onChange={(e) => setHour(e.target.value)}
          placeholder='hh:mm'
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>NOMBRE DE CIUDADANO ATENDIDO:</Form.Label>
        <Form.Control
          type='text'
          name='name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='...'
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>COORDENADAS DE LOS HECHOS:</Form.Label>
        <Form.Control
          type='text'
          name='coords'
          value={coords}
          onChange={(e) => setCoords(e.target.value)}
          placeholder='...'
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>NOMBRE OFICIAL ALCALDIA BENITO JUAREZ:</Form.Label>
        <Form.Control
          type='text'
          name='nameOficial'
          value={nameOficial}
          onChange={(e) => setNameOficial(e.target.value)}
          placeholder='...'
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>SECTOR:</Form.Label>
        <Form.Control as='select' custom>
          {SECTORS.map((s, idx) => (
            <option key={`sector-${idx}`} value={s.name} onClick={() => setSector(s.name)} selected={s.name === sector}>
              {s.name}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group>
        <Form.Label>TIPO DE INCIDENCIA:</Form.Label>
        <Form.Control as='select' custom>
          {INCIDENTS.map((i, idx) => (
            <option key={`incideent-${idx}`} value={i.name} onClick={() => setType(i.name)} selected={i.name === type}>
              {i.name}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      {canWrite && (
        <Form.Group>
          <Form.Label>OTRO TIPO DE INCIDENCIA (ESPECIFIQUE):</Form.Label>
          <Form.Control
            type='text'
            name='typeOther'
            value={typeOther}
            onChange={(e) => setTypeOther(e.target.value)}
            placeholder='...'
          />
        </Form.Group>
      )}
    </div>
  );
};

export default Step1;
