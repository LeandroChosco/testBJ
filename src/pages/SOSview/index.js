import React, { Component } from "react";
import { Card, Icon, Button, Input, Dropdown, Tab } from "semantic-ui-react";

import "./style.css";
import firebaseC5 from "../../constants/configC5";
import CameraStream from "../../components/CameraStream";
import constants from "../../constants/constants";
import MapContainer from "../../components/MapContainer";
import Axios from "axios";
import moment from 'moment'
import _ from 'lodash'
// fireSOS

import { getSOS, getTracking, MESSAGES_COLLECTION } from "../../Api/sos";
import firebaseSos from "../../constants/configSOS";

const ref = firebaseC5.app("c5cuajimalpa").firestore().collection("messages");

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
    optionSelected: "name"
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
    const { chats, activeIndex } = this.state;
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
    const { index, searching, chats } = this.state;

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
    const { chats } = this.state;
    const { chatId, index, from, camData, loading, tracking } = this.state;
    if (index !== undefined && chatId === "" && chats.length > 0) {
      this.setState({ chatId: chats[index].id });
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
            <Tab menu={{ pointing: true }} panes={this.panes} onTabChange={(t, i) => {
              const { chats } = this.props
              const { index } = this.state
              let newChats = chats.filter(c => c.trackingType === FILTERSOPTIONS[i.activeIndex]);
              if (index !== undefined) {
                let selected = newChats.length !== 0 && newChats[index] ? newChats[index].trackingType : newChats[0].trackingType;
                this.setState({ from: selected ? selected : "Error getting data" })
              }
              let newIndex = index > newChats.length - 1 ? 0 : index
              this.setState({ chats: newChats, activeIndex: i.activeIndex, index: newIndex })
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
                    {Object.keys(tracking).length != 0 && (
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
                        value.from === "Soporte" || value.from === "C2 base blindar" ? "support" : "user"
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
    const { index, tracking } = this.state;
    const coords = {
      lat: parseFloat(
        tracking.pointCoords[tracking.pointCoords.length - 1].latitude
      ),
      lng: parseFloat(
        tracking.pointCoords[tracking.pointCoords.length - 1].longitude
      ),
    };
    this.setState({ map: map });
    new window.google.maps.Marker({
      position: coords,
      map: map,
      title: chats[index].user_nicename,
    });
  };

  changeChat = (chat, i) => {

    this.setState(
      { chatId: "", loading: true, camData: undefined },
      async () => {
        this.props.stopNotification();

        const trackingInformation = await getTracking(chat.trackingId);

        let newData = trackingInformation.data.data();

        newData = {
          ...newData,
          id: trackingInformation.data.id,
        };

        refSOS
          .doc(chat.id)
          .update({ c5Unread: 0 })
          .then(() => {
            this.setState({ text: "" });
          });

        this.setState({
          chatId: chat.id,
          messages: chat.messages,
          index: i,
          from: newData.SOSType, //
          tracking: newData,
          loading: false,
          personalInformation: newData.userInformation, //
          pointCoords: [], //
        });
      }
    );
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
              data.UserToCameras[0] == undefined
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

    let messages = this.props.chats[this.state.index].messages;
    messages = messages.map((message) => {
      message.dateTime = message.dateTime.toDate();
      return message;
    });
    messages.push({
      from: "C2 base blindar",
      dateTime: new Date(),
      msg: this.state.text, //msg
    });
    this.props.stopNotification();
    refSOS
      .doc(this.state.chatId)
      .update({
        messages: messages,
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
    // const obj = {
    //   SOSType: "Robo",
    // };
    // const data = await getSOS(obj);
    // console.log("hey", data);

    // const track = await getTracking();

    // console.log("hey", track);
    if (this.props.chats) {
      this.setState({ chats: this.props.chats })
    }
    if (
      this.props.location.hash !== "" &&
      this.state.index != 0 &&
      this.state.hashUsed === false
    ) {
      if (this.props.chats[0] !== undefined) {
        //this.setState({index:0, from:this.props.chats[0].from})
        this._changeUserCam(this.props.chats[0]);
        this.setState({
          index: 0,
          from: this.props.chats[0].from,
          chatId: this.props.chats[0].id,
          hashUsed: true,
        });
      }
    }
    if (this.props.location.search !== "") {
      let params = this.QueryStringToJSON(this.props.location.search);
      if (this.props.chats.length > 0) {
        let i;
        this.props.chats.forEach((chat, index) => {
          if (chat.user_creation == params.u) {
            i = index;
          }
        });

        if (this.state.index != i && this.state.fisrt.u !== params.u) {
          this._changeUserCam(this.props.chats[i]);
          this.setState({
            index: i,
            fisrt: params,
            from: this.props.chats[i].from,
            chatId: this.props.chats[i].id,
          });
        }
      }
    }
    if (
      this.state.index !== undefined &&
      this.props.chats[this.state.index] !== undefined
    ) {
      if (this.state.from != this.props.chats[this.state.index].from) {
        this.setState({ from: this.props.chats[this.state.index].from });
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
    const { chats: chatsPrev } = prevProps
    const { chats } = this.props
    if (chats && chatsPrev && !_.isEqual(_.sortBy(chats), _.sortBy(chatsPrev))) {
      this.setState({ chats: chats })
    }
    if (
      this.props.location.hash !== "" &&
      this.state.index != 0 &&
      this.state.hashUsed === false
    ) {
      if (this.props.chats[0] !== undefined) {
        this.setState({ index: 0, from: this.props.chats[0].from });
        this._changeUserCam(this.props.chats[0]);
        this.setState({
          index: 0,
          // from: this.props.chats[0].from,
          chatId: this.props.chats[0].id,
          hashUsed: true,
        });
      }
    }
    if (this.props.location.search !== "") {
      let params = this.QueryStringToJSON(this.props.location.search);
      if (this.props.chats.length > 0) {
        let i;
        this.props.chats.forEach((chat, index) => {
          if (chat.user_creation == params.u) {
            i = index;
          }
        });

        if (this.state.index != i && this.state.fisrt.u !== params.u) {
          this._changeUserCam(this.props.chats[i]);
          this.setState({
            index: i,
            fisrt: params,
            // from: this.props.chats[i].from,
            chatId: this.props.chats[i].id,
          });
        }
      }
    }
    if (
      this.state.index !== undefined &&
      this.props.chats[this.state.index] !== undefined
    ) {
      if (this.state.from != this.props.chats[this.state.index].from) {
        // this.setState({ from: this.props.chats[this.state.index].from });
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
