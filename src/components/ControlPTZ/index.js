import React, { useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';

import ControlMovePTZ from '../ControlMovePTZ';
import ControlPresetsPTZ from '../ControlPresetsPTZ';

const ControlPTZ = (props) => {
  const [key, setKey] = useState('control');

  return (
    <div style={styles.container}>
      <Tabs activeKey={key} onSelect={(k) => setKey(k)}>
        <Tab eventKey="control" title="Controles">
          <div style={styles.content}>
            <ControlMovePTZ {...props} />
          </div>
        </Tab>
        <Tab eventKey="preset" title="Presets">
          <div style={styles.content}>
            <ControlPresetsPTZ {...props} />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default ControlPTZ;

const styles = {
  container: { marginTop: 5 },
  content: { paddingTop: 5, paddingBottom: 5 }
};