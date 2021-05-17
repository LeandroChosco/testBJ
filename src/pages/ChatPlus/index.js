import React, { Component } from "react";
import { Card, Icon, Input, Dropdown, Tab } from "semantic-ui-react";

import "./style.css";
// import firebaseC5 from "../../constants/configC5";
import CameraStream from "../../components/CameraStream";
// import constants from "../../constants/constants";
import MapContainer from "../../components/MapContainer";
// import Axios from "axios";
import moment from "moment";
import _ from "lodash";

import FadeLoader from "react-spinners/FadeLoader";

import firebaseC5Benito from "../../constants/configC5CJ";

const refSOS = firebaseC5Benito
  .app("c5benito")
  .firestore()
  .collection("messages");

const COLORS = {
  c5: "ffaa20",
  Fuego: "#cd0a0a",
  Policia: "#0f4c75",
  Médico: "#28df99",
};

const SEARCHOPTIONS = [
  {
    key: "name",
    text: "Nombre de Usuario",
    value: "name",
  },
  {
    key: "date",
    text: "Fecha",
    value: "date",
  },
];

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
    firebaseSub: null,
    tabIndex: 0,
    flagUpdate: 0,
  };
  panes = this.props.history.location.pathname.includes("chat")
    ? [
      {
        menuItem: "C5",
        render: () => (
          <Tab.Pane attached={false} style={styles.tab}>
            {" "}
            {this.renderListChats("C5")}
          </Tab.Pane>
        ),
      },
    ]
    : [
      {
        menuItem: "Policia",
        render: () => (
          <Tab.Pane attached={false} style={styles.tab}>
            {this.renderListChats("Policia")}
          </Tab.Pane>
        ),
      },
      {
        menuItem: "Fuego",
        render: () => (
          <Tab.Pane attached={false} style={styles.tab}>
            {this.renderListChats("Fuego")}
          </Tab.Pane>
        ),
      },
      {
        menuItem: "Medico",
        render: () => (
          <Tab.Pane attached={false} style={styles.tab}>
            {this.renderListChats("Médico")}
          </Tab.Pane>
        ),
      },
    ];

  FILTERSOPTIONS = this.props.history.location.pathname.includes("chat")
    ? [undefined]
    : ["Policia", "Fuego", "Médico"];

  filterAction = (event) => {
    const {
      target: { value },
    } = event;
    const { activeIndex } = this.state;
    const { chats: chatsProps } = this.props;
    const { optionSelected, searching } = this.state;
    this.setState({ searching: value.trim() }, () => {
      let filterData = chatsProps;
      if (this.props.history.location.pathname.includes("alarm")) {
        filterData = chatsProps.filter(
          (c) => c.alarmType === this.FILTERSOPTIONS[activeIndex]
        );
      }
      let expresion = new RegExp(`${searching}.*`, "i");
      if (searching.trim().length !== 0) {
        let newFilterSearch;
        if (optionSelected === "alertType") {
          newFilterSearch = filterData.filter(
            (c) => c.trackingType && expresion.test(c.trackingType)
          );
        } else if (optionSelected === "date") {
          newFilterSearch = filterData.filter((c) =>
            expresion.test(
              moment(moment(c.create_at)).format("DD-MM-YYYY, HH:mm:ss")
            )
          );
        } else if (optionSelected === "name") {
          newFilterSearch = filterData.filter((c) =>
            expresion.test(c.user_name)
          );
        }
        this.setState({ chats: newFilterSearch });
      }
      if (value.trim().length === 0) {
        let newChats = chatsProps;
        if (this.props.history.location.pathname.includes("alarm")) {
          newChats = chatsProps.filter(
            (c) => c.alarmType === this.FILTERSOPTIONS[activeIndex]
          );
        }
        this.setState({ chats: newChats });
      }
    });
  };

  handleChangeOption = (e, { value }) =>
    this.setState({ optionSelected: value });

  renderListChats = (type) => {
    const { index, chats } = this.state;
    return (
      <div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Input
            placeholder="Buscar alertas"
            style={{ flex: 2 }}
            onChange={this.filterAction}
          ></Input>
          <Dropdown
            placeholder="Buscar por"
            fluid
            selection
            options={SEARCHOPTIONS}
            defaultValue="name"
            onChange={this.handleChangeOption}
            style={{ flex: 1 }}
          />
        </div>
        <div
          style={{
            height: "81vh",
            overflow: "scroll",
            backgroundColor: "#dadada",
            padding: "20px",
          }}
        >
          {chats.map((chat, i) => {
            const date =
              chat && chat.create_at
                ? moment(chat.create_at).format("DD-MM-YYYY, HH:mm:ss")
                : moment(chat.lastModification).format("DD-MM-YYYY, HH:mm:ss");

            let badgeNumber = 0;
            if (this.state.chatId) {
              badgeNumber = this.state.chatId === chat.id ? 0 : chat.c5Unread;
            }
            return (
              <Card
                className={i === index ? "activeChat" : ""}
                style={{ width: "100%" }}
                key={i}
                onClick={() => this.changeChat(chat, i)}
              >
                <Card.Content>
                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <h4>{chat.user_name}</h4> <p>{date}</p>
                    </div>
                    {chat.active !== undefined && chat.active ? (
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
                      </p>
                    ) : (
                      <p></p>
                    )}

                    {chat.c5Unread !== undefined && badgeNumber !== 0 ? (
                      <div
                        className="notificationNumber"
                        style={{ marginTop: 15 }}
                      >
                        <p>{chat.c5Unread}</p>
                      </div>
                    ) : null}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                      }}
                    >
                      {/* <div > <small style={{ ...styles.badge, marginLeft: 3, alignSelf: "flex-end", display: "flex" }}> <Icon name={chat.active ? "clock" : "checkmark"}></Icon> <strong>{chat.active ? "Proceso" : null}</strong> </small></div> */}
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

  render() {
    const { alarmIndex } = this.props.match.params;
    const {
      chats,
      chatId,
      index,
      loading,
      camData,
      personalInformation,
    } = this.state;
    if (index !== undefined && chatId === "" && chats.length > 0) {
      this.setState({ chatId: null });
    }
    const chatSelected = chats && chats[index];

    let textareaDisabled = null;

    if (chatSelected) {
      if (typeof chatSelected.active === "undefined") {
        textareaDisabled = false;
      } else {
        if (chatSelected.active === 0) {
          textareaDisabled = true;
        } else {
          textareaDisabled = false;
        }
      }
    }

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
              defaultActiveIndex={alarmIndex ? alarmIndex : 0}
              onTabChange={(t, i) => {
                const { chats } = this.props;
                const { index } = this.state;
                let newChats = chats.filter(
                  (e) => e.alarmType === this.FILTERSOPTIONS[i.activeIndex]
                );
                if (index) {
                  let selected =
                    newChats.length !== 0 && newChats[index]
                      ? newChats[index].alarmType
                      : newChats[0].alarmType;
                  this.setState({
                    from: selected ? selected : "Error getting data",
                  });
                }
                this.setState({
                  chats: newChats,
                  activeIndex: i.activeIndex,
                  index: null,
                  tabIndex: i.activeIndex,
                });
              }}
            />
          </div>
          <div className="col-8">
            <div className="messages">
              {!loading && chatId !== "" && chats[index] ? (
                <div className="cameraView">
                  <h2
                    className={"Chat C5"}
                    style={{
                      textAlign: "center",
                      backgroundColor:
                        COLORS[
                        chats[index].alarmType ? chats[index].alarmType : "c5"
                        ],
                      height: "30px",
                    }}
                  >
                    {chats[index].alarmType
                      ? chats[index].alarmType
                      : "Chat C5"}
                  </h2>
                  <div className="row" style={{ height: "70%", margin: 0 }}>
                    <div className="col" style={{ height: "100%" }}>
                      {chats[index].user_cam.google_cordenate !== undefined ? (
                        <MapContainer
                          options={{
                            center: {
                              lat: parseFloat(
                                chats[index].user_cam.google_cordenate.split(
                                  ","
                                )[0]
                              ),
                              lng: parseFloat(
                                chats[index].user_cam.google_cordenate.split(
                                  ","
                                )[1]
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
                      ) : (
                        <MapContainer
                          options={{
                            center: {
                              lat: parseFloat(chats[index].location.latitude),
                              lng: parseFloat(chats[index].location.longitude),
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
                    <div
                      className="col camContainerChatDiv"
                      style={{ height: "100%" }}
                    >
                      {camData !== undefined ? (
                        <CameraStream
                          hideTitle
                          height="250px"
                          hideButton
                          hideInfo
                          propsIniciales={this.props}
                          marker={(camData)}
                        />
                      ) : (
                        <p>Sin camara asignada...</p>
                      )}
                    </div>
                  </div>

                  <div
                    className="row"
                    style={{
                      height: "20%",
                      width: "100%",
                      margin: 0,
                      marginTop: "5px",
                    }}
                  >
                    <Card style={{ width: "100%" }}>
                      <Card.Content>
                        <div className="row">
                          <div className="col-8">
                            <div className="row" style={{ padding: "5px" }}>
                              <div
                                className="col-6"
                                style={{ fontSize: 13, paddingRight: 0 }}
                              >
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
                                <b>Celular: </b> {chats[index].user_cam.phone}
                              </div>
                            </div>
                            <div className="row" style={{ padding: "5px" }}>
                              <div
                                className="col-12"
                                style={{ fontSize: 13, paddingRight: 0 }}
                              >
                                <b>Dirección: </b>
                                {chats[index].user_cam.street}{" "}
                                {chats[index].user_cam.number},{" "}
                                {chats[index].user_cam.town},{" "}
                                {chats[index].user_cam.township}
                              </div>
                            </div>
                            <div className="row" style={{ padding: "5px" }}>
                              <div
                                className="col-12"
                                style={{ fontSize: 13, paddingRight: 0 }}
                              >
                                {chats[index].user_cam.entrecalles ? (
                                  <p>
                                    <b>Entre Calles: </b>
                                    {chats[index].user_cam.entrecalles}
                                    {console.log("chats ", chats[index])}
                                  </p>
                                ) : null}
                              </div>
                            </div>
                            {personalInformation.alarmType ? (
                              <div className="row" style={{ padding: "5px" }}>
                                <div
                                  className="col-6"
                                  style={{ fontSize: 13, paddingRight: 0 }}
                                >
                                  <b>Descripción: </b>
                                  {personalInformation.description
                                    ? personalInformation.description
                                    : ""}
                                </div>
                                <div
                                  className="col-3"
                                  style={{
                                    fontSize: 13,
                                    paddingLeft: 0,
                                    paddingRight: 0,
                                  }}
                                >
                                  <b>Alarma: </b>{" "}
                                  {personalInformation.alarmType
                                    ? personalInformation.alarmType
                                    : ""}
                                </div>
                                <div
                                  className="col-3"
                                  style={{
                                    fontSize: 13,
                                    paddingLeft: 0,
                                    paddingRight: 0,
                                  }}
                                >
                                  <b>Alarma NS: </b>{" "}
                                  {personalInformation.alarmSN
                                    ? personalInformation.alarmSN
                                    : ""}
                                </div>
                              </div>
                            ) : null}
                          </div>
                          <div
                            className="col-4"
                            style={{ margin: "auto" }}
                          ></div>
                        </div>
                      </Card.Content>
                    </Card>
                  </div>
                </div>
              ) : null}
              <div className="messagesContainer" id="messagesContainer">
                {!loading && chatId !== "" && chats[index] ? (
                  chats[index].messages ? (
                    this.state.messages !== undefined &&
                    this.state.messages.map((value, ref) => (
                      <div
                        key={ref}
                        className={value.from === "user" ? "user" : "support"}
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
                            ? moment(value.dateTime.toDate()).format("DD-MM-YYYY, HH:mm:ss")
                            : null}
                        </small>
                      </div>
                    ))
                  ) : loading === true ? (
                    <>
                      <FadeLoader
                        height={20}
                        width={7}
                        radius={20}
                        margin={5}
                        loading={loading}
                        css={styles.centered}
                      />
                      <p style={{ position: "fixed", top: "56%", left: "62%" }}>
                        Cargando chat
                      </p>
                    </>
                  ) : (
                    <p style={{ position: "fixed", top: "50%", left: "60%" }}>
                      No se ha seleccionado ningun chat
                    </p>
                  )
                ) : loading === true ? (
                  <>
                    <FadeLoader
                      height={20}
                      width={7}
                      radius={20}
                      margin={5}
                      loading={loading}
                      css={styles.centered}
                    />
                    <p style={{ position: "fixed", top: "56%", left: "62%" }}>
                      Cargando chat
                    </p>
                  </>
                ) : (
                  <p style={{ position: "fixed", top: "50%", left: "60%" }}>
                    No se ha seleccionado ningun chat
                  </p>
                )}
              </div>
              {chatId !== "" && chats[index] ? (
                <div className="messages_send_box">
                  {!textareaDisabled ? (
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
                  ) : (
                    <div className="closed-ticked">
                      El ticket ya se encuentra cerrado
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }

  _onMapLoad = (map) => {
    const { chats } = this.props;
    const { index } = this.state;
    if (chats[index].user_cam.google_cordenate !== undefined) {
      const coords = {
        lat: parseFloat(chats[index].user_cam.google_cordenate.split(",")[0]),
        lng: parseFloat(chats[index].user_cam.google_cordenate.split(",")[1]),
      };
      this.setState({ map: map });
      new window.google.maps.Marker({
        position: coords,
        map: map,
        title: chats[index].user_nicename,
      });
    } else {
      const coords = {
        lat: parseFloat(chats[index].location.latitude),
        lng: parseFloat(chats[index].location.longitude),
      };
      this.setState({ map: map });
      new window.google.maps.Marker({
        position: coords,
        map: map,
        title: chats[index].user_nicename,
      });
    }
  };

  getUserInfo = (chat) => {
    if (chat) {
      const { user_cam, alarm, alarmType } = chat;
      console.log("camarita", user_cam);
      if (user_cam.active !== undefined && alarm && alarmType) {
        this.setState({
          personalInformation: {
            cellPhone: user_cam.cellPhone,
            address: `
                ${user_cam.street ? user_cam.street : "-"}, 
                ${user_cam.number ? "#" + user_cam.number : "#"},
                ${user_cam.town ? user_cam.town : "-"},
                ${user_cam.township ? user_cam.township : "-"},
                ${user_cam.state ? user_cam.state : "-"},
                `,
            alarmType,
            description: `${alarm.description ? alarm.description : "-"}`,
            alarmSN: `${alarm.serial_number}`,
          },
        });
      }
    }
  };

  changeChat = (chat, i, flag = true) => {
    this.getUserInfo(chat);
    if (flag) {
      if (this.props.history.location.pathname.includes("chat")) {
        this.props.history.push(`/chat/${this.state.activeIndex}/${chat.id}`);
      } else {
        this.props.history.push(`/alarm/${this.state.activeIndex}/${chat.id}`);
      }
      refSOS
        .doc(chat.id)
        .update({ c5Unread: 0 })
        .then(() => {
          this.setState({ from: "Chat C5" });
        });
    }
    if (chat === undefined && i === -1) {
      if (this.props.history.location.pathname.includes("chat")) {
        this.props.history.push("/chat");
      } else {
        this.props.history.push("/alarm");
      }
    } else {
      this.getMessages(chat.id);
      this.setState({ loading: true, camData: undefined }, () => {
        this._changeUserCam(chat);
        this.props.stopNotification();

        this.setState({
          // chatId: chat.id,
          // messages: chat.messages,
          index: i,
          from: chat.from,
          loading: false,
          alarmType: chat.alarmType,
          alarm: chat.alarm,
        });
        refSOS
          .doc(chat.id)
          .update({ c5Unread: 0 })
          .then(() => {
            this.setState({ text: "", from: "Chat C5" });
          });
      });
    }
  };

  /* changeChat = (chat, i, flag = true) => {
    if (flag) {
      this.props.history.push(`/sos/${this.state.activeIndex}/${chat.id}`)
    }
    if (chat === undefined && i === -1) {
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
              this.setState({ text: '', from: 'Chat C5' })
            })
        }
      );
    }
  }; */

  getMessages = (chatId) => {
    // const {chatFirebase, chats} = this.props
    // const indexChat = chats.findIndex(e => e.id === chatId)
    // this.setState({messages: chats[indexChat].messages, chatId})
    this.messageListener = refSOS.doc(chatId).onSnapshot((snapShot) => {
      this.setState({ messages: snapShot.get("messages"), chatId });
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

  closeChat = () => {
    /*let {chats} = this.props
     */
  };

  sendMessage = () => {
    if (this.state.text === "") return;
    const { chatId, messages } = this.state;

    let messagesAux = messages.map((e) => e);

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

  componentDidMount() {
    const { alarmIndex } = this.props.match.params;
    if (this.props.chats) {
      if (alarmIndex) {
        this.setState({ chats: this.props.chats, activeIndex: alarmIndex });
      } else {
        const filtered_chats = this.props.chats.filter(
          (item) => item.alarmType === this.FILTERSOPTIONS[this.state.tabIndex]
        );
        this.setState({ chats: filtered_chats });
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

  componentWillUnmount() {
    this.setState({
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
        alarmSN: null,
      },
      optionSelected: "name",
      marker: null,
      firebaseSub: null,
      tabIndex: 0,
      flagUpdate: 0,
    });
  }

  componentDidUpdate(prevProps) {
    const { alarmIndex, chatId } = this.props.match.params;
    const { chats: chatsPrev } = prevProps;
    const { chats } = this.props;
    // if (this.state.flagUpdate === 0) {
    if (chatsPrev !== chats) {
      if (
        chats &&
        chatsPrev &&
        !_.isEqual(_.sortBy(chats), _.sortBy(chatsPrev))
      ) {
        if (chatsPrev.length !== chats.length) {
          this.setState({ chats });
        }
        switch (parseInt(alarmIndex)) {
          case 0:
            if (this.props.history.location.pathname.includes("chat")) {
              const chatsC5 = this.props.chats.filter((e) => !e.alarmType);
              this.setState({ chats: chatsC5, flagUpdate: 1 });
              if (chatId) {
                const indexC5 = chatsC5.findIndex((e) => e.id === chatId);
                this.changeChat(chatsC5[indexC5], indexC5, false);
              }
            } else {
              const policeChats = this.props.chats.filter(
                (e) => e.alarmType === "Policia"
              );
              this.setState({ chats: policeChats, flagUpdate: 1 });
              if (chatId) {
                const indexPolice = policeChats.findIndex(
                  (e) => e.id === chatId
                );
                this.changeChat(policeChats[indexPolice], indexPolice, false);
              }
            }
            // if(this.state.beforeChange){
            // }
            break;
          case 1:
            const fireChats = this.props.chats.filter(
              (e) => e.alarmType === "Fuego"
            );
            this.setState({ chats: fireChats, flagUpdate: 1 });
            if (chatId) {
              const indexFire = fireChats.findIndex((e) => e.id === chatId);
              this.changeChat(fireChats[indexFire], indexFire, false);
            }
            // if(this.state.beforeChange){
            // }
            break;
          case 2:
            const medicChats = this.props.chats.filter(
              (e) => e.alarmType === "Médico" || e.alarmType === "medico"
            );
            this.setState({ chats: medicChats, flagUpdate: 1 });
            if (chatId) {
              const indexMedic = medicChats.findIndex((e) => e.id === chatId);
              this.changeChat(medicChats[indexMedic], indexMedic, false);
            }
            // if(this.state.beforeChange){
            // }
            break;
          default:
            let chats = [];
            if (this.props.history.location.pathname.includes("chat")) {
              chats = this.props.chats.filter((e) => !e.alarmType);
            } else {
              chats = this.props.chats.filter(
                (e) => e.alarmType === this.FILTERSOPTIONS[this.state.tabIndex]
              );
            }
            console.log("EN EL DEFAULT");
            this.setState({ chats, flagUpdate: 1 });
            break;
        }
      }
    }
    // }
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
    paddingBottom: 2,
  },
  tab: { backgroundColor: "#dadada", borderWidth: 0, borderColor: "#dadada" },
  centered: {
    left: "51%",
  },
};
