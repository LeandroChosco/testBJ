import React, { Component } from "react";
import { Card, Icon, Button, Input, Dropdown, Tab, IconGroup } from "semantic-ui-react";

import "./style.css";
// import firebaseC5 from "../../constants/configC5";
// import CameraStream from "../../components/CameraStream";
import constants from "../../constants/constants";
import MapContainer from "../../components/MapContainer";
import Axios from "axios";
import moment from 'moment'
import _ from 'lodash'
// fireSOS

import { getTracking, MESSAGES_COLLECTION, SOS_COLLECTION } from "../../Api/sos";
import firebaseSos from "../../constants/configSOS";
import { support } from "jszip";

// const ref = firebaseC5.app("c5cuajimalpa").firestore().collection("messages");

const refSOS = firebaseSos
  .app("sos")
  .firestore()
  .collection(MESSAGES_COLLECTION);


const COLORS = {
  "Emergencia Medica": "#9EE8A7",
  "Proteccion Policial": "#FFB887",
  "Proteccion Civil": "#E29EE8",
  "Seguridad": "#FFB887"
}

const FILTERSOPTIONS = [
  "Emergencia Médica",
  "Seguridad",
  "Protección Civil",
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
    personalInformation: {},
    optionSelected: "name",
    marker: null,
    firebaseSub: null
  };
  panes = [
    {
      menuItem: 'Emergencia Medica',
      render: () => <Tab.Pane attached={false} style={styles.tab} > {this.renderListChats("Emergencia Medica")}</Tab.Pane>,
    },
    {
      menuItem: 'Seguridad',
      render: () => <Tab.Pane attached={false} style={styles.tab}>{this.renderListChats("Seguridad")}</Tab.Pane>,
    },
    {
      menuItem: 'Proteccion Civil',
      render: () => <Tab.Pane attached={false} style={styles.tab}>{this.renderListChats("Proteccion Civil")}</Tab.Pane>,
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

    return (<div >
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
                        : "No hay mensajes que mostart"
                      : "No hay mensajes que mostart"}
                  </p> :
                  <p>Ticket Id: {chat.id}</p>
              }

              {chat.c5Unread !== undefined && chat.c5Unread !== 0 ? (
                <div className="notificationNumber" style={{ marginTop: 15 }}>
                  <p>{chat.c5Unread}</p>
                </div>
              ) : null}
              <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                {/* <small style={{ ...styles.badge, backgroundColor: COLORS[chat.trackingType], }}> <strong>{chat.trackingType}</strong> </small> */}
                <div > <small style={{ ...styles.badge, marginLeft: 3, alignSelf: "flex-end", display: "flex" }}> <Icon name={chat.active ? "clock" : "checkmark"}></Icon> <strong>{chat.active ? "Proceso" : "Cerrado"}</strong> </small></div>
              </div>
            </div>
          </Card.Content>
        </Card>
      ))}
    </div>)
  }

  render() {
    const { tabIndex } = this.props.match.params
    const { chats, chatId, index, from, loading, tracking } = this.state;
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
              defaultActiveIndex={tabIndex ? tabIndex : 0}
              onTabChange={(t, i) => {
              const { chats } = this.props
              const { index } = this.state
              let newChats = chats.filter(c => c.trackingType === FILTERSOPTIONS[i.activeIndex]);
              if (index !== undefined) {
                let selected = newChats.length !== 0 && newChats[index] ? newChats[index].trackingType : newChats[0].trackingType;
                this.setState({ from: selected ? selected : "Error getting data" })
              }
              let newIndex = index > newChats.length - 1 ? 0 : index
              this.setState({ chats: newChats, activeIndex: i.activeIndex, index: null })
            }} />
          </div>
          <div className="col-8 messages">
            {!loading && chatId !== "" && chats[index] ? (
              <div className="cameraView">
                <h2
                  className={"Chat C5"}
                  style={{
                    textAlign: "center",
                    backgroundColor: COLORS[chats[index].trackingType],
                    height: "10%"
                  }}
                >
                  {from}
                </h2>
                <div className="row" style={{ height: "70%" }}>
                  <div
                    className="col"
                    style={{ height: "100%", width: "100%" }}
                  >
                    {Object.keys(tracking).length !== 0 && tracking.pointCoords && (
                      <MapContainer
                        options={{
                          center: {
                            lat: parseFloat(
                              tracking.pointCoords[
                                tracking.pointCoords.length - 1
                              ].latitude
                            ),
                            lng: parseFloat(
                              tracking.pointCoords[
                                tracking.pointCoords.length - 1
                              ].longitude
                            ),
                          },
                          zoom: 15,
                          mapTypeId: "roadmap",
                          zoomControl: false,
                          mapTypeControl: false,
                          streetViewControl: false,
                          fullscreenControl: false,
                          openConfirm: false,
                          typeConfirm: false,
                          openSelection: false,
                          checked: "",
                        }}
                        coordsPath={tracking.pointCoords}
                        onMapLoad={this._onMapLoad}
                      />
                    )}
                  </div>
                </div>

                <div className="row" style={{ paddingTop: 15, height: "20%" }}>
                  <Card style={{ width: "100%" }}>
                    <Card.Content style={{ padding: 0 }}>
                      <div className="row">
                        <div className="col-8">
                          <div className="row textContainer">
                            <div
                              style={{ fontSize: 13, paddingRight: 0 }}
                              className="col-6"
                            >
                              <b>Nombre: </b>
                              {chats[index].user_name}
                            </div>
                            <div
                              style={{
                                fontSize: 13,
                                paddingLeft: 0,
                                paddingRight: 0,
                              }}
                              className="col-3"
                            >
                              <b>Celular: </b>
                              {this.state.personalInformation.Contact.phone}
                            </div>
                            <div
                              style={{
                                fontSize: 13,
                                paddingLeft: 0,
                                paddingRight: 0,
                              }}
                              className="col-3"
                            ></div>
                          </div>
                          <div
                            className="row textContainer"
                            style={{ paddingTop: 0 }}
                          >
                            {/* <div style={{ fontSize: 13 }} className="col">
                              <b>Dirección: </b>
                              {chats[index].user_cam.street}{" "}
                              {chats[index].user_cam.number},{" "}
                              {chats[index].user_cam.town},{" "}
                              {chats[index].user_cam.township},{" "}
                              {chats[index].user_cam.state}
                            </div> */}
                          </div>
                        </div>
                        <div className="col-4" style={{ margin: "auto" }}>
                          <Button
                            color="red"
                            style={{ width: "80%", alignItems: "center" }}
                            className="ui button"
                            onClick={this.closeChat}
                          >
                            <Icon name="taxi" />
                            Mandar unidad
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
                  ? chats[index].messages.map((value, ref) => (
                    <div
                      key={ref}
                      className={
                        value.from === "user" ? "user" : "support"
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
                  : loading === true
                    ? "Cargando..."
                    : "No se ha seleccionado ningun chat"
                : loading === true
                  ? "Cargando..."
                  : "No se ha seleccionado ningun chat"}
            </div>
            {chatId !== "" ? (
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
    );
  }

  _onMapLoad = (map) => {
    const { chats } = this.props;
    const { index, tracking, marker } = this.state;
    const coords = {
      lat: parseFloat(
        tracking.pointCoords[tracking.pointCoords.length - 1].latitude
      ),
      lng: parseFloat(
        tracking.pointCoords[tracking.pointCoords.length - 1].longitude
      ),
    };

    let _marker = null;

    if (!marker) {
      _marker = new window.google.maps.Marker({
        position: coords,
        map: map,
        title: chats[index].user_nicename,
      });
    } else {
      if (tracking.active) {
        _marker = Object.assign(marker, {});
        _marker.setPosition(coords)
        _marker.setMap(map);
      } else {
        _marker = new window.google.maps.Marker({
          position: coords,
          map: map,
          title: chats[index].user_nicename,
        });
      }
    }
    this.setState({ map, marker: _marker });
  };

  changeChat = (chat, i, flag = true) => {
    console.log('chat', chat);
    if(flag){
      this.props.history.push(`/sos/${this.state.activeIndex}/${chat.id}`)
    }
    if(chat === undefined && i === -1){
      this.props.history.push('/sos')
    } else {
      this.getMessages(chat.id)
      this.setState(
        { loading: true, camData: undefined },
        async () => {
          this.props.stopNotification();
          const trackingInformation = await getTracking(chat.trackingId);
  
          let newData = trackingInformation.data.data();
  
          newData = {
            ...newData,
            id: trackingInformation.data.id,
          };
  
          this.setState({
            // chatId: chat.id,
            // messages: chat.messages,
            index: i,
            from: newData.SOSType, //
            tracking: newData,
            loading: false,
            personalInformation: newData.userInformation, //
            pointCoords: [], //
          });
  
          if (chat.active) {
            const unsub = firebaseSos
              .app("sos")
              .firestore()
              .collection(SOS_COLLECTION)
              .onSnapshot((docs) => {
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
            // this.state.firebaseSub();
          }
          refSOS
            .doc(chat.id)
            .update({ c5Unread: 0 })
            .then(() => {
              this.setState({ text: "" });
            });
        }
      );
    }
  };

  getMessages = (chatId) => {
   this.messageListener = refSOS.doc(chatId).onSnapshot(snapShot => {
    console.log(snapShot.get('messages'), chatId);
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
    Axios.get(
      constants.base_url +
      ":" +
      constants.apiPort +
      "/admin/users/" +
      chat.user_creation
    ).then((response) => {
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
    });
  };

  closeChat = () => {
    /*let {chats} = this.props
     */
  };

  sendMessage = () => {
    if (this.state.text === "") return;
    const {chatId, messages} = this.state

    let messagesAux = messages.map((e) => e)

    messagesAux.push({
      from: "support",
      dateTime: new Date(),
      msg: this.state.text
    })

    this.props.stopNotification()

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
    const {tabIndex} = this.props.match.params

    if (this.props.chats) {
      if(tabIndex){
        this.setState({ chats: this.props.chats, activeIndex: tabIndex })
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
    const { tabIndex, chatId } = this.props.match.params 
    const { chats: chatsPrev } = prevProps
    const { chats } = this.props
    if (chats && chatsPrev && !_.isEqual(_.sortBy(chats), _.sortBy(chatsPrev))) {
      this.setState({ chats: chats })
      switch (parseInt(tabIndex)) {
        case 0:
          const chatsMedic = this.props.chats.filter(e => e.trackingType === "Emergencia Médica")
          this.setState({ chats: chatsMedic})
          if(chatId){
            const indexMedic = chatsMedic.findIndex(e => e.id === chatId)
            this.changeChat(chatsMedic[indexMedic], indexMedic, false)
          }  
        break;
        case 1:
          const chatsSeguridad = this.props.chats.filter(e => e.trackingType === "Seguridad")
          this.setState({ chats: chatsSeguridad})
          if(chatId){
            const indexSeguridad = chatsSeguridad.findIndex(e => e.id === chatId)
            this.changeChat(chatsSeguridad[indexSeguridad], indexSeguridad, false)
          }  
        break;
        case 2: 
          const chatsCivil = this.props.chats.filter(e => e.trackingType === "Protección Civil")
          this.setState({ chats: chatsCivil})
          if(chatId){
            const indexCivil = chatsCivil.findIndex(e => e.id === chatId)
            this.changeChat(chatsCivil[indexCivil], indexCivil, false)
          }
        break;  
        default:
          const chats = this.props.chats.filter(e => e.trackingType === "Emergencia Médica")
          this.setState({ chats: chats})
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
