import React, { Component } from 'react';
import { Card, Icon, Button, Input, Dropdown, Tab } from 'semantic-ui-react';
import FadeLoader from 'react-spinners/FadeLoader';
import firebase from 'firebase';
import moment from 'moment';
import _ from 'lodash';
import './style.css';

import Strings from '../../constants/strings';
import firebaseSos from '../../constants/configSOS';
import firebaseC5Benito from '../../constants/configC5CJ';

// COMPONENTS
import MapPolice from '../../components/MapPolice';
import MapContainer from '../../components/MapContainer';
import CameraStream from '../../components/CameraStream';
// import CloseIncident from '../../components/CloseIncident';
import CustomizedSnackbars from '../../components/Snack/index';

import { POLICE_COLLECTION } from '../../Api/sos';

import police_blue from '../../assets/images/icons/maps/police_blue.png';

const refSOS = firebaseC5Benito.app('c5benito').firestore().collection('messages');
const refPolice = firebaseSos.app('sos').firestore().collection(POLICE_COLLECTION);

const COLORS = {
  c5: 'ffaa20',
  Fuego: '#cd0a0a',
  Policia: '#0f4c75',
  Médico: '#28df99'
};

const SEARCHOPTIONS = [
  { key: 'name', text: 'Nombre de Usuario', value: 'name' },
  { key: 'date', text: 'Fecha', value: 'date' }
];

class ChatAlarm extends Component {
  state = {
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
    tabIndex: 0,
    flagUpdate: 0,
    open_snack: false,
    snack_message: {},
    mapPolice: { show: false, incident: null, tracking: null },
    // showReport: false
  };
  panes = this.props.history.location.pathname.includes('chat')
    ? [
        {
          menuItem: 'C5',
          render: () => <Tab.Pane attached={false} style={styles.tab}>{this.renderListChats('C5')}</Tab.Pane>
        }
      ]
    : [
        {
          menuItem: 'Policia',
          render: () => <Tab.Pane attached={false} style={styles.tab}>{this.renderListChats('Policia')}</Tab.Pane>
        },
        {
          menuItem: 'Fuego',
          render: () => <Tab.Pane attached={false} style={styles.tab}>{this.renderListChats('Fuego')}</Tab.Pane>
        },
        {
          menuItem: 'Medico',
          render: () => <Tab.Pane attached={false} style={styles.tab}>{this.renderListChats('Médico')}</Tab.Pane>
        }
      ];
  FILTERSOPTIONS = this.props.history.location.pathname.includes('chat')
    ? [ undefined ]
    : [ 'Policia', 'Fuego', 'Médico' ];

