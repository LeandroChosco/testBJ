import React, { useState, useEffect } from 'react';
import { InputGroup, FormControl } from 'react-bootstrap';
import { Button } from 'semantic-ui-react';

import Spinner from 'react-bootstrap/Spinner';
import conections from '../../conections';

const ControlPresetsPTZ = (props) => {
  const [ ip, setIp ] = useState(null);
  const [ profile, setProfile ] = useState('');
  const [ presetName, setPresetName ] = useState('');
  const [ presets, setPresets ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const [ loadingMove, setLoadingMove ] = useState([]);
  const [ errorMessage, setErrorMessage ] = useState('');
  const [ thisurlHistory, setUrlHistory] = useState('');
  const [ thisurlHistoryPort, setUrlHistoryPort] = useState('');

  useEffect(() => {
    (async () => {
      let { camera } = props;
      let params = { ip: camera.dataCamValue.camera_ip };
      
      let urlHistory = "";
      let urlHistoryPort = "";

      if(camera.urlHistory === "NULL" || camera.urlHistory === null || camera.urlHistory === ""){
        urlHistory = "0.0.0.0";
      }else{
        urlHistory = camera.urlHistory;
      }

      if(camera.urlHistoryPort === "NULL" || camera.urlHistoryPort === null || camera.urlHistoryPort === ""){
        urlHistoryPort = "0";
      }else{
        urlHistoryPort = camera.urlHistoryPort;
      }

      await conections.newOnvifDevice(urlHistory, urlHistoryPort, params);
      let dataProfile = await conections.getProfilePTZ(urlHistory, urlHistoryPort, params);
      params.ProfileToken = dataProfile.data ? dataProfile.data.token : '';

      if (!params.ProfileToken || params.ProfileToken === '')
        setErrorMessage('No se encontraron los recursos necesarios para poder controlar la camara.');
      else await _handleGetPresets(params.ip, params.ProfileToken, urlHistory, urlHistoryPort);
      setIp(params.ip);
      setProfile(params.ProfileToken);
      setLoading(false);
      setUrlHistory(urlHistory)
      setUrlHistoryPort(urlHistoryPort)
    })();
  }, []);

  const _handleSetPreset = async () => {
    let params = { ip, ProfileToken: profile, PresetName: presetName };
    await conections.setPreset(thisurlHistory, thisurlHistoryPort, params);
    _handleGetPresets();
    setPresetName('');
  };
  const _handleGetPresets = async (cam = ip, ProfileToken = profile, geturlHistory = thisurlHistory, geturlHistoryPort = thisurlHistoryPort) => {
    let params = { ip: cam, ProfileToken, geturlHistory, geturlHistoryPort };
    setLoading(true);
    let dataGet = await conections.getPresets(geturlHistory, geturlHistoryPort, params);

    if (dataGet.data && dataGet.data.GetPresetsResponse) {
      const { data: { GetPresetsResponse: { Preset } } } = dataGet;
      try { setPresets([ ...Preset ]); }
      catch (e) { setPresets([ Preset ]); }
    } else setPresets([]);
    setLoading(false);
  };
  const _handleGoToPreset = (PresetToken) => {
    let params = { ip, ProfileToken: profile, PresetToken, Speed: { x: 1, y: 1, z: 1 } };
    conections.goToPresets(thisurlHistory, thisurlHistoryPort, params);

    setLoadingMove([ ...loadingMove, PresetToken ]);
    setTimeout(() => setLoadingMove(loadingMove.filter((l) => l !== PresetToken)), 25000);
  };
  const _handleRemovePreset = async (PresetToken) => {
    let params = { ip, ProfileToken: profile, PresetToken };
    await conections.removePreset(thisurlHistory, thisurlHistoryPort, params);
    _handleGetPresets();
  };

  return (
    <div>
      {errorMessage !== '' ? (
        <div>{errorMessage}</div>
      ) : loading ? (
        <div>
          <Spinner animation="border" variant="info" role="status" size="xl">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <div>
          <InputGroup>
            <FormControl
              value={presetName}
              placeholder="Nombre"
              onChange={(e) => setPresetName(e.target.value)}
              aria-describedby="basic-addon2"
            />
            <InputGroup.Append>
              <Button color="green" onClick={_handleSetPreset} disabled={presetName.length <= 0}>
                Agregar
              </Button>
            </InputGroup.Append>
          </InputGroup>
          <hr />

          {presets && presets.length > 0 ? (
            presets.map((p) => (
              <InputGroup key={p['$'].token} style={styles.content}>
                <FormControl
                  value={p.Name}
                  onChange={(e) => setPresetName(e.target.value)}
                  aria-describedby="basic-addon2"
                  disabled={true}
                />
                <InputGroup.Append>
                  <Button
                    color="blue"
                    icon="location arrow"
                    disabled={loadingMove.length > 0}
                    loading={loadingMove.includes(p['$'].token)}
                    onClick={() => _handleGoToPreset(p['$'].token)}
                  />
                  <Button color="red" icon="trash" onClick={() => _handleRemovePreset(p['$'].token)} />
                </InputGroup.Append>
              </InputGroup>
            ))
          ) : (
            <p>No hay presets configurados para esta cámara.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ControlPresetsPTZ;

const styles = {
  content: { marginBottom: 3 }
};
