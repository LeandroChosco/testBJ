import React, { Component } from 'react';
import { Card, Icon, Button, Input, Dropdown, Tab } from 'semantic-ui-react';
import ReactPlayer from 'react-player';
import moment from 'moment';

import './style.css';
import firebase from '../../constants/configSOS';
import MapContainer from '../../components/MapContainer';
import { EVENT_COLLECTION } from '../../Api/sos';
import CameraStream from '../../components/CameraStream'
const refSOS = firebase.app('sos').firestore().collection(EVENT_COLLECTION);
const SEARCH_OPTIONS = [
  {
    key: 'calle',
    text: 'Calle',
    value: 'calle'
  }
];

class Microfonos extends Component {
  state = {
    actIdx: -1,
    complaints: [],
    complaintId: undefined,
    filter: { active: false, search: '' },
    optionSelected: SEARCH_OPTIONS[0].value,
    loading: false,
    camData: undefined,
    countShoot: null,
    countBrokenGlass: null,
    validatorAnalytics: false
  };

  // React Lifecycle Methods
  componentDidMount() {
    const { complaints, match } = this.props;
    let complaintId = match.params.complaintId;
    if (complaints) this.setState({ complaints, complaintId });
  }
  componentDidUpdate(prevProps) {
    const { complaints: complaintsPrev } = prevProps;
    const { complaints, match } = this.props;
    let complaintId = match.params.complaintId;
    if (complaints !== complaintsPrev) {
      this.setState({ complaints });
      if (complaintId) {
        const complaint = complaints.find((d) => d.id === complaintId);
        const actIdx = complaints.findIndex((d) => d.id === complaintId);
        this._changeComplaint(complaint, actIdx, false);
        this._changeUserCam(complaint)
      }
    }
  }
  componentWillUnmount() {
    this.setState({
      actIdx: 0,
      complaints: [],
      complaintId: undefined,
      filter: { active: false, search: '' },
      optionSelected: SEARCH_OPTIONS[0].value,
      loading: false
    });
  }

