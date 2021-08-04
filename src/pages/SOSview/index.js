import React, { Component } from 'react';
import { Card, Icon, Button, Input, Dropdown, Tab } from 'semantic-ui-react';
import FadeLoader from 'react-spinners/FadeLoader';
import firebase from 'firebase';
import moment from 'moment';
import _ from 'lodash';
import './style.css';

import connections from '../../conections';
import Strings from '../../constants/strings';
import firebaseSos from '../../constants/configSOS';
import { getTracking, MESSAGES_COLLECTION, SOS_COLLECTION, POLICE_COLLECTION } from '../../Api/sos';

// COMPONENTS
import MapPolice from '../../components/MapPolice';
import MapContainer from '../../components/MapContainer';
// import CloseIncident from '../../components/CloseIncident';
import CustomizedSnackbars from '../../components/Snack/index';

const refSOS = firebaseSos.app('sos').firestore().collection(MESSAGES_COLLECTION);
const refTracking = firebaseSos.app('sos').firestore().collection(SOS_COLLECTION);
const refPolice = firebaseSos.app('sos').firestore().collection(POLICE_COLLECTION);

const COLORS = {
  Seguridad: '#FFB887',
  'Protección Civil': '#E29EE8',
  'Emergencia Médica': '#9EE8A7',
  'Proteccion Policial': '#FFB887',
  'Seguimiento Por Hora': '#00B4C0',
  'Seguimiento Por Destino': '#00D2A6'
};