  componentDidMount() {
    const { alarmIndex: tabIndex } = this.props.match.params;
    let { activeIndex } = this.state;
    let { chats } = this.props;
    let filtered = [];

    if (chats) {
      if (tabIndex) filtered = chats.filter((item) => item.alarmType === this.FILTERSOPTIONS[tabIndex]);
      else filtered = chats.filter((item) => item.alarmType === this.FILTERSOPTIONS[activeIndex]);
      this.setState({ chats: filtered, activeIndex: tabIndex ? tabIndex : activeIndex });
    }
    let messageBody = document.querySelector('#messagesContainer');
    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
  }
  componentDidUpdate(prevProps) {
    const { /*flagUpdate,*/ activeIndex } = this.state;
    const { alarmIndex: tabIndex, chatId } = this.props.match.params;
    const { chats: chatsPrev } = prevProps;
    const { chats } = this.props;

    // if (flagUpdate === 0) {
    if (chats && chatsPrev && !_.isEqual(_.sortBy(chats), _.sortBy(chatsPrev))) {
      if (chatsPrev.length !== chats.length) this.setState({ chats });
      const nameType = this.FILTERSOPTIONS[Number(tabIndex ? tabIndex : activeIndex)];
      const filteredChats = chats.filter((e) => e.alarmType === nameType);
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
    const { alarmIndex } = this.props.match.params;
    const { chats, chatId, index, loading, camData, personalInformation, mapPolice, policeMarker, policePolyline/*, showReport*/ } = this.state;
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
              defaultActiveIndex={alarmIndex ? alarmIndex : 0}
              onTabChange={(t, i) => {
                const { chats } = this.props;
                const { index } = this.state;
                let newChats = chats.filter((e) => e.alarmType === this.FILTERSOPTIONS[i.activeIndex]);
                if (index) {
                  let selected =
                    newChats.length !== 0 && newChats[index] ? newChats[index].alarmType : newChats[0].alarmType;
                  this.setState({ from: selected ? selected : 'Error getting data' });
                }
                this.setState({ chats: newChats, activeIndex: i.activeIndex, index: null, tabIndex: i.activeIndex });
              }}
            />
          </div>
          <div className='col-8'>
            <div className='messages'>
              {!loading && chatId !== '' && chats[index] ? (
                <div className='cameraView'>
                  <h2
                    className={'Chat C5'}
                    style={{
                      textAlign: 'center',
                      backgroundColor: COLORS[chats[index].alarmType ? chats[index].alarmType : 'c5'],
                      height: '30px'
                    }}
                  >
                    {chats[index].alarmType ? chats[index].alarmType : 'Chat C5'}
                  </h2>
                  <div className='row' style={{ height: '70%', margin: 0 }}>
                    <div className='col' style={{ height: '100%' }}>
                      {chats[index].user_cam.google_cordenate !== undefined ? (
                        <MapContainer
                          options={{
                            center: {
                              lat: parseFloat(chats[index].user_cam.google_cordenate.split(',')[0]),
                              lng: parseFloat(chats[index].user_cam.google_cordenate.split(',')[1])
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
                          markersUnmount={{ policeMarker, policePolyline }}
                        />
                      ) : (
                        <MapContainer
                          options={{
                            center: {
                              lat: parseFloat(chats[index].location.latitude),
                              lng: parseFloat(chats[index].location.longitude)
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
                          markersUnmount={{ policeMarker, policePolyline }}
                        />
                      )}
                    </div>
                    <div className='col camContainerChatDiv' style={{ height: '100%' }}>
                      {camData !== undefined ? (
                        <CameraStream hideTitle height='250px' propsIniciales={this.props} marker={camData} />
                      ) : (
                        <p>Sin camara asignada...</p>
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
                                {Object.keys(chats[index].user_cam).length > 0 ? chats[index].user_cam.phone : '-'}
                              </div>
                            </div>
                            <div className='row'>
                              <div className='col-6' style={styles.text}>
                                <b>Dirección: </b>
                                {Object.keys(chats[index].user_cam).length > 0 ? (
                                  `${chats[index].user_cam.street} ${chats[index].user_cam.number}, ${chats[index]
                                    .user_cam.town}, ${chats[index].user_cam.township}`
                                ) : (
                                  '-'
                                )}
                              </div>
                              <div className='col' style={styles.text}>
                                <b>Cámara: </b>
                                {camData && camData.extraData ? `#cam${camData.extraData.num_cam}` : '-'}
                              </div>
                            </div>
                            {personalInformation.alarmType && (
                              <div className='row'>
                                <div className='col-6' style={styles.text}>
                                  <b>Descripción: </b>
                                  {personalInformation.description ? personalInformation.description : '-'}
                                </div>
                                <div className='col' style={styles.text}>
                                  <b>Alarma: </b>
                                  {personalInformation.alarmType ? personalInformation.alarmType : '-'}
                                </div>
                                <div className='col' style={styles.text}>
                                  <b>Alarma NS: </b>
                                  {personalInformation.alarmSN ? personalInformation.alarmSN : '-'}
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
                              {this.state.timePolice && (
                                <div className='col' style={styles.text}>
                                  <b>Tiempo estimado de llegada de policia: </b>
                                  {this.state.timePolice}
                                </div>
                              )}
                            </div>
                          </div>
                          {this.props.history.location.pathname.includes('alarm') &&
                          chats[index].active === 1 && (
                            <div className='col'>
                              <div className='row'>
                                <Button
                                  icon
                                  size='small'
                                  color='red'
                                  labelPosition='left'
                                  style={styles.buttonMargin}
                                  disabled={chats[index].policeId}
                                  onClick={() =>
                                    this._handlePoliceState(true, chats[index], {
                                      isAlarm: true,
                                      pointCoords: [ chats[index].location ]
                                    })}
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
                                    onClick={() => this.desactivateAlarm(chats[index].id)}
                                  >
                                    {/* <Icon inverted name='file excel' /> */}
                                    <Icon inverted name='close' />
                                    Desactivar{/* Sin Rep */}
                                  </Button>
                                {/* </Button.Group> */}
                              </div>
                            </div>
                          )}
                        </div>
                      </Card.Content>
                    </Card>
                  </div>
                </div>
              ) : null}
              <div className='messagesContainer' id='messagesContainer'>
                {!loading && chatId !== '' && chats[index] ? chats[index].messages ? (
                  this.state.messages !== undefined &&
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
                          {value.dateTime.toDate ? (
                            moment(value.dateTime.toDate()).format('DD-MM-YYYY, HH:mm:ss')
                          ) : null}
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
    const { index, chats } = this.state;
    const { history: { location: { pathname } } } = this.props;

    return (
      <div>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Input
            placeholder={`Buscar ${pathname.includes('alarm') ? 'alertas' : 'chats'}`}
            style={{ flex: 2 }}
            onChange={this.filterAction}
          />
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
            const date =
              chat && chat.create_at
                ? moment(chat.create_at).format('DD-MM-YYYY, HH:mm:ss')
                : typeof chat.lastModification === 'string'
                  ? moment(chat.lastModification).format('DD-MM-YYYY, HH:mm:ss')
                  : moment(chat.lastModification.toDate()).format('DD-MM-YYYY, HH:mm:ss');

            let badgeNumber = 0;
            if (this.state.chatId) badgeNumber = this.state.chatId === chat.id ? 0 : chat.c5Unread;
            return (
              <Card
                className={i === index ? 'activeChat' : ''}
                style={{ width: '100%' }}
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
                          'No hay mensajes que mostrar'
                        ) : (
                          'No hay mensajes que mostrar'
                        )}
                      </p>
                    ) : (
                      <p />
                    )}

                    {chat.c5Unread !== undefined && badgeNumber !== 0 ? (
                      <div className='notificationNumber' style={{ marginTop: 15 }}>
                        <p>{chat.c5Unread}</p>
                      </div>
                    ) : null}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                      <div>
                        <small style={{ ...styles.badge, marginLeft: 3, alignSelf: 'flex-end', display: 'flex' }}>
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
      let filterData = chatsProps;
      if (this.props.history.location.pathname.includes('alarm')) {
        filterData = chatsProps.filter((c) => c.alarmType === this.FILTERSOPTIONS[activeIndex]);
      }
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
        let newChats = chatsProps;
        if (this.props.history.location.pathname.includes('alarm')) {
          newChats = chatsProps.filter((c) => c.alarmType === this.FILTERSOPTIONS[activeIndex]);
        }
        this.setState({ chats: newChats });
      }
    });
  };

  handleChangeOption = (e, { value }) => this.setState({ optionSelected: value });

  _onMapLoad = (map) => {
    const { chats } = this.props;
    const { index, policePointCoords } = this.state;
    if (policePointCoords) this._setPoliceMarker(policePointCoords, map);

    if (chats[index].user_cam.google_cordenate !== undefined) {
      const coords = {
        lat: parseFloat(chats[index].user_cam.google_cordenate.split(',')[0]),
        lng: parseFloat(chats[index].user_cam.google_cordenate.split(',')[1])
      };
      this.setState({ map: map });
      new window.google.maps.Marker({
        position: coords,
        map: map,
        title: chats[index].user_nicename
      });
    } else {
      const coords = {
        lat: parseFloat(chats[index].location.latitude),
        lng: parseFloat(chats[index].location.longitude)
      };
      this.setState({ map: map });
      new window.google.maps.Marker({
        position: coords,
        map: map,
        title: chats[index].user_nicename
      });
    }
  };

  getUserInfo = (chat) => {
    if (chat) {
      const { user_cam, alarm, alarmType } = chat;
      if (user_cam.active !== undefined && alarm && alarmType) {
        this.setState({
          personalInformation: {
            cellPhone: user_cam.cellPhone,
            address: `
                ${user_cam.street ? user_cam.street : '-'}, 
                ${user_cam.number ? '#' + user_cam.number : '#'},
                ${user_cam.town ? user_cam.town : '-'},
                ${user_cam.township ? user_cam.township : '-'},
                ${user_cam.state ? user_cam.state : '-'},
                `,
            alarmType,
            description: `${alarm.description ? alarm.description : '-'}`,
            alarmSN: `${alarm.serial_number}`
          }
        });
      }
    }
  };

  changeChat = (chat, i, flag = true) => {
    this.getUserInfo(chat);
    let { history, stopNotification } = this.props;
    const nameRoute = history.location.pathname.includes('/chat') ? 'chat' : 'alarm';
    if (this.state.timePolice) this.setState({ timePolice: null, policePointCoords: null });

    if (flag) {
      history.push(`/${nameRoute}/${this.state.activeIndex}/${chat.id}`);
    }
    if (chat === undefined && i === -1) {
      history.push(`/${nameRoute}`);
    } else {
      this.getMessages(chat.id);
      this.setState({ loading: true, camData: undefined }, () => {
        stopNotification();
        this._changeUserCam(chat);

        this.setState({
          index: i,
          loading: false,
          from: chat.from,
          alarm: chat.alarm,
          alarmType: chat.alarmType
        });

        if (!chat.active && this.state.firebaseSubPolice) {
          this.state.firebaseSubPolice();
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
            const { map } = this.state;

            if (map) this._setPoliceMarker(pointCoords, map);
            this.setState({ policePointCoords: pointCoords });
          });
        }
      }
      this.setState({ messages: snapShot.get('messages'), chatId, chats: current_chat });
    });
  };

  checkKey = (event) => {
    var key = window.event.keyCode;
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

  _changeUserCam = (chat) => {
    if (Object.keys(chat.user_cam).length !== 0) {
      const { user_cam } = chat;
      this.setState({
        camData: {
          extraData: {
            num_cam: user_cam.num_cam,
            cameraID: user_cam.num_cam,
            isHls: true,
            url: `http://${user_cam.UrlStreamMediaServer.ip_url_ms}:${user_cam.UrlStreamMediaServer
              .output_port}${user_cam.UrlStreamMediaServer.name}${user_cam.channel}`,
            dataCamValue: user_cam
          }
        }
      });
    } else this.setState({ camData: undefined });
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

  desactivateAlarm(chatId) {
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
      icon: police_blue,
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
}

export default ChatAlarm;

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