  render() {
    const { complaints, actIdx, loading, camData } = this.state;
    console.log('ACTIVE INDEX ', actIdx,' COMPLAINT ', complaints)
    return (
      <div className={'show-matches app-container'}>
        <div className="row fullHeight">
          <div className="col-4 listContainer">
            <Tab
              menu={{ pointing: true }}
              panes={[
                {
                  menuItem: 'Eventos',
                  render: () => (
                    <Tab.Pane attached={false} style={styles.tab}>
                      {this._renderListComplaints()}
                    </Tab.Pane>
                  )
                }
                
              ]}
              defaultActiveIndex={0}
              onTabChange={() => { }}
              onClick={()=>this._validatorAnalisis}
            />
          </div>
          <div className="col-8">
            <div className="mainContainer">
              {!loading && complaints && complaints[actIdx] ? (
                <div className="mapContainer">
                  <h2 className="titleContainer" style={styles.headerContent}>
                    Micrófono
									</h2>
                  <div className='row justify-content-center'>
                    <div className='col-3 shoot'>
                        <p className='textTitle'>Disparo</p>
                        <p className='textEvent'>Total de eventos: {this.props.countEvent[0]} </p>
                    </div>
                    <div className='col-3 brokenGlass'>
                        <p className='textTitle'>Rotura de Vidrio</p>
                        <p className='textEvent'>Total de eventos:  {this.props.countEvent[1]} </p>
                    </div>
                  </div>
                  <div className="row" style={styles.mapContent}>
                    <div className="col" style={styles.allHeight}>
                      <MapContainer
                        options={{
                          center: {
                            lat: parseFloat(complaints[actIdx].user_cam.google_cordenate.split(',')[0]),
                            lng: parseFloat(complaints[actIdx].user_cam.google_cordenate.split(',')[1])
                          },
                          zoom: 15,
                          mapTypeId: 'roadmap',
                          zoomControl: false,
                          mapTypeControl: false,
                          streetViewControl: false,
                          fullscreenControl: false,
                          openConfirm: false,
                          typeConfirm: false,
                          openSelection: false,
                          checked: ''
                        }}
                        onMapLoad={this._onMapLoad}
                      />
                    </div>
                    <div className='col camContainerChatDiv' style={{ height: '100%' }}>
                      {camData !== undefined ? (
                        <CameraStream hideTitle height='250px' propsIniciales={this.props} marker={camData} />
                      ) : (
                        <p>Sin camara asignada...</p>
                      )}
                    </div>
                  </div>
                  <div className="row" style={styles.cardContainer}>
                    <Card style={styles.allWidth}>
                      <Card.Content>
                        <div className="row" style={styles.detailContent}>
                          <div className="col">
                            <div className="row" style={styles.list}>
                              <div className="col-9" style={styles.text}>
                                <p className="big-letter">Detalles del evento</p>
                              </div>
                              {complaints[actIdx].estado_queja === 'Pendiente' && (
                                <div className="col">
                                  <Button
                                    icon
                                    size="small"
                                    labelPosition="left"
                                    style={styles.allWidth}
                                    onClick={() => this._changeStatus(complaints[actIdx], 'Atendido')}
                                  >
                                    <Icon name="checkmark" />
                                    <b>Atender</b>
                                  </Button>
                                </div>
                              )}
                            </div>
                            <hr />
                            <div>
                              <div className="row">
                                <div className="col" style={styles.text}>
                                  <b>Tipo: </b>
                                  {complaints[actIdx].nameEvent}
                                </div>
                                <div className="col" style={styles.text}>
                                  <b>Calle: </b>
                                  {complaints[actIdx].user_cam.street}
                                </div>
                              </div>
                              <div className="row">
                                <div className="col" style={styles.text}>
                                  <b>Numero de camara: </b>
                                  {complaints[actIdx].user_cam.num_cam}
                                </div>
                              </div>
                              <div className="row">
                                <div className="col" style={styles.text}>
                                  <b>Fecha de creación: </b>
                                  {moment(moment(complaints[actIdx].eventDate)).format('DD-MM-YYYY, HH:mm:ss')}
                                </div>
                                <div className="col" style={styles.text}>
                                  &nbsp;
																</div>
                              </div>
                              <br />
                            </div>
                          </div>
                        </div>
                      </Card.Content>
                    </Card>
                  </div>
                </div>
              ) : null
                // loading === true ? (
                // 	'Cargando...'
                // ) : (
                // 	'No se ha seleccionado ninguna solicitud de servicio'
                // )
              }
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -- Funciones --
  _renderListComplaints = () => {
    let { actIdx, complaints } = this.state;
    return (
      <div>
        <div style={styles.listFilter}>
          <Input
            placeholder="Buscar evento"
            style={styles.flex2}
            onChange={this._onChange}
          />
          <Dropdown
            placeholder="Buscar por"
            fluid
            selection
            options={SEARCH_OPTIONS}
            defaultValue={SEARCH_OPTIONS[0].value}
            onChange={() => { }}
            style={styles.flex1}
          />
        </div>
        <div style={styles.listContent}>

          {complaints ? complaints.map((complaint, idx) => (
            <Card
              className={idx === actIdx ? 'activeComplaint' : ''}
              style={styles.allWidth}
              key={idx}
              onClick={() => this._changeComplaint(complaint, idx)}
            >
              <Card.Content>
                <div style={styles.relative}>
                  <div style={styles.list}>
                    <h4>
                      {complaint.user_cam?  "Cámara " + complaint.user_cam.num_cam: "ID CÁMARA NO DISPONIBLE"}
                    </h4>
                    <p>{moment(moment(complaint.fecha_creacion)).format('DD-MM-YYYY, HH:mm:ss')}</p>
                  </div>
                  <div style={styles.list}>
                    {complaint.read ? <b>&nbsp;</b> : <b style={styles.newCard}>Nuevo</b>}
                    <small>
                      <Icon
                        name={complaint.estado_queja === 'Pendiente' ? 'clock' : 'checkmark'}
                      />
                      <b>{complaint.estado_queja === 'Pendiente' ? 'No Atendido' : 'Atentido'}</b>
                    </small>
                  </div>
                </div>
              </Card.Content>
            </Card>
          )): null}
        </div>
      </div>
    );
  };
  _changeUserCam = (chat) => {
    if (Object.keys(chat.user_cam).length !== 0) {
      const { user_cam } = chat;
      this.setState({
        camData: {
          extraData: {
            num_cam: user_cam.num_cam,
            cameraID: user_cam.num_cam,
            isHls: true,
            url:
              "http://" +
              user_cam.UrlStreamMediaServer.ip_url_ms +
              ":" +
              user_cam.UrlStreamMediaServer.output_port +
              user_cam.UrlStreamMediaServer.name +
              user_cam.channel,
            dataCamValue: user_cam,
          },
        },
      });
    } else {
      this.setState({
        camData: undefined,
      });
    }
  };

  _onChange = (event) => {
    const { target: { value } } = event;
    let { optionSelected } = this.state;
    let filter = { active: false, search: '' };
    if (value !== '') filter = { active: true, search: value.trim() };

    let searchComplaints = this.props.complaints;
    if (filter.active) {
      let expresion = new RegExp(`${filter.search}.*`, 'i');
      switch (optionSelected) {
        case 'calle':
          searchComplaints = searchComplaints.filter((c) => expresion.test(c.report_detail.lug_calle));
          break;
        default:
          searchComplaints = this.props.complaints;
      }
    }
    this.setState({ complaints: searchComplaints, filter });
  };
  _onMapLoad = (map) => {
    const { complaints, actIdx } = this.state;
    const coords = {
      lat: parseFloat(complaints[actIdx].user_cam.google_cordenate.split(',')[0]),
      lng: parseFloat(complaints[actIdx].user_cam.google_cordenate.split(',')[1])
    };
    this.setState({ map: map });
    new window.google.maps.Marker({
      position: coords,
      map: map,
      title: complaints[actIdx].user_nicename
    });
  };
  _getDescription = (description) => {
    let reverseDescription = [...String(description)].reverse().join('');
    let firstIndex = reverseDescription.indexOf('/');
    let getSecondblock = reverseDescription.substr(firstIndex + 1, reverseDescription.length - 1);
    let secondIndex = getSecondblock.indexOf('/');
    let printDescription = getSecondblock.substr(secondIndex + 1, reverseDescription.length - 1);
    let reinvestDescription = [...String(printDescription)].reverse().join('');
    return reinvestDescription;
  };
  _changeComplaint = (complaint, actIdx, flag = true) => {
    //console.log('ACTIVE INDEX ', actIdx,' COMPLAINT ', complaint)
    if (flag) this.props.history.push(`/Microfonos/${complaint.id}`);
    if (complaint === undefined && actIdx === -1) {
      this.props.history.push('/Microfonos');
    } else {
      this.setState({ loading: true }, async () => {
       
        if (!complaint.read) {
          await this._updateComplaint(complaint.id, { read: true });
        }
        
        this.setState({ actIdx, loading: false });
        if(complaint){
          this._changeUserCam(complaint)
        }
      });
    }
  };
  _changeStatus = (complaint, status) => {
    this.setState({ loading: true }, async () => {
      await this._updateComplaint(complaint.id, { estado_queja: status });
      this.setState({ loading: false });
    });
  };
  _updateComplaint = async (id, params) => {
    try {
      let updComplaint = refSOS.doc(id).update(params);
      const data = await updComplaint.get();
      return {
        error: false,
        data: data,
        message: 'Se ha modificado la solicitud de servicios'
      };
    } catch (error) {
      return {
        error: true,
        message: error
      };
    }
  };
}

export default Microfonos;

const styles = {
  tab: {
    backgroundColor: '#dadada',
    borderWidth: 0,
    borderColor: '#dadada'
  },
  headerContent: {
    height: '30px',
    color: '#fff',
    textAlign: 'center',
    backgroundColor: '#17a2b8',
    borderColor: '#17a2b8'
  },
  mapContent: {
    height: '33vh',
    margin: 0
  },
  allHeight: {
    height: '100%'
  },
  fileContainer: {
    width: '100%',
    height: '100%',
    display: 'flex'
  },
  divCenter: {
    display: 'flex',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center'
  },
  file: {
    height: '30vh',
    width: '100%'
  },
  cardContainer: {
    margin: 0,
    width: '100%',
    height: '54vh',
    marginTop: '5px'
  },
  detailContent: {
    padding: '10px'
  },
  allWidth: {
    width: '100%'
  },
  title: {
    fontSize: 14
  },
  text: {
    fontSize: 13
  },
  listFilter: {
    display: 'flex',
    flexDirection: 'row'
  },
  flex2: {
    flex: 2
  },
  flex1: {
    flex: 1
  },
  listContent: {
    height: '81vh',
    padding: '20px',
    overflow: 'scroll',
    backgroundColor: '#dadada'
  },
  relative: {
    position: 'relative'
  },
  list: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  newCard: {
    fontSize: 8,
    color: 'white',
    padding: '5px',
    borderRadius: '10px',
    backgroundColor: 'red'
  }
};
