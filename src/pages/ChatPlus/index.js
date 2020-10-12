import React, { Component } from "react";
import { Card, Icon, Button, Input, Dropdown, Tab } from "semantic-ui-react";

import "./style.css";
// import firebaseC5 from "../../constants/configC5";
import CameraStream from "../../components/CameraStream";
import constants from "../../constants/constants";
import MapContainer from "../../components/MapContainer";
import Axios from "axios";
import moment from 'moment'
import _ from 'lodash'

import FadeLoader from "react-spinners/FadeLoader";

import firebaseC5Benito from '../../constants/configC5CJ'

const refSOS = firebaseC5Benito
  .app("c5benito")
  .firestore()
  .collection("messages");


const COLORS = {
  "c5": "ffaa20",
  "Fuego": "#cd0a0a",
  "Policia": "#0f4c75",
  "Médico": "#28df99",
}

const FILTERSOPTIONS = [
    undefined,
    "Fuego",
    "Policia",
    "Médico",
]

const SEARCHOPTIONS = [
  {
    key: 'name',
    text: 'Nombre de Usuario',
    value: 'name',
  },
  {
    key: 'date',
    text: 'Fecha',
    value: 'date',
  },
]

class Chat extends Component {
  state = {
    messages: [],
    chats: [],
    activeIndex: 0,
    chatId: "",
    text: "",
    from: "",
    fisrt: {},
    searching: "",
    tracking: {},
    camData: undefined,
    loading: false,
    hashUsed: false,
    personalInformation: {
      cellPhone: null,
      address: null,
      alarmType: null,
      description: null,
      alarmSN: null
    },
    optionSelected: "name",
    marker: null,
    firebaseSub: null,
    tabIndex: 0,
    messages: []
  };
  panes = [
    {
      menuItem: 'C5',
      render: () => <Tab.Pane attached={false} style={styles.tab} > {this.renderListChats("C5")}</Tab.Pane>,
    },
    {
      menuItem: 'Fuego',
      render: () => <Tab.Pane attached={false} style={styles.tab}>{this.renderListChats("fire")}</Tab.Pane>,
    },
    {
      menuItem: 'Policia',
      render: () => <Tab.Pane attached={false} style={styles.tab}>{this.renderListChats("police")}</Tab.Pane>,
    },
    {
        menuItem: 'Medico',
        render: () => <Tab.Pane attached={false} style={styles.tab}>{this.renderListChats("medic")}</Tab.Pane>,
      },
  ]


  filterAction = (event) => {
    const { target: { value } } = event
    const { activeIndex } = this.state;
    const { chats: chatsProps } = this.props
    const { optionSelected, searching } = this.state
    this.setState({ searching: value.trim() }, () => {
      const filterData = chatsProps.filter(c => c.trackingType === FILTERSOPTIONS[activeIndex])
      let expresion = new RegExp(`${searching}.*`, "i");
      if (searching.trim().length !== 0) {
        let newFilterSearch
        if (optionSelected === "alertType") {
          newFilterSearch = filterData.filter(c => c.trackingType && expresion.test(c.trackingType))
        } else if (optionSelected === "date") {
          newFilterSearch = filterData.filter(c => expresion.test(moment(moment(c.create_at)).format('DD-MM-YYYY, h:mm a')))
        } else if (optionSelected === "name") {
          newFilterSearch = filterData.filter(c => expresion.test(c.user_name))
        }
        this.setState({ chats: newFilterSearch })
      }
      if (value.trim().length === 0) {
        let newChats = this.props.chats.filter(c => c.trackingType === FILTERSOPTIONS[this.state.activeIndex])
        this.setState({ chats: newChats })
      }
    });


  }

  handleChangeOption = (e, { value }) => this.setState({ optionSelected: value })

