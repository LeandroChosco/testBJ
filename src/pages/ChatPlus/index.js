import React, { Component } from "react";
import { Card, /*Icon,*/ Input, Tab, /*Radio*/ } from "semantic-ui-react";
import FadeLoader from "react-spinners/FadeLoader";
import Spinner from 'react-bootstrap/Spinner';
import { Button } from "react-bootstrap";

import { apolloClient } from "../../App";

import CameraStream from "../../components/CameraStream";
import constants from "../../constants/constants";
import MapContainer from "../../components/MapContainer";
import moment from "moment";
import _ from "lodash";
import { GET_CAMERA_INFO, GET_USER_INFO } from "../../graphql/queries";
import noChat from "../../assets/images/noChat.png"
import noCamera from "../../assets/images/noCamera.png"


import firebaseC5Benito from "../../constants/configC5CJ";
// import firebaseSos from "../../constants/configSOS";
import "./style.css";
import conections from "../../conections";
import { LANG, MODE } from "../../constants/token";
// import { MESSAGES_COLLECTION } from "../../Api/sos";
import chatGeneral from '../../historial/BJ_Chat-General.json';
// import { fakeChats } from "./fakeData";

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

// const SEARCHOPTIONS = [
//   {
//     key: "name",
//     text: "Nombre de Usuario",
//     value: "name",
//   },
//   {
//     key: "date",
//     text: "Fecha",
//     value: "date",
//   },
// ];

// const SEARCHENGLISHOPTIONS = [
//   {
//     key: "name",
//     text: "User name",
//     value: "name",
//   },
//   {
//     key: "date",
//     text: "Date",
//     value: "date",
//   },
// ];


const session_user = JSON.parse(sessionStorage.getItem("isAuthenticated"))

const user_data = {
  name: session_user ? session_user.userInfo.user_nicename : "",
  email: session_user ? session_user.userInfo.user_email : "",
  from: session_user ? session_user.userInfo.role_id : "",
}

const token = localStorage.getItem("accessToken");

const initialHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

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
    loadingChat: false,
    infoCurrentCamera: {},
    idClient: null,
    statusCurrentChat: true,
    showHistorial: true,
    loadingHistorial: false,
    currentHistorial: {},
    currentHeight: initialHeight,
  };
  panes = this.props.history.location.pathname.includes("chat")
    ? [
      {
        menuItem: "Chat C2",
        render: () => (
          <Tab.Pane attached={false} style={{ backgroundColor: "transparent", borderWidth: 0, borderColor: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "#2e597d" : "#dadada" }}>
            {" "}
            {this.renderListChats("C5")}
          </Tab.Pane>
        ),
      },
    ]
    : [
      {
        menuItem: localStorage.getItem(LANG) === "english" ? "Police" : "Policía",
        render: () => (
          <Tab.Pane attached={false} style={{ backgroundColor: "transparent", borderWidth: 0, borderColor: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "#2e597d" : "#dadada" }}>
            {this.renderListChats("Policia")}
          </Tab.Pane>
        ),
      },
      {
        menuItem: localStorage.getItem(LANG) === "english" ? "Fire" : "Fuego",
        render: () => (
          <Tab.Pane attached={false} style={{ backgroundColor: "transparent", borderWidth: 0, borderColor: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "#2e597d" : "#dadada" }}>
            {this.renderListChats("Fuego")}
          </Tab.Pane>
        ),
      },
      {
        menuItem: localStorage.getItem(LANG) === "english" ? "Doctor" : "Médico",
        render: () => (
          <Tab.Pane attached={false} style={{ backgroundColor: "transparent", borderWidth: 0, borderColor: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "#2e597d" : "#dadada" }}>
            {this.renderListChats("Médico")}
          </Tab.Pane>
        ),
      },
    ];

  panesHistorial = [
    {
      menuItem: "Historial C2",
      render: () => (
        <Tab.Pane attached={false} style={{ backgroundColor: "transparent", borderWidth: 0, borderColor: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "#2e597d" : "#dadada" }}>
          {" "}
          {this.renderListHistorial("C5")}
        </Tab.Pane>
      ),
    },
  ];

  FILTERSOPTIONS = this.props.history.location.pathname.includes("chat")
    ? [undefined]
    : ["Policia", "Fuego", "Médico"];

  // filterAction = (event) => {
  //   const {
  //     target: { value },
  //   } = event;
  //   const { activeIndex } = this.state;
  //   const { chats: chatsProps, /*setChats, getChats*/ } = this.props;
  //   const { optionSelected, searching } = this.state;
  //   this.setState({ searching: value.trim() }, () => {
  //     let filterData = chatsProps;
  //     if (this.props.history.location.pathname.includes("alarm")) {
  //       filterData = chatsProps.filter(
  //         (c) => c.alarmType === this.FILTERSOPTIONS[activeIndex]
  //       );
  //     }
  //     let expresion = new RegExp(`${searching}.*`, "i");
  //     if (searching.trim().length !== 0) {
  //       let newFilterSearch;
  //       if (optionSelected === "alertType") {
  //         newFilterSearch = filterData.filter(
  //           (c) => c.trackingType && expresion.test(c.trackingType)
  //         );
  //       } else if (optionSelected === "date") {
  //         newFilterSearch = filterData.filter((c) =>
  //           expresion.test(
  //             moment(moment(c.create_at)).format("DD-MM-YYYY, HH:mm:ss")
  //           )
  //         );
  //       } else if (optionSelected === "name") {
  //         newFilterSearch = filterData.filter((c) =>
  //           expresion.test(c.user_name)
  //         );
  //       }
  //       // console.log(newFilterSearch)
  //       // setChats(newFilterSearch);
  //       // this.setState({ chats: newFilterSearch });
  //     }
  //     // if (value.trim().length === 0) {
  //     //   let newChats = chatsProps;
  //     //   if (this.props.history.location.pathname.includes("alarm")) {
  //     //     newChats = chatsProps.filter(
  //     //       (c) => c.alarmType === this.FILTERSOPTIONS[activeIndex]
  //     //     );
  //     //   }
  //     //   // setChats(newChats);
  //     //   // this.setState({ chats: newChats });
  //     // }
  //   });
  // };

  _getClient = () => {
    conections.getClients().then(res => {
      if (this.state.idClient !== res.data.data.getClients.filter(el => el.name === constants.client)[0].id) {
        this.setState({ idClient: res.data.data.getClients.filter(el => el.name === constants.client)[0].id })
      }
    });
  };

  handleChangeOption = (e, { value }) =>
    this.setState({ optionSelected: value });

  renderListChats = (type) => {
    const { index, currentHeight } = this.state;
    const { chats, /*setSOS,*/ getChats } = this.props

    if (chats.length === 0) {
      getChats();
    }

    // let chats = fakeChats;

    return (
      <div style={{ padding: "1rem" }}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          {/* <Input
            placeholder={localStorage.getItem(LANG) === "english" ? "🔎 Search" : "🔎 Buscar"}
            style={{ flex: 2, height: "5rem", borderRadius: "0.75rem !important" }}
            onChange={this.filterAction}
          ></Input> */}
          <div className="ui input"
            style={{ flex: 2, height: "4rem" }}
          // onChange={this.filterAction}
          >
            <input className="input" style={{ borderRadius: "1rem" }} placeholder={localStorage.getItem(LANG) === "english" ? "🔎   Search" : "🔎   Buscar"} />
          </div>
        </div>
        <h1>Chat</h1>
        <div
          className="container-chats"
          style={{
            height: currentHeight < 930 ? "47rem" : currentHeight > 930 && currentHeight < 1000 ? "53rem" : currentHeight > 1000 && currentHeight < 1100 ? "58rem" : currentHeight > 1100 && currentHeight < 1200 ? "64rem" : currentHeight > 1200 && currentHeight < 1300 ? "71rem" : currentHeight > 1300 && currentHeight < 1430 ? "75rem" : "87rem",
            overflowY: "scroll",
            backgroundColor: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "#2e597d" : "transparent",
            border: "solid 1px #f2f3f4"
          }}
        >
          {chats && chats.length > 0 ?
            chats.map((chat, i) => {

              const date = this.validateChat(chat);
              // let badgeNumber = 0;
              // if (this.state.chatId) {
              //   badgeNumber = this.state.chatId === chat.id ? 0 : chat.c5Unread;
              // }
              return (
                <div
                  className={i === index ? "card-chat activeChat" : "card-chat"}
                  style={{ width: "100%", background: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) && "var(--dark-mode-color)", color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "#666666", transition: "all 0.2s linear", margin: "0 !important", }}
                  key={i}
                  onClick={() => this.changeChat(chat, i)}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div className="avatar-img">
                      <b>
                        {(chat.user_name.split(" ").length > 1 && chat.user_name.split(" ")[1] !== "") ? `${chat.user_name.split(" ")[0][0].toUpperCase()}${chat.user_name.split(" ")[1][0].toUpperCase()}` : chat.user_name[0].toUpperCase()}
                      </b>
                    </div>
                    <div className='col'>
                      <h3 style={{ marginRight: "0.3rem" }}>{chat.user_name}</h3>
                      <p>{chat.messages[chat.messages.length - 1].msg.length < 28 ? chat.messages[chat.messages.length - 1].msg : `${chat.messages[chat.messages.length - 1].msg.slice(0, 26)}...`}</p>
                    </div>
                  </div>
                  <div style={{ display: "grid", alignItems: "center", justifyContent: "flex-end" }}>
                    <p style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "#666666", transition: "all 0.2s linear" }}>{date}</p>
                    {chat.c5Unread > 0 &&
                      <div style={{ display: "grid", width: "100%", justifyContent: "flex-end" }}>
                        <div className="notificationNumber">
                          <p>{chat.c5Unread}</p>
                        </div>
                      </div>
                    }
                  </div>
                  {/* {chat.active !== undefined && chat.active ? (
                  <p style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "#666666", transition: "all 0.2s linear" }}>
                    {chat.messages
                      ? chat.messages.length > 0
                        ? (chat.messages[chat.messages.length - 1].from ===
                          "user"
                          ? chat.user_name.split(" ")[0]
                          : "C5") +
                        ": " +
                        chat.messages[chat.messages.length - 1].msg //msg
                        : localStorage.getItem(LANG) === "english" ? "No messages to show" : "No hay mensajes que mostrar"
                      : localStorage.getItem(LANG) === "english" ? "No messages to show" : "No hay mensajes que mostrar"}
                  </p>
                ) : (
                  <p></p>
                )} */}

                </div>
              );
            })
            : <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
              <Spinner animation="border" variant="info" role="status" size="xl" />
            </div>
          }
        </div>
      </div>
    );
  };

  renderListHistorial = (type) => {
    const { index } = this.state;
    // const { setChats, setSOS } = this.props

    let chats;

    if (type === "C5") {
      chats = chatGeneral;
    }

    return (
      <div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Input
            placeholder={localStorage.getItem(LANG) === "english" ? "Search user" : "Buscar usuario"}
            style={{ flex: 2 }}
          // onChange={this.filterAction}
          ></Input>
          {/* <Dropdown
              placeholder={localStorage.getItem(LANG) === "english" ? "Search by" : "Buscar por"}
              fluid
              selection
              options={localStorage.getItem(LANG) === "english" ? SEARCHENGLISHOPTIONS : SEARCHOPTIONS}
              defaultValue="name"
              onChange={this.handleChangeOption}
              style={{ flex: 1 }}
            /> */}
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

            // let badgeNumber = 0;
            // if (this.state.chatId) {
            //   badgeNumber = this.state.chatId === chat.id ? 0 : chat.c5Unread;
            // }
            return (
              <Card
                className={i === index ? "activeChat" : ""}
                style={{ width: "100%", margin: "0 !important" }}
                key={i}
                onClick={() => this.changeHistorial(chat, i)}
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
                      <h4 style={{ marginRight: "0.3rem" }}>{chat.user_name}</h4> <p>{date !== "Fecha inválida" ? date : chat.updateDate}</p>
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
                            : localStorage.getItem(LANG) === "english" ? "No messages to show" : "No hay mensajes que mostrar"
                          : localStorage.getItem(LANG) === "english" ? "No messages to show" : "No hay mensajes que mostrar"}
                      </p>
                    ) : (
                      <p></p>
                    )}

                    {/* {chat.c5Unread !== undefined && badgeNumber !== 0 ? (
                      <div
                        className="notificationNumber"
                        style={{ marginTop: 15 }}
                      >
                        <p>{chat.c5Unread}</p>
                      </div>
                    ) : null} */}
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
  }

  formatChat = (date) => moment(date).format("DD-MM-YYYY");

  validateChat = (chat) => {

    const nowDate = new Date();
    const formatNow = moment(nowDate).format("DD-MM-YYYY");

    const date =
      chat && chat.updateDate ?
        this.formatChat(chat.updateDate) === formatNow ? moment(chat.updateDate).format("HH:mm") : moment(chat.updateDate).format("DD/MM/YYYY")
        : chat.create_at
          ? this.formatChat(chat.create_at) === formatNow ? moment(chat.create_at).format("HH:mm") : moment(chat.create_at).format("DD/MM/YYYY")
          : this.formatChat(chat.lastModification) === formatNow ? moment(chat.lastModification).format("HH:mm") : moment(chat.lastModification).format("DD/MM/YYYY");

    return date;
  }

  _changeView = () => {
    let { showHistorial } = this.state;

    if (window.location.pathname.includes("chat")) {
      this.props.history.push(`/chat`)
    }

    this.setState({ showHistorial: !showHistorial, loadingHistorial: true, currentHistorial: {}, index: "" });

    setTimeout(() => {
      this.setState({ loadingHistorial: false });
    }, 6000);

  }

  render() {
    // const { alarmIndex } = this.props.match.params;
    const {
      chatId,
      index,
      loading,
      camData,
      // personalInformation,
      loadingChat,
      infoCurrentCamera,
      // loadingHistorial,
      showHistorial,
      currentHistorial,
      currentHeight,
    } = this.state;
    const { chats } = this.props
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

    if (!this.state.idClient) {
      this._getClient();
    };

    return (
      <div
        className={
          !this.props.showMatches
            ? "hide-matches app-container"
            : "show-matches app-container"
        }
      >
        <div className="row fullHeight" style={{ background: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) && "#0c304e", transition: "all 0.2s linear" }}>
          <div className="col-3 userList" style={{ background: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) && "#2e597d", transition: "all 0.2s linear" }}>
            {this.renderListChats("C5")}
          </div>
          <div className="col-9" style={{ background: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) && "var(--dark-mode-color)", transition: "all 0.2s linear" }}>
            {
              loadingChat ?
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
                  <Spinner style={{ marginTop: "3rem" }} animation="border" variant="info" role="status" size="xl" />
                </div>
                :
                !showHistorial ? Object.keys(currentHistorial).length === 0 ?
                  <>
                    <p style={{ position: 'fixed', top: '50%', left: '60%' }}>No se ha seleccionado ningún chat</p>
                  </>
                  :
                  <>
                    <div className='messages' style={{ height: '88%' }}>
                      <div className='historialView' style={{ height: '100% !important' }}>
                        <h2
                          className={'Chat C5'}
                          style={{
                            textAlign: 'center',
                            backgroundColor: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "var(--dark-mode-color)" : COLORS.c5,
                            height: '30px'
                          }}
                        >
                          {currentHistorial.from}
                        </h2>
                        <div className='row' style={{ height: '100%', width: '100%', margin: 0, marginTop: '5px' }}>
                          <Card style={{ width: '100%' }}>
                            <Card.Content>
                              <div className='row'>
                                <div className='col-9'>
                                  <div className='row'>
                                    <div className='col-6' style={styles.text}>
                                      <b>Nombre: </b>
                                      {currentHistorial.user_name}
                                    </div>
                                    <div className='col' style={styles.text}>
                                      <b>Fecha: </b>
                                      {currentHistorial.lastModification !== "Fecha inválida" ? currentHistorial.lastModification : currentHistorial.updateDate}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className='messagesHistorialContainer' id='messagesContainer' style={{ top: "20% !important", height: "100%", padding: "0.5rem !important" }}>
                                {this.state.messages.map((value, ref) => {
                                  const formatDate = new Date(value.dateTime.seconds * 1000);
                                  return (
                                    <div style={{ display: "flex", margin: value.from === "user" ? "0 0 0 1.5rem" : "0 1.5rem 0 0" }}>
                                      {value.from === "user" &&
                                        <div className="avatar-img">
                                          <b>
                                            TS
                                            {/* {(chats[index].user_name.split(" ").length > 1 && chats[index].user_name.split(" ")[1] !== "") ? `${chats[index].user_name.split(" ")[0][0].toUpperCase()}${chats[index].user_name.split(" ")[1][0].toUpperCase()}` : chats[index].user_name[0].toUpperCase()} */}
                                          </b>
                                        </div>
                                      }
                                      <div
                                        key={ref}
                                        className={value.from === "user" ? "user" : "support"}
                                        ref={"message" + ref
                                        }
                                        id={"message" + ref}
                                      >
                                        <p>{value.msg}</p>
                                        <small>
                                          {value.dateTime.toDate
                                            ?
                                            value.userName || value.userEmail
                                              ?
                                              moment(value.dateTime.toDate()).format("DD-MM-YYYY, HH:mm:ss") + " - " + (value.userName ? value.userName : value.userEmail)
                                              :
                                              moment(value.dateTime.toDate()).format("DD-MM-YYYY, HH:mm:ss")
                                            :
                                            value.userName || value.userEmail
                                              ?
                                              moment(formatDate).format("DD-MM-YYYY, HH:mm:ss") + " - " + (value.userName ? value.userName : value.userEmail)
                                              :
                                              moment(formatDate).format("DD-MM-YYYY, HH:mm:ss")}
                                        </small>
                                      </div>
                                      {value.from !== "user" &&
                                        <div className="avatar-img">
                                          <b>
                                            TS
                                            {/* {(chats[index].user_name.split(" ").length > 1 && chats[index].user_name.split(" ")[1] !== "") ? `${chats[index].user_name.split(" ")[0][0].toUpperCase()}${chats[index].user_name.split(" ")[1][0].toUpperCase()}` : chats[index].user_name[0].toUpperCase()} */}
                                          </b>
                                        </div>
                                      }
                                    </div>
                                  )
                                }
                                )}
                              </div>
                            </Card.Content>
                          </Card>
                        </div>
                      </div>
                    </div>

                  </>
                  :

                  this.state.statusCurrentChat ?

                    <div className="container-chat">
                      <div className='col-7'>
                        <div className="messages">

                          {
                            !loading && chatId !== "" && chats[index] ?
                              <div style={{ display: "grid" }}>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                  <div className="avatar-img">
                                    <b>
                                      {(chats[index].user_name.split(" ").length > 1 && chats[index].user_name.split(" ")[1] !== "") ? `${chats[index].user_name.split(" ")[0][0].toUpperCase()}${chats[index].user_name.split(" ")[1][0].toUpperCase()}` : chats[index].user_name[0].toUpperCase()}
                                    </b>
                                  </div>
                                  <div className='col'>
                                    <h3 style={{ marginRight: "0.3rem" }}>{chats[index].user_name}</h3>
                                  </div>
                                </div>
                                <hr />
                              </div>
                              : null
                          }

                          <div
                            className="messagesContainer"
                            id="messagesContainer"
                            style={{ height: currentHeight < 930 ? "46rem" : currentHeight > 930 && currentHeight < 1000 ? "51rem" : currentHeight > 1000 && currentHeight < 1100 ? "57rem" : currentHeight > 1100 && currentHeight < 1200 ? "64rem" : currentHeight > 1200 && currentHeight < 1300 ? "69rem" : currentHeight > 1300 && currentHeight < 1430 ? "74rem" : "80rem", }}
                          >
                            {!loading && chatId !== "" && chats[index] ? (
                              chats[index].messages ? (
                                this.state.messages !== undefined &&
                                this.state.messages.map((value, ref) => {
                                  const formatDate = new Date(value.dateTime.seconds * 1000);
                                  return (
                                    <div style={{ display: "grid" }}>
                                      <div style={{ display: "flex", margin: value.from === "user" ? "0 0 0 1.5rem" : "0 1.5rem 0 0", alignItems: "center" }}>
                                        {value.from === "user" &&
                                          <div className="avatar-img" style={{ marginRight: "1rem", alignSelf: "flex-end" }}>
                                            <b>
                                              {(chats[index].user_name.split(" ").length > 1 && chats[index].user_name.split(" ")[1] !== "") ? `${chats[index].user_name.split(" ")[0][0].toUpperCase()}${chats[index].user_name.split(" ")[1][0].toUpperCase()}` : chats[index].user_name[0].toUpperCase()}
                                            </b>
                                          </div>
                                        }
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
                                        </div>
                                        {value.from !== "user" &&
                                          <div className="avatar-img" style={{ marginLeft: "1rem", alignSelf: "flex-end" }}>
                                            <b>
                                              {(constants.client.split(" ").length > 1 && constants.client.split(" ")[1] !== "") ? `${constants.client.split(" ")[0][0].toUpperCase()}${constants.client.split(" ")[1][0].toUpperCase()}` : constants.client[0].toUpperCase()}
                                            </b>
                                          </div>
                                        }
                                      </div>
                                      <p style={{ justifySelf: value.from === "user" ? "flex-start" : "flex-end", margin: "0.5rem 4.5rem" }}>
                                        <small>
                                          {moment(formatDate).format("DD-MM-YYYY - HH:mm")}
                                        </small>
                                      </p>
                                    </div>
                                  )
                                }
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
                                    {localStorage.getItem(LANG) === "english" ? "Loading chat" : "Cargando chat"}
                                  </p>
                                </>
                              ) : (
                                <p style={{ position: "fixed", top: "50%", left: "60%", color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) && "white", transition: "all 0.2s linear" }}>
                                  {localStorage.getItem(LANG) === "english" ? "No chat has been selected" : "No se ha seleccionado ningún chat"}
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
                                  {localStorage.getItem(LANG) === "english" ? "Loading chat" : "Cargando chat"}
                                </p>
                              </>
                            ) : (
                              <p style={{ position: "fixed", top: "50%", left: "60%", color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) && "white", transition: "all 0.2s linear" }}>
                                {chats && chats.length > 0 ? localStorage.getItem(LANG) === "english" ? "No chat has been selected" : "No se ha seleccionado ningún chat" : localStorage.getItem(LANG) === "english" ? "Loading chats" : "Cargando chats"}
                              </p>
                            )}
                          </div>

                          {
                            chatId !== "" && chats[index] ? (
                              <div style={{ background: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "var(--dark-mode-bar)" : "transparent", transition: "all 0.2s linear" }}>
                                {!textareaDisabled ? (
                                  <div className="textarea-container">
                                    <textarea
                                      disabled={textareaDisabled}
                                      placeholder={localStorage.getItem(LANG) === "english" ? "Text your message" : "Escriba su mensaje"}
                                      name="text"
                                      autoComplete="on"
                                      autoCorrect="on"
                                      id="messsageTextarea"
                                      value={this.state.text}
                                      onKeyPress={this.checkKey}
                                      onChange={(event) => {
                                        this.setState({ text: event.target.value });
                                      }}
                                      style={{ color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "white" : "#666666", background: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? "transparent" : "white", width: "100%", padding: "1rem 8rem 1rem 1rem" }}
                                    ></textarea>
                                    <button className="btn btn-primary" style={{ transition: "all 0.2s linear", position: "absolute", marginRight: "1.5rem" }} onClick={this.sendMessage}>
                                      Enviar
                                      <i className="fa fa-paper-plane-o" style={{ marginLeft: "0.5rem" }} aria-hidden="true"></i>
                                    </button>
                                    {/* <Icon
                                  name="send"
                                  id="sendbutton"
                                  onClick={this.sendMessage}
                                /> */}
                                  </div>
                                ) : (
                                  <div className="closed-ticked">
                                    {localStorage.getItem(LANG) === "english" ? "The ticket is already closed" : "El ticket ya se encuentra cerrado"}
                                  </div>
                                )}
                              </div>
                            ) : null
                          }
                        </div>
                      </div>
                      <div className='col-5'>
                        {!loading && chatId !== "" && chats[index] ? (
                          <div className="cam-info-map">
                            <div style={{ display: "flex", justifyContent: "center", padding: "3rem 0 0.5rem 0" }}>
                              {camData && !loadingChat ? (
                                <CameraStream
                                  hideTitle
                                  height={currentHeight > 1300 ? "450px" : "300px"}
                                  hideButton
                                  hideInfo
                                  propsIniciales={this.props}
                                  marker={(camData)}
                                  inChat={true}
                                />
                              )
                                :
                                <img style={{ height: currentHeight > 1300 ? "450px" : "300px" }} src={noCamera} alt="NOCAM" />
                              }
                            </div>
                            <div
                              className="row" style={{ padding: "0 1rem", margin: "1.5rem 0", height: "25%", maxHeight: "17rem" }}
                            // style={{
                            //   height: "20%",
                            //   width: "100%",
                            //   margin: 0,
                            //   marginTop: "5px",
                            // }}
                            >
                              <Card style={{ width: "100%", backgroundColor: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) && "var(--dark-mode-bar)", color: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) && "white", transition: "all 0.2s linear", zIndex: 1 }}>
                                <Card.Content>
                                  <div className="row container-personal-information">
                                    <p style={{ width: "100%" }}><b>{localStorage.getItem(LANG) === "english" ? "Name: " : "Nombre: "}</b> {chats[index].user_name}</p>
                                    <p style={{ width: "100%" }}><b>{localStorage.getItem(LANG) === "english" ? "Address " : "Dirección: "}</b>{`${infoCurrentCamera.street ? infoCurrentCamera.street : chats[index].street} ${infoCurrentCamera.number ? infoCurrentCamera.number : chats[index].number} ${infoCurrentCamera.town ? infoCurrentCamera.town : chats[index].town} ${infoCurrentCamera.township ? infoCurrentCamera.township : chats[index].township} (Entre Calles: ${infoCurrentCamera.entrecalles})`}</p>
                                    <p style={{ width: "100%" }}><b>{localStorage.getItem(LANG) === "english" ? "Phone " : "Celular: "}</b> {chats[index].user_cam.phone}</p>
                                    <p style={{ width: "100%" }}><b>{localStorage.getItem(LANG) === "english" ? "Camera " : "Cámara "}</b> {camData && camData.extraData.num_cam}</p>
                                    {/* {personalInformation.alarmType ? (
                                      <div className="row" style={{ padding: "5px" }}>
                                        <div
                                          className="col-6"
                                          style={{ fontSize: 13, paddingRight: 0 }}
                                        >
                                          <b>{localStorage.getItem(LANG) === "english" ? "Description: " : "Descripción: "}</b>
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
                                          <b>{localStorage.getItem(LANG) === "english" ? "Alarm" : "Alarma: "}</b>{" "}
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
                                          <b>{localStorage.getItem(LANG) === "english" ? "NS Alarm" : "Alarma NS: "}</b>{" "}
                                          {personalInformation.alarmSN
                                            ? personalInformation.alarmSN
                                            : ""}
                                        </div>
                                      </div>
                                    ) : null} */}
                                    {
                                      (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ?
                                        <Button style={{ width: "100%" }} className="btn btn-secondary" onClick={this.refreshButton}>{localStorage.getItem(LANG) === "english" ? "Refresh" : "Actualizar"}</Button>
                                        :
                                        <Button style={{ width: "100%" }} onClick={this.refreshButton}>{localStorage.getItem(LANG) === "english" ? "Refresh" : "Actualizar"}</Button>
                                    }
                                  </div>
                                </Card.Content>
                              </Card>
                            </div>
                            <div className="col" style={{ marginTop: "0.5rem", height: currentHeight > 1300 ? "35%" : currentHeight > 1200 ? "40%" : "25%" }}>
                              {infoCurrentCamera.google_cordenate ? (
                                <MapContainer
                                  options={{
                                    center: {
                                      lat: parseFloat(
                                        infoCurrentCamera.google_cordenate.split(
                                          ","
                                        )[0]
                                      ),
                                      lng: parseFloat(
                                        infoCurrentCamera.google_cordenate.split(
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
                              ) : infoCurrentCamera.location ? (
                                <MapContainer
                                  options={{
                                    center: {
                                      lat: parseFloat(infoCurrentCamera.location.latitude),
                                      lng: parseFloat(infoCurrentCamera.location.longitude),
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
                              )
                                :
                                null
                              }
                            </div>
                          </div>
                        ) : null}

                      </div>
                    </div>
                    :
                    <>
                      <div className="row-6" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "15%", width: "75rem", marginTop: "5rem", marginLeft: "3%", padding: "15rem" }}>
                        <img style={{ height: "30rem" }} src={noChat} alt="Imagen-No-Disponible" />
                      </div>
                      <div className="row-6" style={{ display: "flex", width: "95%", height: "auto", padding: "3rem" }}>
                        <Card
                          style={{ display: "flex", padding: "2rem", width: "95%" }}
                        >
                          <Card.Content>
                            <div className="row">
                              <div className="col-10">
                                <div className="col-6" style={{ padding: "5px" }}>
                                  <div
                                    className="row-9"
                                    style={{ fontSize: 13, paddingRight: 0 }}
                                  >
                                    {localStorage.getItem(LANG) === "english" ? "The user " : "El usuario "}
                                    <b>{chats[index] ? chats[index].user_name : ""}</b>
                                    {localStorage.getItem(LANG) === "english" ? " is " : " se encuentra "}
                                    <b>{localStorage.getItem(LANG) === "english" ? "deactivated" : "DESACTIVADO"}</b>
                                  </div>
                                  <br />
                                  <div
                                    className="row-9"
                                    style={{ fontSize: 13, paddingRight: 0 }}
                                  >
                                    <p>{localStorage.getItem(LANG) === "english" ? "Contact support to reactivate this user" : "Contáctese con soporte para reactivar este usuario"}</p>
                                  </div>
                                </div>
                              </div>
                              <div
                                className="col-2"
                                style={{ margin: "auto" }}
                              >
                              </div>
                            </div>
                          </Card.Content>
                        </Card>
                      </div>
                    </>
            }
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
      // console.log("camarita", user_cam);
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

  getInfoC5Radar = async (id) => {

    let responseData;
    await apolloClient.query({
      query: GET_USER_INFO,
      variables: {
        userIdC5: id,
        clientId: this.state.idClient,
      },
      context: {
        headers: {
          "Authorization": token ? token : "",
        }
      }
    }).then(response => {
      responseData = response.data.searchInformationUserDataAdminC5
    })
      .catch(err => {
        this.setState({ infoCurrentCamera: {} })
        console.log(err)
      })

    // if (!loading && data) {
    return responseData
    // } else {
    // console.log("ERROR")
    // }
  }

  getInfoCameraUpdate = async (email) => {
    let responseData;
    // console.log("TA")
    await apolloClient.query({
      query: GET_CAMERA_INFO,
      variables: {
        email: email,
        clientId: this.state.idClient,
      },
      context: {
        headers: {
          "Authorization": token ? token : "",
        }
      }
    }).then(response => {
      responseData = response
    })
      .catch(err => {
        this.setState({ infoCurrentCamera: {} })
        console.log(err)
      })

    // if (!loading && data) {
    return responseData
    // } else {
    // console.log("ERROR")
    // }
  }

  changeChat = async (chat, i, flag = true, newMsg) => {

    const { chats, setChats } = this.props;

    const auxChats = [...chats];
    const findIndex = auxChats.findIndex(el => el.id === chat.id);
    if (auxChats[findIndex]) {
      auxChats[findIndex].c5Unread = 0;
      setChats(auxChats)
    }

    // this.setState({infoCurrentCamera: { }})

    this.getUserInfo(chat);

    // if(this.state.infoCurrentCamera){
    //   this.setState({infoCurrentCamera: { }})
    // }

    if (chat && newMsg !== "NO") {
      this.setState({ loadingChat: true, chatId: chat.id })
      // console.log("ID USER", chat.user_creation)
      // console.log("CHAT", chat.user_cam.num_cam)
      // console.log("CHAT", chat)
      this.getInfoC5Radar(chat.user_creation).then(response => {
        if (response.success) {
          this.setState({ statusCurrentChat: true })
        } else {
          this.setState({ statusCurrentChat: false })
        }
        if (response.responseuserc5[0].user_login) {
          this.getInfoCameraUpdate(response.responseuserc5[0].user_login).then(res => {
            let cameraData = res.data.updateInformationFirebaseCamera.response[0]
            // console.log("CAM NUM", cameraData.num_cam)
            this.setState({ infoCurrentCamera: cameraData })
            this._changeUserCam(cameraData)
          })
            .catch(err => {
              this.setState({ infoCurrentCamera: {} })
              console.log(err)
            })
        }
      })
        .catch(err => {
          this.setState({ infoCurrentCamera: {} })
          console.log(err)
        })
      // }
      setTimeout(() => {
        this.setState({ loadingChat: false })
      }, 2000);
    }

    if (flag) {
      if (this.props.history.location.pathname.includes("chat")) {
        this.props.history.push(`/chat/${this.state.activeIndex}/${chat.id}`);
      } else {
        this.props.history.push(`/alarm/${this.state.activeIndex}/${chat.id}`);
      }
      // refSOS
      //   .doc(chat.id)
      //   .update({c5Unread: 0 })
      //   .then(() => {
      //     this.setState({ from: "Chat C5" });
      //   });
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
          chatId: chat.id,
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
            this.setState({ text: "", from: "Chat C2" });
          });
      });
    }

    setTimeout(() => {
      let messageBody = document.querySelector("#messagesContainer");
      messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
    }, 2010);

  };
  changeHistorial = (chat, i) => {

    this.setState({ messages: chat.messages, currentHistorial: chat, index: i })

    this.getUserInfo(chat);

    if (chat) {
      this.setState({ loadingChat: true })
      this.getInfoC5Radar(chat.user_creation).then(response => {
        if (response.success) {
          this.setState({ statusCurrentChat: true })
        } else {
          this.setState({ statusCurrentChat: false })
        }
        if (response.responseuserc5[0].user_login) {
          this.getInfoCameraUpdate(response.responseuserc5[0].user_login).then(res => {
            let cameraData = res.data.updateInformationFirebaseCamera.response[0]
            // console.log("CAM NUM", cameraData.num_cam)
            this.setState({ infoCurrentCamera: cameraData })
            this._changeUserCam(cameraData)
          })
            .catch(err => {
              this.setState({ infoCurrentCamera: {} })
              console.log(err)
            })
        }
      })
        .catch(err => {
          this.setState({ infoCurrentCamera: {} })
          console.log(err)
        })
      // }
      setTimeout(() => {
        this.setState({ loadingChat: false })
      }, 2000);
    }

    if (this.props.history.location.pathname.includes("chat")) {
      this.props.history.push(`/chat/${this.state.activeIndex}/${chat.id}`);
    }

    this.getMessages(chat.id, true);

    this.setState({ loading: true, camData: undefined }, () => {

      this.props.stopNotification();

      this.setState({
        index: i,
        from: chat.from,
        loading: false,
        alarmType: chat.alarmType,
        alarm: chat.alarm,
      });
    });

  };

  getMessages = (chatId, /*historial*/) => {
    // const { /*chatFirebase,*/ chats } = this.props
    // const indexChat = chats.findIndex(e => e.id === chatId)
    // console.log(indexChat)
    // console.log("chat", chatId)
    // console.log("statechat", this.state.chatId)
    // this.setState({messages: chats[indexChat].messages, chatId })
    this.messageListener = refSOS.doc(chatId).onSnapshot((snapShot) => {
      if (chatId === this.state.chatId) {
        this.setState({ messages: snapShot.get("messages"), chatId });
      }
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

  _changeUserCam = (cameraData) => {
    if (cameraData.UrlStreamMediaServer) {
      this.setState({
        camData: {
          extraData: {
            num_cam: cameraData.num_cam,
            cameraID: cameraData.num_cam,
            isHls: true,
            url: `${cameraData.UrlStreamMediaServer.protocol}://${cameraData.UrlStreamMediaServer.ip_url_ms}${cameraData.UrlStreamMediaServer.name}${cameraData.channel}`,
            dataCamValue: cameraData,
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
    if (this.state.text === "") console.log("MENSAJE VACÍO")
    if (this.state.text === "") return;
    const { chatId, messages } = this.state;

    // VER LINEAS COMENTADAS PARA FINALIZAR ACTIVIDAD

    function formatDate(date) {

      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    // let newMessageDate = moment(new Date()).format("DD-MM-YYYY")
    let messagesAux = messages.map((e) => e);

    messagesAux.push({
      from: user_data.from,
      dateTime: new Date(),
      msg: this.state.text, //msg
      userName: user_data.name,
      userEmail: user_data.email,
    });

    // let obj = {
    //   "seconds": 1662130550,
    //   "nanoseconds": 405000000
    // }

    // let test = moment(obj.toDate()).format("DD-MM-YYYY")


    // console.log(messages)

    // console.log(test)
    // // let validation = messages.some(el => moment(el.dateTime.toDate().format("DD-MM-YYYY")) == newMessageDate)

    // console.log(validation)

    // if(messages.some(el => el.dateTime.toDate().format("DD-MM-YYYY") == newMessageDate)){
    //   let currentChat = this.props.chats
    //   console.log(currentChat)
    // }

    this.props.stopNotification();

    let dateToUpdate = new Date();

    refSOS
      .doc(chatId)
      .update({
        updateDate: formatDate(dateToUpdate),
        messages: messagesAux,
        from: "Chat C2",
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
  refreshButton = () => {

    let { chatId } = this.props.match.params
    let chatIndex = this.props.chats.findIndex(el => el.id === chatId)

    this.changeChat(this.props.chats[chatIndex], chatIndex, true)
  }

  setNewHeight = () => {
    const currentHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    this.setState({ currentHeight });
  };

  updateChats = (prevProps) => {
    const { alarmIndex, chatId } = this.props.match.params;
    const { chats: chatsPrev } = prevProps;
    const { chats } = this.props;
    // if (this.state.flagUpdate === 0) {
    if (chatsPrev !== chats) {
      // console.log("IF")
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
                this.changeChat(chatsC5[indexC5], indexC5, false, "NO");
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
            // console.log("EN EL DEFAULT");
            // console.log(chats)
            this.setState({ chats, flagUpdate: 1 });
            break;
        }
      }
    } else {
      // console.log("else")
    }
    // }
    // if (document.querySelector("#messagesContainer")) {
    //   var messageBody = document.querySelector("#messagesContainer");
    //   messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
    // }
  }

  componentDidMount() {
    const { /*alarmIndex,*/ chatId } = this.props.match.params;

    window.addEventListener("resize", () => this.setNewHeight())


    // this.props.history.location.pathname.split("/").length > 2 && this.setState({showHistorial: !this.state.showHistorial })

    // if (this.props.chats) {
    //   if (alarmIndex) {
    //     this.setState({chats: this.props.chats, activeIndex: alarmIndex });
    //   } else {
    //     const filtered_chats = this.props.chats.filter(
    //       (item) => item.alarmType === this.FILTERSOPTIONS[this.state.tabIndex]
    //     );
    //     this.setState({chats: filtered_chats });
    //   }
    // }

    if (chatId) {
      setTimeout(() => {

        const chatToOpen = this.props.chats.find(el => el.id === chatId);
        const indexChat = this.props.chats.findIndex(el => el.id === chatId);

        this.changeChat(chatToOpen, indexChat);
      }, 2500);
    }

    let messageBody;

    if (document.querySelector('#messagesContainer')) {
      messageBody = document.querySelector('#messagesContainer');
      messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
    }
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

    let messageBody;

    if (document.querySelector('#messagesContainer')) {
      messageBody = document.querySelector('#messagesContainer');
      messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
    }


    // console.log(this.state)
    // console.log(this.props)
    // console.log("ENTRA", prevProps)
    // this.updateChats(prevProps);
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
