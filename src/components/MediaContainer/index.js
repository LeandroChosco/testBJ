import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import { Modal } from 'react-bootstrap';
import { MODE, SAILS_ACCESS_TOKEN } from '../../constants/token'
import Spinner from 'react-bootstrap/Spinner';
import ReactPlayer from 'react-player';
import axios from 'axios';
import constants from '../../constants/constants';
import { urlHttpOrHttpsMultimedia } from '../../functions/urlHttpOrHttps';
import noDisponible from '../../assets/images/noDisponible.png';
import noHistoric from '../../assets/images/noHistoric.png';



class MediaContainer extends Component {
  state = { modal: false, loading: false };

  render() {
    let { modal, loading } = this.state;
    let { isQnap, dns_ip, src, exists_image, exists_video, real_hour, covid, value, port, dnsContainer, isRecord, noButtons, typeMBOX, cam, lightTwo, coverImage, historyServerDns, historyServerPort, historyServerProtocol, exists_image_historic, servidorMultimedia } = this.props;
    let dnsIp = ""
    let portCam = ""

    let poster = !exists_image_historic && src === "images/no_video.jpg" ? noHistoric : coverImage !== "images/no_imagen.jpg" ? coverImage ? urlHttpOrHttpsMultimedia(historyServerDns, historyServerPort, coverImage, historyServerProtocol) : noDisponible : noDisponible;
    // let poster = value.relative_path_image === "images/no_imagen.jpg" ? noDisponible : value.relative_path_image === "images/no_video.jpg" ? noHistoric : (servidorMultimedia + "/" + value.relative_path_image);


    let protocol = null;
    if (dnsContainer) {
      dnsIp = dnsContainer
    } else {
      dnsIp = "0.0.0.0"
    }

    if (port) {
      portCam = port
    } else {
      portCam = "3000"
    }

    if (cam.dataCamValue && cam.dataCamValue.protocolhistory) {
      protocol = cam.dataCamValue.protocolhistory;
    }

    if (cam.protocolhistory && !cam.dataCamValue) {
      protocol = cam.protocolhistory;
    }

    return (
      <div className={!covid ? 'mediaContainer col-6 p10' : 'col-3 p-3'}>
        <Card onClick={src !== 'images/no_video.jpg' ? () => this.setState({ modal: true }) : null}>
          {exists_video && (
            <ReactPlayer
              url={
                isQnap ? (`${src}&open=normal`)
                  : typeMBOX === 'light' && isRecord === false && lightTwo ? (`${protocol}://${dnsIp}/${src}`)
                    : typeMBOX === 'light' && isRecord === false && lightTwo === false ? (`${src}`)
                      : typeMBOX === 'light' && isRecord === true ? urlHttpOrHttpsMultimedia(dnsIp, portCam, src, protocol) : urlHttpOrHttpsMultimedia(dnsIp, portCam, src, protocol)
              }
              style={{ backgroundColor: '#000' }}
              width="100%"
              height="120px"
              config={{
                file: {
                  attributes: {
                    poster: poster,
                  }
                }
              }}
            />
          )}
          {exists_image && (
            <img
              src={
                covid ? (`${constants.sails_url}/${value.path}/${value.name}`)
                  : urlHttpOrHttpsMultimedia(dnsIp, portCam, src, protocol)
              }
              style={{ width: '100%' }}
              alt="img"
            />
          )}
          {real_hour ? real_hour : null}
        </Card>

        {/* Modal */}
        <Modal show={modal} onHide={() => src !== 'images/no_video.jpg' ? this.setState({ modal: false }) : null}>
          <Modal.Header closeButton style={{ background: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "var(--dark-mode-color)" : "white" }}>{
            loading ? (
              <div>
                <Button variant="primary" disabled>
                  <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />
                  Descargando...
                </Button>
              </div>
            ) : noButtons ? null : (
              <div>
                <Button style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "#b3b3b3" : "#666666" }} basic onClick={this._saveFile}><i className="fa fa-download" style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "#b3b3b3" : "#666666" }} /> <p style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "#b3b3b3" : "#666666" }}>Descargar</p></Button>
                {!covid && !dns_ip && !isQnap && (
                  <Button basic negative onClick={this._deleteFile}><i className="fa fa-trash" /> <p style={{color: "red"}}>Eliminar</p></Button>
                )}
              </div>
            )
          }</Modal.Header>
          <Modal.Body closeButton style={{ background: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "var(--dark-mode-color)" : "white" }}>
            {exists_video && (
              <ReactPlayer
                url={
                  isQnap ? (`${src}&open=normal`)
                    : typeMBOX === 'light' && isRecord === false && lightTwo ? (`${protocol}://${dnsIp}/${src}`)
                      : typeMBOX === 'light' && isRecord === false && lightTwo === false ? (`${src}`)
                        : typeMBOX === 'light' && isRecord === true ? urlHttpOrHttpsMultimedia(dnsIp, portCam, src, protocol) : urlHttpOrHttpsMultimedia(dnsIp, portCam, src, protocol)
                }
                playing={true}
                controls={true}
                style={{ backgroundColor: '#000' }}
                config={{ file: { attributes: { controlsList: 'nodownload' } } }}
                width="100%"
              />
            )}
            {exists_image ? (
              <img
                id="imagecontainerfrommedia"
                src={
                  covid ? (`${constants.sails_url}/${value.path}/${value.name}`)
                    : urlHttpOrHttpsMultimedia(dnsIp, portCam, src, protocol)
                }
                style={{ width: '100%' }}
                crossOrigin={!isQnap}
                alt="img"
              />
            ) : null}
          </Modal.Body>
        </Modal>
      </div>
    );
  }

  _saveFile = async () => {
    this.setState({ loading: true });
    let { isQnap, src, exists_image, exists_video, covid, value, apiStorageKey, awsApiStreamsCams, port, dnsContainer, cam } = this.props;

    let dnsIp = ""
    let portCam = ""
    let protocol = null;

    if (dnsContainer) {
      dnsIp = dnsContainer
    } else {
      dnsIp = "0.0.0.0"
    }

    if (port) {
      portCam = port
    } else {
      portCam = "3000"
    }

    if (cam.dataCamValue && cam.dataCamValue.protocolhistory) {
      protocol = cam.dataCamValue.protocolhistory;
    }

    if (cam.protocolhistory && !cam.dataCamValue) {
      protocol = cam.protocolhistory;
    }

    let response = {};
    response.file = (
      isQnap && !covid ? `${src}${exists_video ? '&open=forcedownload' : ''}`
        : covid ? `${constants.sails_url}/${value.relative_path}/${value.name}`
          : awsApiStreamsCams ? `${src}${apiStorageKey}`
            : urlHttpOrHttpsMultimedia(dnsIp, portCam, src, protocol)
    );

    if (isQnap && !covid && exists_video) {
      window.open(response.file);
    } else {
      const statusResponse = await fetch(response.file);
      if (statusResponse.status === 200) {
        window.saveAs(response.file, exists_video ? 'video.mp4' : exists_image ? 'image.jpg' : 'file');
      }
    }
    setTimeout(() => this.setState({ loading: false }), 300);
  };

  _deleteFile = async () => {
    let { cam, value, exists_video, exists_image, userIdContainer, completeCamera } = this.props;
    let SailsToken = localStorage.getItem(SAILS_ACCESS_TOKEN);
    let response = await axios.delete(`${constants.sails_url}/cams/${cam.id}/${value.id}/${userIdContainer || 1}/V2`, {
      headers: {
        'Authorization': SailsToken
      }
    });
    if (response.data && response.data.success) {
      this.setState({ modal: false, display: 'none' });
      this.props.reloadData(completeCamera, false, exists_video, false, exists_image);
    } else {
      alert(`Error al eliminar ${exists_image ? `imagen` : `video`}`);
    }
  };
}

export default MediaContainer;