  renderListChats = (type) => {
    const { index, chats } = this.state;
    return (
    <div >
      <div style={{ display: "flex", flexDirection: "row" }}>
        <Input placeholder="Buscar alertas" style={{ flex: 2 }} onChange={this.filterAction}></Input>
        <Dropdown
          placeholder='Buscar por'
          fluid
          selection
          options={SEARCHOPTIONS}
          defaultValue="name"
          onChange={this.handleChangeOption}
          style={{ flex: 1 }}
        />

      </div>
      <div style={{height: '81vh', overflow: 'scroll', backgroundColor: '#dadada', padding: '20px'}}>
        {chats.map((chat, i) => (
          <Card
            className={i === index ? "activeChat" : ""}
            style={{ width: "100%" }}
            key={i}
            onClick={() => this.changeChat(chat, i)}
          >
            <Card.Content>
              <div style={{ position: "relative" }}>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}><h4>{chat.user_name}</h4> <p>{moment(moment(chat.create_at)).format('DD-MM-YYYY, h:mm a')}</p></div>
                {

                  chat.active !== undefined && chat.active ?
                    <p>
                      {chat.messages
                        ? chat.messages.length > 0
                          ? (chat.messages[chat.messages.length - 1].from ===
                            "user"
                            ? chat.user_name.split(" ")[0]
                            : "C5") +
                          ": " +
                          chat.messages[chat.messages.length - 1].msg //msg
                          : "No hay mensajes que mostrar"
                        : "No hay mensajes que mostrar"}
                    </p> :
                    <p>Ticket Id: {chat.id}</p>
                }

                {chat.c5Unread !== undefined && chat.c5Unread !== 0 ? (
                  <div className="notificationNumber" style={{ marginTop: 15 }}>
                    <p>{chat.c5Unread}</p>
                  </div>
                ) : null}
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                  <div > <small style={{ ...styles.badge, marginLeft: 3, alignSelf: "flex-end", display: "flex" }}> <Icon name={chat.active ? "clock" : "checkmark"}></Icon> <strong>{chat.active ? "Proceso" : "Cerrado"}</strong> </small></div>
                </div>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>
    </div>)
  }

  render() {
    const { alarmIndex } = this.props.match.params
    const { chats, chatId, index, loading, camData, personalInformation } = this.state
    console.log(chats[index]);
    if (index !== undefined && chatId === "" && chats.length > 0) {
      this.setState({ chatId: null });
    }
    const chatSelected = chats && chats[index]

    const textareaDisabled = chatSelected && chatSelected.active !== undefined ? !chatSelected.active : true;
    return (
      <div
        className={
          !this.props.showMatches
            ? "hide-matches app-container"
            : "show-matches app-container"
        }
      >
        <div className="row fullHeight">
          <div className="col-4 userList">
            <Tab 
              menu={{ pointing: true }} 
              panes={this.panes} 
              defaultActiveIndex={ alarmIndex ? alarmIndex : 0 } 
              onTabChange={(t, i) => {
                const { chats } = this.props
                const { index } = this.state
                let newChats = chats.filter(e => e.alarmType === FILTERSOPTIONS[i.activeIndex])
                if (index !== undefined) {
                  let selected = newChats.length !== 0 && newChats[index] ? newChats[index].alarmType : newChats[0].alarmType;
                  this.setState({ from: selected ? selected : "Error getting data" })
                }
                let newIndex = index > newChats.length - 1 ? 0 : index
                this.setState({ chats: newChats, activeIndex: i.activeIndex, index: null })
              }} />
          </div>
          <div className="col-8">
            <div className="messages">
              {!loading && chatId !== "" && chats[index] ? (
                <div className="cameraView">
                  <h2
                    className={"Chat C5"}
                    style={{
                      textAlign: "center",
                      backgroundColor: COLORS[chats[index].alarmType ? chats[index].alarmType : 'c5'],
                      height: "5%"
                    }}
                  >
                    {chats[index].alarmType ? chats[index].alarmType : 'Chat C5'}
                  </h2>
                  <div className="row" style={{ height: "70%", margin: 0 }}>
                    <div
                      className="col"
                      style={{ height: "100%"}}
                    >
                      {chats[index].user_cam.google_cordenate !== undefined ? 
                        <MapContainer
                          options={{
                            center: { lat: parseFloat(chats[index].user_cam.google_cordenate.split(',')[0]), lng: parseFloat(chats[index].user_cam.google_cordenate.split(',')[1]) },
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
                        :
                        <MapContainer
                          options={{
                              center: { lat: parseFloat(chats[index].location.latitude), lng: parseFloat(chats[index].location.longitude) },
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
                    }
                    </div>
                    <div className='col camContainerChatDiv' style={{ height: '100%' }}>
                      {camData !== undefined ?
                          <CameraStream
                              style={{ height: '100%' }}
                              hideTitle
                              height='100%'
                              hideButton
                              propsIniciales={this.props}
                              marker={camData}
                          />
                      : null}
                    </div>
                  </div>

                  <div className="row" style={{ height: "20%", width: '100%', margin: 0, marginTop: '5px'}}>
                    <Card style={{ width: "100%" }}>
                      <Card.Content>
                        <div className="row">
                          <div className="col-8">
                            <div className="row" style={{padding: '5px'}}>
                              <div className="col-6" style={{ fontSize: 13, paddingRight: 0 }}>
                                <b>Nombre: </b> {chats[index].user_name}
                              </div>
                              <div
                                className="col-3"
                                style={{
                                  fontSize: 13,
                                  paddingLeft: 0,
                                  paddingRight: 0,
                                }}
                              >
                                <b>Celular: </b> {personalInformation.cellPhone ? personalInformation.cellPhone : ''}
                              </div>
                            </div>
                            <div className="row" style={{padding: '5px'}}>
                              <div className="col-12" style={{ fontSize: 13, paddingRight: 0 }}>
                                <b>Dirección: </b>{personalInformation.address ? personalInformation.address : ''}
                              </div>
                            </div>
                            {personalInformation.alarmType ? 
                              <div className="row" style={{padding: '5px'}}>
                                <div className="col-6" style={{ fontSize: 13, paddingRight: 0 }}>
                                  <b>Descripción: </b>{personalInformation.description ? personalInformation.description : ''}
                                </div>
                                  <div className="col-3" style={{ fontSize: 13, paddingLeft: 0, paddingRight: 0}}>
                                    <b>Alarma: </b> {personalInformation.alarmType ? personalInformation.alarmType : ''}
                                  </div>
                                  <div className="col-3" style={{ fontSize: 13, paddingLeft: 0, paddingRight: 0}}>
                                    <b>Alarma NS: </b> {personalInformation.alarmSN ? personalInformation.alarmSN : ''}
                                  </div>
                              </div>
                              : null  
                            }
                          </div>
                          <div className="col-4" style={{ margin: "auto" }}>
                              <Button
                                size='small'
                                icon
                                labelPosition='left'
                                color="red"
                                onClick={this.closeChat}
                                style={{margin: '5px'}}
                                disabled={textareaDisabled}
                              >
                                <Icon name="taxi" />
                                Enviar unidad
                              </Button>
                              <br />
                              <Button
                                size='small'
                                icon
                                labelPosition='left'
                                color="green"
                                onClick={this.closeChat}
                                style={{margin: '5px'}}
                                disabled={textareaDisabled}
                              >
                                <Icon name="phone" />
                                Marcar Ciudadano
                              </Button>
                          </div>
                        </div>
                      </Card.Content>
                    </Card>
                  </div>
                </div>
              ) : null}
              <div className="messagesContainer" id="messagesContainer">
                {!loading && chatId !== "" && chats[index]
                  ? chats[index].messages
                    ? this.state.messages.map((value, ref) => (
                      <div
                        key={ref}
                        className={
                          value.from === "user"? "user" : "support"
                        }
                        ref={
                          ref === chats[index].messages.length - 1
                            ? "message"
                            : "message" + ref
                        }
                        id={
                          ref === chats[index].messages.length - 1
                            ? "lastMessage"
                            : "message" + ref
                        }
                      >
                        <p>{value.msg}</p>
                        <small>
                          {value.dateTime.toDate
                            ? value.dateTime.toDate().toLocaleString()
                            : null}
                        </small>
                      </div>
                    ))
                    : loading === true ?
                        <>  
                            <FadeLoader height={20} width={7} radius={20} margin={5} loading={loading} css={styles.centered}/> 
                            <p style={{position: "fixed", top: '56%', left: '62%'}}>Cargando chat</p>
                        </> :
                            <p style={{position: "fixed", top: '50%', left: '60%'}}>No se ha seleccionado ningun chat</p> : 
                        loading === true ? 
                        <>
                            <FadeLoader height={20} width={7} radius={20} margin={5} loading={loading} css={styles.centered}/>
                            <p style={{position: "fixed", top: '56%', left: '62%'}}>Cargando chat</p>
                        </>:
                            <p style={{position: "fixed", top: '50%', left: '60%'}}>No se ha seleccionado ningun chat</p>
                        }
              </div>
              {chatId !== "" && chats[index] ? (
                <div className="messages_send_box">
                  {!textareaDisabled ?
                    <div style={{ position: "relative" }}>
                      <textarea
                        disabled={textareaDisabled}
                        placeholder="Escriba su mensaje"
                        name="text"
                        autoComplete="on"
                        autoCorrect="on"
                        id="messsageTextarea"
                        value={this.state.text}
                        onKeyPress={this.checkKey}
                        onChange={(event) => {
                          this.setState({ text: event.target.value });
                        }}
                      ></textarea>
                      <Icon
                        name="send"
                        id="sendbutton"
                        onClick={this.sendMessage}
                      />
                    </div>
                    :
                    <div className="closed-ticked">El ticket ya se encuentra cerrado</div>
                  }
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }

  _onMapLoad = (map) => {
    const { chats } = this.props
    const { index } = this.state
    if(chats[index].user_cam.google_cordenate !== undefined){
        const coords = { lat: parseFloat(chats[index].user_cam.google_cordenate.split(',')[0]), lng: parseFloat(chats[index].user_cam.google_cordenate.split(',')[1]) }
        this.setState({ map: map })
        new window.google.maps.Marker({
            position: coords,
            map: map,
            title: chats[index].user_nicename,
        });
    } else {
        const coords = { lat: parseFloat(chats[index].location.latitude), lng: parseFloat(chats[index].location.longitude) }
        this.setState({ map: map })
        new window.google.maps.Marker({
            position: coords,
            map: map,
            title: chats[index].user_nicename,
        });
    }
  };

  getUserInfo = (chat) => {
    if(chat){
      const {user_cam, alarm, alarmType} = chat
        if(user_cam.active !== undefined && alarm && alarmType){
          this.setState({
            personalInformation: {
              cellPhone: user_cam.cellPhone,
              address: `
                ${user_cam.street ? user_cam.street : '-'}, 
                ${user_cam.number ? '#' + user_cam.number : '#' },
                ${user_cam.town ? user_cam.town : '-' },
                ${user_cam.township ? user_cam.township : '-' },
                ${user_cam.state ? user_cam.state : '-' },
                `,
              alarmType,
              description: `${alarm.description ? alarm.description : '-'}`,
              alarmSN: `${alarm.serial_number}`
            },
          })
        } 
    }
  }

  changeChat = (chat, i, flag = true) => {
    this.getUserInfo(chat)
    if(flag){
      this.props.history.push(`/chat/${this.state.activeIndex}/${chat.id}`)
    }
    if(chat === undefined && i === -1){
      this.props.history.push('/chat')
    } else {
      this.getMessages(chat.id)
      this.setState(
        { loading: true, camData: undefined},
        () => {
          this._changeUserCam(chat)
          this.props.stopNotification();
  
          this.setState({
            // chatId: chat.id,
            // messages: chat.messages,
            index: i,
            from: chat.from,
            loading: false,
            alarmType: chat.alarmType,
            alarm: chat.alarm
          })
  
          refSOS
              .doc(chat.id)
              .update({ c5Unread: 0 })
              .then(() => {
              this.setState({ text: '', from: 'Chat C5' })
          })
  
        }
      )
    }
  };

  getMessages = (chatId) => {
    this.messageListener = refSOS.doc(chatId).onSnapshot(snapShot => {
      this.setState({messages: snapShot.get('messages'), chatId})
    })
  }

  checkKey = (event) => {
    var key = window.event.keyCode;
    if (key === 13) {
      this.sendMessage();
      return false;
    } else {
      return true;
    }
  };

  _changeUserCam = (chat) => {
    console.log('on changeuserCam', chat)
    Axios.get(
      constants.base_url +
      ":" +
      constants.apiPort +
      "/admin/users/" +
      chat.user_creation
    ).then((response) => {
      console.log('response changeusercam', response.data)
      if (response.status === 200) {
        if (response.data.success) {
          const data = response.data.data;
          this.setState({
            camData:
              data.UserToCameras[0] === undefined
                ? undefined
                : {
                  extraData: {
                    num_cam:
                      data.UserToCameras[0] !== undefined
                        ? data.UserToCameras[0].Camare.num_cam
                        : null,
                    cameraID:
                      data.UserToCameras[0] !== undefined
                        ? data.UserToCameras[0].Camare.num_cam
                        : null,
                    //webSocket:'ws://'+data.UserToCameras[0].Camare.UrlStreamToCameras[0].Url.dns_ip+':'+data.UserToCameras[0].Camare.port_output_streaming
                    isHls: true,
                    url:
                      data.UserToCameras[0] !== undefined
                        ? "http://" +
                        data.UserToCameras[0].Camare.UrlStreamMediaServer
                          .ip_url_ms +
                        ":" +
                        data.UserToCameras[0].Camare.UrlStreamMediaServer
                          .output_port +
                        data.UserToCameras[0].Camare.UrlStreamMediaServer
                          .name +
                        data.UserToCameras[0].Camare.channel
                        : null,
                    dataCamValue:
                      data.UserToCameras[0] !== undefined
                        ? data.UserToCameras[0].Camare
                        : null,
                  },
                },
          });
        }
      }
    }).catch(err => console.log(err))
  };

  closeChat = () => {
    /*let {chats} = this.props
     */
  };

  sendMessage = () => {
    
    if (this.state.text === "") return;
    const {chatId, messages} = this.state

    let messagesAux = messages.map((e) => {
      // console.log(typeof e.dateTime);
      // e.dateTime = e.dateTime.toDate();
      return e;
    });

    messagesAux.push({
      from: "support",
      dateTime: new Date(),
      msg: this.state.text, //msg
    });


    this.props.stopNotification();

    refSOS
      .doc(chatId)
      .update({
        messages: messagesAux,
        from: "Chat C5",
        userUnread: this.props.chats[this.state.index].userUnread
          ? this.props.chats[this.state.index].userUnread + 1
          : 1,
        policeUnread: this.props.chats[this.state.index].policeUnread
          ? this.props.chats[this.state.index].policeUnread + 1
          : 1,
      })
      .then(() => {
        this.setState({ text: "" });
      });
  };

  async componentDidMount() {    
    const { alarmIndex } = this.props.match.params

    if (this.props.chats) {
        if(alarmIndex){
          this.setState({ chats: this.props.chats, activeIndex: alarmIndex })
        } else {
          this.setState({ chats: this.props.chats })
        }
    }
    var messageBody = document.querySelector("#messagesContainer");
    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
  }

  QueryStringToJSON(query) {
    query = query.replace("?", "");
    var pairs = query.split("&");

    var result = {};
    pairs.forEach(function (pair) {
      pair = pair.split("=");
      result[pair[0]] = decodeURIComponent(pair[1] || "");
    });

    return JSON.parse(JSON.stringify(result));
  }

  componentDidUpdate(prevProps) {
    const {alarmIndex, chatId} = this.props.match.params
    const { chats: chatsPrev } = prevProps
    const { chats } = this.props
    if (chats && chatsPrev && !_.isEqual(_.sortBy(chats), _.sortBy(chatsPrev))) {
      this.setState({ chats: chats })
        switch (parseInt(alarmIndex)) {
          case 0:
              const chatsC5 = this.props.chats.filter(e => !e.alarmType)
              this.setState({ chats: chatsC5 })
              if(chatId){
                const indexC5 = chatsC5.findIndex(e => e.id === chatId)
                this.changeChat(chatsC5[indexC5], indexC5, false)
              }
              // if(this.state.beforeChange){
              // }
          break;
          case 1: 
              const fireChats = this.props.chats.filter(e => e.alarmType === 'Fuego')
              this.setState({ chats: fireChats})
              if(chatId){
              const indexFire = fireChats.findIndex(e => e.id === chatId)
              this.changeChat(fireChats[indexFire], indexFire, false)
                }
              // if(this.state.beforeChange){
              // }
          break;
          case 2:
              const policeChats = this.props.chats.filter(e => e.alarmType === 'Policia')
              this.setState({ chats: policeChats })
              if(chatId){
              const indexPolice = policeChats.findIndex(e => e.id === chatId)
              this.changeChat(policeChats[indexPolice], indexPolice, false)
                }
              // if(this.state.beforeChange){
              // }
          break;
          case 3:
              const medicChats = this.props.chats.filter(e => e.alarmType === 'Médico')
              this.setState({ chats: medicChats })
              if(chatId){
              const indexMedic = medicChats.findIndex(e => e.id === chatId)
              this.changeChat(medicChats[indexMedic], indexMedic, false)
                }
              // if(this.state.beforeChange){
              // }
          break;
          default:
              const chats = this.props.chats.filter(e => !e.alarmType)
              this.setState({ chats })
          break;
      }
    }
    var messageBody = document.querySelector("#messagesContainer");
    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
  }
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
  tab: { backgroundColor: "#dadada", borderWidth: 0, borderColor: "#dadada" }
}