const SEARCHOPTIONS = [
  { key: 'name', text: 'Nombre de Usuario', value: 'name' },
  { key: 'date', text: 'Fecha', value: 'date' }
];
const CRITICAL_COLORS = {
  init: { map_marker: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' },
  1: {
    name: 'Sin incidencias',
    color: 'rgba(76,187,23,0.5)',
    boxShadow: '0 0 10px 0 rgb(76,187,23), 0 5px 10px 0 rgba(76,187,23,0.3)',
    map_marker: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
  },
  2: {
    name: 'Problemas',
    color: 'rgb(255,218,94)',
    boxShadow: '0 0 10px 0 rgb(255,218,94), 0 5px 10px 0 rgba(255,218,94,0.3)',
    map_marker: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
  },
  3: {
    name: 'Crítico',
    color: 'rgba(255,0,0,0.5)',
    boxShadow: '0 0 10px 0 rgb(255,0,0), 0 5px 10px 0 rgba(255,0,0,0.3)',
    map_marker: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
  }
};

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      chats: [],
      activeIndex: 0,
      chatId: '',
      text: '',
      from: '',
      fisrt: {},
      searching: '',
      tracking: {},
      camData: undefined,
      loading: false,
      hashUsed: false,
      personalInformation: {},
      optionSelected: 'name',
      marker: null,
      firebaseSub: null,
      timePolice: null,
      policeMarker: null,
      policePolyline: null,
      policePointCoords: null,
      firebaseSubPolice: null,
      destinationMarker: null,
      flagUpdate: 0,
      open_snack: false,
      snack_message: {},
      mapPolice: { show: false, incident: null, tracking: null },
      // showReport: false
    };
  }
  panes = this.props.history.location.pathname.includes('sos')
    ? [
        {
          menuItem: 'Seguridad',
          render: () => <Tab.Pane attached={false} style={styles.tab}>{this.renderListChats('Seguridad')}</Tab.Pane>
        },
        {
          menuItem: 'Protección Civil',
          render: () => <Tab.Pane attached={false} style={styles.tab}>{this.renderListChats('Protección Civil')}</Tab.Pane>
        },
        {
          menuItem: 'Emergencia Médica',
          render: () => <Tab.Pane attached={false} style={styles.tab}>{this.renderListChats('Emergencia Médica')}</Tab.Pane>
        }
      ]
    : [
        {
          menuItem: 'Por Hora',
          render: () => <Tab.Pane attached={false} style={styles.tab}>{this.renderListChats('Seguimiento Por Hora')}</Tab.Pane>
        },
        {
          menuItem: 'Por Seguimiento',
          render: () => <Tab.Pane attached={false} style={styles.tab}>{this.renderListChats('Seguimiento Por Destino')}</Tab.Pane>
        }
      ];
  FILTERSOPTIONS = this.props.history.location.pathname.includes('sos')
    ? [ 'Seguridad', 'Protección Civil', 'Emergencia Médica' ]
    : [ 'Seguimiento Por Hora', 'Seguimiento Por Destino' ];

  // LIFECYCLES
  componentDidMount() {
    const { tabIndex } = this.props.match.params;
    let { activeIndex } = this.state;
    let { chats } = this.props;
    let filtered = [];

    if (chats) {
      if (tabIndex) filtered = chats.filter((item) => item.trackingType === this.FILTERSOPTIONS[tabIndex]);
      else filtered = chats.filter((item) => item.trackingType === this.FILTERSOPTIONS[activeIndex]);
      this.setState({ chats: filtered, activeIndex: tabIndex ? tabIndex : activeIndex });
    }
    let messageBody = document.querySelector('#messagesContainer');
    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
  }
  componentDidUpdate(prevProps) {
    const { /*flagUpdate,*/ activeIndex } = this.state;
    const { tabIndex, chatId } = this.props.match.params;
    const { chats: chatsPrev } = prevProps;
    const { chats } = this.props;

    // if (flagUpdate === 0) {
    if (chats && chatsPrev && !_.isEqual(_.sortBy(chats), _.sortBy(chatsPrev))) {
      if (chatsPrev.length !== chats.length) this.setState({ chats });
      const nameType = this.FILTERSOPTIONS[Number(tabIndex ? tabIndex : activeIndex)];
      const filteredChats = chats.filter((e) => e.trackingType === nameType);
      this.setState({ chats: filteredChats, flagUpdate: 1 });
      if (chatId) {
        const idxChat = filteredChats.findIndex((e) => e.id === chatId);
        this.changeChat(filteredChats[idxChat], idxChat, false);
      }
    }
    // }
    let messageBody = document.querySelector('#messagesContainer');
    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
  }

  render() {
    const { tabIndex } = this.props.match.params;
    const { chats, chatId, index, from, loading, tracking, mapPolice/*, showReport*/ } = this.state;
    if (index !== undefined && chatId === '' && chats.length > 0) this.setState({ chatId: null });

    const chatSelected = chats.find((item) => item.id === chatId);
    let textareaDisabled = null;
    if (chatSelected) {
      if (typeof chatSelected.active === 'undefined') textareaDisabled = false;
      else {
        if (chatSelected.active === 0) textareaDisabled = true;
        else textareaDisabled = false;
      }
    }
    return (
      <div className={!this.props.showMatches ? 'hide-matches app-container' : 'show-matches app-container'}>
        <div className='row fullHeight'>
          <div className='col-4 userList'>
            <Tab
              menu={{ pointing: true }}
              panes={this.panes}
              defaultActiveIndex={Number(tabIndex) || 0}
              onTabChange={(t, i) => {
                const { chats } = this.props;
                const { index } = this.state;
                let newChats = chats.filter((c) => c.trackingType === this.FILTERSOPTIONS[i.activeIndex]);
                let selected = null;
                if (index !== undefined) {
                  if (newChats.length !== 0 && newChats[index]) {
                    selected = newChats[index].trackingType;
                    if (typeof newChats[index].panic_button_uuid === 'string' && selected === 'Seguridad') {
                      selected += ' botón físico';
                    } else {
                      if (selected === 'Seguridad') {
                        selected += ' botón virtual';
                      }
                    }
                  } else {
                    selected = newChats.length > 0 ? newChats[0].trackingType : null;
                  }
                  // let selected = newChats.length !== 0 && newChats[index] ? newChats[index].trackingType : newChats[0].trackingType;
                  this.setState({ from: selected ? selected : 'Error getting data' });
                }
                this.setState({ chats: newChats, activeIndex: i.activeIndex, index: null });
              }}
            />
          </div>
          <div className='col-8'>
            <div className='messages' style={{ height: '88%' }}>
              {!loading && chatId !== '' && chats[index] ? (
                <div className='cameraView'>
                  <h2
                    className={'Chat C5'}
                    style={{
                      textAlign: 'center',
                      backgroundColor: COLORS[chats[index].trackingType],
                      height: '30px'
                    }}
                  >
                    {from}
                  </h2>
                  <div className='row' style={{ height: '70%', margin: 0 }}>
                    <div className='col' style={{ height: '100%' }}>
                      {Object.keys(tracking).length !== 0 &&
                      tracking.pointCoords && (
                        <MapContainer
                          options={{
                            center: {
                              lat: parseFloat(tracking.pointCoords[tracking.pointCoords.length - 1].latitude),
                              lng: parseFloat(tracking.pointCoords[tracking.pointCoords.length - 1].longitude)
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
                          coordsPath={tracking.pointCoords}
                          onMapLoad={this._onMapLoad}
                        />
                      )}
                    </div>
                  </div>

                  <div className='row' style={{ height: '20%', width: '100%', margin: 0, marginTop: '5px' }}>
                    <Card style={{ width: '100%' }}>
                      <Card.Content>
                        <div className='row'>
                          <div className='col-9'>
                            <div className='row'>
                              <div className='col-6' style={styles.text}>
                                <b>Nombre: </b>
                                {chats[index].user_name}
                              </div>
                              <div className='col' style={styles.text}>
                                <b>Celular: </b>
                                {this.state.personalInformation.Contact.phone}
                              </div>
                            </div>
                            {tracking && tracking.place && (
                              <div className='row'>
                                <div className='col-6' style={styles.text}>
                                  <b>Destino: </b>
                                  {tracking.place.address}
                                </div>
                                <div className='col' style={styles.text}>
                                  <b>Lugar: </b>
                                  {tracking.place.name}
                                </div>
                                <div className='col' style={styles.text}>
                                  <b>Modo: </b>
                                  {tracking.place.mode}
                                </div>
                              </div>
                            )}
                            <div className='row'>
                              {chats[index].police_name && (
                                <div className='col' style={styles.text}>
                                  <b>Policia: </b>
                                  {chats[index].police_name}
                                </div>
                              )}
                              {this.state.timePolice !== null && (
                                <div className='col' style={styles.text}>
                                  <b>Tiempo estimado de llegada de policia: </b>
                                  {this.state.timePolice}
                                </div>
                              )}
                            </div>
                          </div>
                          {chats[index].active ? (
                            <div className='col'>
                              <div className='row'>
                                <Button
                                  icon
                                  size='small'
                                  color='red'
                                  labelPosition='left'
                                  style={styles.buttonMargin}
                                  disabled={chats[index].policeId}
                                  onClick={() => this._handlePoliceState(true, chats[index], tracking)}
                                >
                                  <Icon inverted name='taxi' />
                                  Mandar unidad
                                </Button>
                              </div>
                              {/* <div className='row' style={styles.text}>
                                Desactivar:
                              </div> */}
                              <div className='row'>
                                {/* <Button.Group>
                                  <Button
                                    icon
                                    size='small'
                                    color='yellow'
                                    labelPosition='left'
                                    style={styles.buttonMargin}
                                    onClick={() => this.setState({ showReport: true })}
                                  >
                                    <Icon inverted name='file alternate' />
                                    Con Rep
                                  </Button>
                                  <Button.Or /> */}
                                  <Button
                                    icon
                                    size='small'
                                    color='yellow'
                                    labelPosition='left'
                                    style={styles.buttonMargin}
                                    onClick={() =>
                                      this.deactivateTracking(
                                        chats[index].id,
                                        chats[index].trackingId,
                                        chats[index].trackingType.includes('Seguimiento')
                                      )}
                                  >
                                    {/* <Icon inverted name='file excel' /> */}
                                    <Icon inverted name='close' />
                                    Desactivar{/* Sin Rep */}
                                  </Button>
                                {/* </Button.Group> */}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </Card.Content>
                    </Card>
                  </div>
                </div>
              ) : null}
            </div>
            <div className='messagesContainer' id='messagesContainer'>
              {!loading && chatId !== '' && chats[index] ? chats[index].messages ? (
                this.state.messages.map((value, ref) => (
                  <div
                    key={ref}
                    className={
                      value.from === 'user' ? (
                        'user'
                      ) : value.from === 'Policia' ? (
                        'policia'
                      ) : value.from === 'Sistema' ? (
                        'sistema'
                      ) : (
                        'support'
                      )
                    }
                    ref={ref === chats[index].messages.length - 1 ? 'message' : 'message' + ref}
                    id={ref === chats[index].messages.length - 1 ? 'lastMessage' : 'message' + ref}
                  >
                    <p>
                      {this.renderNameChat(chats[index], value)}
                      {value.msg}
                      <br />
                      <small style={{ display: 'flex', justifyContent: 'right' }}>
                        {value.dateTime.toDate ? moment(value.dateTime.toDate()).format('DD-MM-YYYY, HH:mm:ss') : null}
                      </small>
                    </p>
                  </div>
                ))
              ) : loading === true ? (
                <>
                  <FadeLoader height={20} width={7} radius={20} margin={5} loading={loading} css={styles.centered} />
                  <p style={{ position: 'fixed', top: '56%', left: '62%' }}>Cargando chat</p>
                </>
              ) : (
                <p style={{ position: 'fixed', top: '50%', left: '60%' }}>No se ha seleccionado ningun chat</p>
              ) : loading === true ? (
                <>
                  <FadeLoader height={20} width={7} radius={20} margin={5} loading={loading} css={styles.centered} />
                  <p style={{ position: 'fixed', top: '56%', left: '62%' }}>Cargando chat</p>
                </>
              ) : (
                <p style={{ position: 'fixed', top: '50%', left: '60%' }}>No se ha seleccionado ningun chat</p>
              )}
            </div>
            {chatId !== '' && chats[index] ? (
              <div className='messages_send_box'>
                {!textareaDisabled ? (
                  <div style={{ position: 'relative' }}>
                    <textarea
                      disabled={textareaDisabled}
                      placeholder='Escriba su mensaje'
                      name='text'
                      autoComplete='on'
                      autoCorrect='on'
                      id='messsageTextarea'
                      value={this.state.text}
                      onKeyPress={this.checkKey}
                      onChange={(event) => {
                        this.setState({ text: event.target.value });
                      }}
                    />
                    <Icon name='send' id='sendbutton' onClick={this.sendMessage} />
                  </div>
                ) : (
                  <div className='closed-ticked'>El ticket ya se encuentra cerrado</div>
                )}
              </div>
            ) : null}
          </div>
        </div>
        {this.state.open_snack && (
          <CustomizedSnackbars
            message={this.state.snack_message}
            setOpenSnack={this.setOpenSnack}
            open={this.state.open_snack}
          />
        )}
        {mapPolice && mapPolice.show && mapPolice.incident && (
          <MapPolice
            show={mapPolice.show}
            incident={mapPolice.incident}
            tracking={mapPolice.tracking}
            _handlePoliceState={this._handlePoliceState}
          />
        )}
        {/* {showReport && (
          <CloseIncident
            show={showReport}
            incident={chats[index]}
            setShow={(state) => this.setState({ showReport: state })}
          />
        )} */}
      </div>
    );
  }

  renderNameChat = (chat, value) => {
    const { police_name, user_name } = chat;
    let name = null;
    switch (value.from) {
      case Strings.chat.base: name = 'Tú'; break;
      case Strings.chat.blindaje: name = 'Tú'; break;
      case Strings.chat.soporte: name = 'Tú'; break;
      case Strings.chat.sistem: name = Strings.chat.info; break;
      case Strings.chat.police: name = police_name; break;
      default: name = user_name;
    }

    return (
      <>
        {name}:<br />
      </>
    );
  };

  renderListChats = (type) => {
    const { index, chats, optionSelected } = this.state;
    let critical_levels = [];
    if (type.includes('Seguimiento')) {
      if (!SEARCHOPTIONS.find((item) => item.key === 'critical')) {
        SEARCHOPTIONS.push({
          key: 'critical',
          text: 'Criticidad',
          value: 'critical'
        });
      }
      Object.keys(CRITICAL_COLORS).forEach((key) => {
        critical_levels.push({ key, text: CRITICAL_COLORS[key].name, value: key });
      });
    } else {
      const index = SEARCHOPTIONS.findIndex((item) => item.key === 'critical');
      if (index > -1) {
        SEARCHOPTIONS.splice(index, 1);
        critical_levels = [];
      }
    }

    return (
      <div>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {optionSelected && optionSelected === 'critical' ? (
            <Dropdown
              placeholder='Buscar por'
              fluid
              selection
              clearable
              options={critical_levels}
              defaultValue={''}
              onChange={this.criticalLevelFilter}
              style={{ flex: 1 }}
            />
          ) : (
            <Input placeholder='Buscar alertas' style={{ flex: 2 }} onChange={this.filterAction} />
          )}
          <Dropdown
            placeholder='Buscar por'
            fluid
            selection
            options={SEARCHOPTIONS}
            defaultValue='name'
            onChange={this.handleChangeOption}
            style={{ flex: 1 }}
          />
        </div>
        <div style={{ height: '81vh', overflow: 'scroll', backgroundColor: '#dadada', padding: '20px' }}>
          {chats.map((chat, i) => {
            const critical_color =
              chat && chat.critical_state && chat.critical_state !== 0 ? CRITICAL_COLORS[chat.critical_state] : null;
            const date =
              chat && chat.create_at
                ? moment(chat.create_at).format('DD-MM-YYYY, HH:mm:ss')
                : typeof chat.lastModification === 'string'
                  ? moment(chat.lastModification).format('DD-MM-YYYY, HH:mm:ss')
                  : moment(chat.lastModification.toDate()).format('DD-MM-YYYY, HH:mm:ss');
            return (
              <Card
                className={i === index ? 'activeChat' : ''}
                style={
                  critical_color !== null && type.includes('Seguimiento ') ? (
                    { width: '100%', boxShadow: critical_color.boxShadow }
                  ) : (
                    { width: '100%' }
                  )
                }
                key={i}
                onClick={() => this.changeChat(chat, i)}
              >
                <Card.Content>
                  <div style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                      <h4>{chat.user_name}</h4> <p>{date}</p>
                    </div>
                    {chat.active !== undefined && chat.active ? (
                      <p>
                        {chat.messages ? chat.messages.length > 0 ? (
                          (chat.messages[chat.messages.length - 1].from === 'user'
                            ? chat.user_name.split(' ')[0]
                            : 'C5') +
                          ': ' +
                          chat.messages[chat.messages.length - 1].msg //msg
                        ) : (
                          'No hay mensajes que mostart'
                        ) : (
                          'No hay mensajes que mostart'
                        )}
                      </p>
                    ) : (
                      <p />
                    )}

                    {chat.c5Unread !== undefined && chat.c5Unread !== 0 ? (
                      <div className='notificationNumber' style={{ marginTop: 15 }}>
                        <p>{chat.c5Unread}</p>
                      </div>
                    ) : null}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: critical_color !== null ? 'space-between' : 'flex-end',
                        alignItems: 'center'
                      }}
                    >
                      {critical_color !== null &&
                      type.includes('Seguimiento') && (
                        <small style={{ ...styles.badge, backgroundColor: critical_color.color }}>
                          <strong>{critical_color.name}</strong>
                        </small>
                      )}
                      <div>
                        {' '}
                        <small style={{ ...styles.badge, marginLeft: 3, alignSelf: 'flex-end', display: 'flex' }}>
                          {' '}
                          <Icon name={chat.active ? 'clock' : 'checkmark'} />{' '}
                          <strong>{chat.active ? 'Proceso' : 'Cerrado'}</strong>{' '}
                        </small>
                      </div>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  filterAction = (event) => {
    const { target: { value } } = event;
    const { activeIndex } = this.state;
    const { chats: chatsProps } = this.props;
    const { optionSelected, searching } = this.state;
    this.setState({ searching: value.trim() }, () => {
      const filterData = chatsProps.filter((c) => c.trackingType === this.FILTERSOPTIONS[activeIndex]);
      let expresion = new RegExp(`${searching}.*`, 'i');
      if (searching.trim().length !== 0) {
        let newFilterSearch;
        if (optionSelected === 'alertType') {
          newFilterSearch = filterData.filter((c) => c.trackingType && expresion.test(c.trackingType));
        } else if (optionSelected === 'date') {
          newFilterSearch = filterData.filter((c) =>
            expresion.test(moment(moment(c.create_at)).format('DD-MM-YYYY, HH:mm:ss'))
          );
        } else if (optionSelected === 'name') {
          newFilterSearch = filterData.filter((c) => expresion.test(c.user_name));
        }
        this.setState({ chats: newFilterSearch });
      }
      if (value.trim().length === 0) {
        let newChats = this.props.chats.filter((c) => c.trackingType === this.FILTERSOPTIONS[this.state.activeIndex]);
        this.setState({ chats: newChats });
      }
    });
  };

  criticalLevelFilter = (e, { value }) => {
    const { activeIndex } = this.state;
    const { chats: chatsProps } = this.props;
    const filterData = chatsProps.filter((c) => c.trackingType === this.FILTERSOPTIONS[activeIndex]);
    if (value.trim() !== '') {
      let newFilterSearch = filterData.filter((data) => data.critical_state === Number(value));
      this.setState({ chats: newFilterSearch });
    } else {
      this.setState({ chats: filterData });
    }
  };

  handleChangeOption = (e, { value }) => this.setState({ optionSelected: value });

  _onMapLoad = (map) => {
    const { chats } = this.props;
    const { index, tracking, marker, policePointCoords, policeMarker, policePolyline, destinationMarker } = this.state;
    if (policeMarker) policeMarker.setMap(null);
    if (policePolyline) policePolyline.setMap(null);
    if (policePointCoords) this._setPoliceMarker(policePointCoords, map);
    if (destinationMarker) destinationMarker.setMap(null);
    if (tracking.place) this._setDestinationMarker(tracking.place, map);

    if (chats.length > 0 && chats[index].trackingType.includes('Seguimiento')) {
      if (tracking.pointCoords.length > 0) {
        const { pointCoords } = tracking;
        let _marker = null;
        pointCoords.forEach((pt, idx) => {
          const position = { lat: parseFloat(pt.latitude), lng: parseFloat(pt.longitude) };
          if ((pt.critical_state && pt.critical_state !== 0) || idx === 0) {
            new window.google.maps.Marker({
              position,
              map,
              title: chats[index].user_nicename,
              icon: CRITICAL_COLORS[idx === 0 ? 'init' : pt.critical_state].map_marker
            });
          }
        });
        this.setState({ map, marker: _marker });
      }
    } else {
      const { pointCoords } = tracking;
      const coords = {
        lat: parseFloat(pointCoords[pointCoords.length - 1].latitude),
        lng: parseFloat(pointCoords[pointCoords.length - 1].longitude)
      };

      let _marker = null;
      if (!marker) {
        _marker = new window.google.maps.Marker({
          position: coords,
          map: map,
          title: chats[index].user_nicename
        });
      } else {
        if (tracking.active) {
          _marker = Object.assign(marker, {});
          _marker.setPosition(coords);
          _marker.setMap(map);
        } else {
          _marker = new window.google.maps.Marker({
            position: coords,
            map: map,
            title: chats[index].user_nicename
          });
        }
      }
      this.setState({ map, marker: _marker });
    }
  };

  changeChat = (chat, i, flag = true) => {
    let { history, stopNotification } = this.props;
    const nameRoute = history.location.pathname.includes('/sos') ? 'sos' : 'seguimiento';
    if (this.state.timePolice) this.setState({ timePolice: null, policePointCoords: null });

    if (flag) {
      history.push(`/${nameRoute}/${this.state.activeIndex}/${chat.id}`);
    }
    if (chat === undefined && i === -1) {
      history.push(`/${nameRoute}`);
    } else {
      this.getMessages(chat.id);
      this.setState({ loading: true, camData: undefined }, async () => {
        stopNotification();
        const trackingInformation = await getTracking(chat.trackingId);

        let newData = trackingInformation.data.data();
        newData = { ...newData, id: trackingInformation.data.id };

        const aux =
          newData.SOSType && newData.SOSType === 'Seguridad'
            ? newData.panic_button_uuid !== null
              ? `${newData.SOSType} botón físico`
              : `${newData.SOSType} botón virtual`
            : newData.SOSType;

        this.setState({
          index: i,
          from: aux,
          loading: false,
          pointCoords: [],
          tracking: newData,
          personalInformation: newData.userInformation
        });

        if (chat.active) {
          const unsub = firebaseSos.app('sos').firestore().collection(SOS_COLLECTION).onSnapshot((docs) => {
            const track_changes = docs.docChanges();
            if (track_changes.length === 1) {
              const updatedChatId = track_changes[0].doc.id;
              const track_data = track_changes[0].doc.data();
              if (chat.trackingId === updatedChatId) {
                if (chat.active) {
                  this.setState({ tracking: track_data });
                }
              }
            }
          });
          this.setState({ firebaseSub: unsub });
        } else {
          if (this.state.firebaseSub) this.state.firebaseSub();
          if (this.state.firebaseSubPolice) this.state.firebaseSubPolice();
        }
        refSOS.doc(chat.id).update({ c5Unread: 0 }).then(() => {
          this.setState({ text: '' });
        });
      });
    }
  };

  getMessages = (chatId) => {
    this.messageListener = refSOS.doc(chatId).onSnapshot(async (snapShot) => {
      const chat_data = snapShot.data();
      chat_data['id'] = snapShot.id;
      const current_chat = [ ...this.state.chats ];
      const chat_index = current_chat.findIndex((item) => item.id === chatId);
      if (chat_index >= 0) current_chat[chat_index] = chat_data;
      if (this.state.firebaseSubPolice) await this.state.firebaseSubPolice();

      if (chat_data.policeId) {
        if (chat_data.active) {
          let subPolice = refPolice.doc(chat_data.policeId).onSnapshot((snapPolice) => {
            const { time, pointCoords } = snapPolice.data();
            const { policeMarker, policePolyline, map } = this.state;
  
            if (policeMarker) policeMarker.setMap(null);
            if (policePolyline) policePolyline.setMap(null);
            if (map) this._setPoliceMarker(pointCoords, map);
            this.setState({ timePolice: time, policePointCoords: pointCoords });
          });
          this.setState({ firebaseSubPolice: subPolice });
        } else {
          refPolice.doc(chat_data.policeId).get().then((snapPolice) => {
            const { pointCoords } = snapPolice.data();
            const { policeMarker, policePolyline, map } = this.state;

            if (policeMarker) policeMarker.setMap(null);
            if (policePolyline) policePolyline.setMap(null);
            if (map) this._setPoliceMarker(pointCoords, map);
            this.setState({ policePointCoords: pointCoords });
          });
        }
      }
      if (chat_data.trackingId) {
        refTracking.doc(chat_data.trackingId).get().then((snapTracking) => {
          const { place } = snapTracking.data();
          const { destinationMarker, map } = this.state;

          if (destinationMarker) destinationMarker.setMap(null);
          if (map && place) this._setDestinationMarker(place, map);
        });
      }
      this.setState({ messages: snapShot.get('messages'), chatId, chats: current_chat });
    });
  };

  checkKey = (event) => {
    let key = window.event.keyCode;
    if (key === 13) {
      this.sendMessage();
      return false;
    } else {
      return true;
    }
  };

  sendMessage = () => {
    if (this.state.text === '') return;
    const { chatId, messages } = this.state;

    let messagesAux = messages.map((e) => e);

    messagesAux.push({
      from: 'support',
      dateTime: new Date(),
      msg: this.state.text
    });

    this.props.stopNotification();

    refSOS
      .doc(chatId)
      .update({
        messages: messagesAux,
        from: 'Chat C5',
        userUnread: this.props.chats[this.state.index].userUnread
          ? this.props.chats[this.state.index].userUnread + 1
          : 1,
        policeUnread: this.props.chats[this.state.index].policeUnread
          ? this.props.chats[this.state.index].policeUnread + 1
          : 1
      })
      .then(() => {
        this.setState({ text: '' });
      });
  };

  QueryStringToJSON(query) {
    query = query.replace('?', '');
    let pairs = query.split('&');

    let result = {};
    pairs.forEach(function(pair) {
      pair = pair.split('=');
      result[pair[0]] = decodeURIComponent(pair[1] || '');
    });

    return JSON.parse(JSON.stringify(result));
  }

  deactivateTracking(chatId, trackingId, tracking_module) {
    const { profileId, alertId, pointCoords, initialLocation } = this.state.tracking;
    let params = { alertId, profileId, tracking_module };
    if (pointCoords && pointCoords.length > 0) {
      const aux_array = [ ...pointCoords ];
      const { latitude, longitude } = aux_array.pop();
      params = {
        ...params,
        latitude: String(latitude),
        longitude: String(longitude)
      };
    } else {
      const { latitude, longitude } = initialLocation;
      params = {
        ...params,
        latitude: String(latitude),
        longitude: String(longitude)
      };
    }
    connections
      .cancelRadarAlert(params)
      .then(() => {
        refTracking
          .doc(trackingId)
          .update({
            active: false
          })
          .then(() => {
            refSOS
              .doc(chatId)
              .update({
                active: 0,
                messages: firebase.firestore.FieldValue.arrayUnion({
                  dateTime: new Date(),
                  from: Strings.chat.sistem,
                  msg: 'Se ha desactivado tu alerta.'
                })
              })
              .then(() => {
                this.setState({
                  snack_message: {
                    message: 'Alerta desactivada correctamente',
                    severity: 'success'
                  },
                  open_snack: true
                });
              })
              .catch((e) => console.log(e));
          })
          .catch((e) => console.log(e));
      })
      .catch(() => {
        refTracking
          .doc(trackingId)
          .update({ active: false })
          .then(() => {
            refSOS
              .doc(chatId)
              .update({ active: 0 })
              .then(() => {
                this.setState({
                  snack_message: {
                    message: 'Alerta desactivada correctamente',
                    severity: 'success'
                  },
                  open_snack: true
                });
              })
              .catch((e) => console.log(e));
          })
          .catch((e) => console.log(e));
      });
  }

  setOpenSnack = (state) => {
    if (state) {
      this.setState({ open_snack: state });
    } else {
      this.setState({ open_snack: state, snack_message: {} });
    }
  };

  _handlePoliceState = (show = false, incident = null, tracking = null) => {
    this.setState({ mapPolice: { show, incident, tracking } });
  };

  _setPoliceMarker = (coords, map) => {
    const path = coords.map((c) => ({ lat: c.latitude, lng: c.longitude }));
    const position = [ ...path ].pop();
    const newMarker = new window.google.maps.Marker({
      position,
      map,
      icon: { url: 'http://maps.google.com/mapfiles/ms/icons/police.png' },
      title: 'police'
    });
    this.setState({ policeMarker: newMarker });

    const newPolyline = new window.google.maps.Polyline({
      path,
      map,
      geodesic: true,
      strokeColor: "#186dad",
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
    this.setState({ policePolyline: newPolyline });
  };

  _setDestinationMarker = (place, map) => {
    const { name, location: { latitude, longitude } } = place;
    const newMarker = new window.google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      icon: { url: 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png' },
      map: map,
      title: name
    });
    this.setState({ destinationMarker: newMarker });
  };
}

export default Chat;

const styles = {
  badge: {
    paddingLeft: 3,
    paddingRight: 3,
    borderRadius: 3,
    fontSize: 10,
    paddingTop: 2,
    paddingBottom: 2
  },
  tab: {
    backgroundColor: '#dadada',
    borderWidth: 0,
    borderColor: '#dadada'
  },
  centered: {
    left: '51%'
  },
  text: {
    fontSize: 13
  },
  buttonMargin: {
    margin: '2px 0px'
  }
};
