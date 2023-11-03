import React, { useEffect, useState } from 'react';
import moment from "moment";

import { Card, Icon, Input, Tab, Radio } from "semantic-ui-react";
import FadeLoader from "react-spinners/FadeLoader";
import Spinner from 'react-bootstrap/Spinner';
import { Button } from "react-bootstrap";

import noChat from "../../assets/images/noChat.png";
import noCamera from "../../assets/images/noCamera.png";

import MapContainer from "../../components/MapContainer";
import CameraStream from "../../components/CameraStream";

import './style.css';
import firebaseC5Benito from '../../constants/configC5CJ';

const ChatGeneral = (props) => {

    const { chats, historial, history } = props;
    // const [allChats, setAllChats] = useState([]);
    // const [allHistorial, setAllHistorial] = useState([]);

    const [indexChat, setIndexChat] = useState("");

    const [currentChat, setCurrentChat] = useState({});

    const [showHistorial, setShowHistorial] = useState(false);

    const [loadingChat, setLoadingChat] = useState(false);
    const [loadingHistorial, setLoadingHistorial] = useState(false);

    const [statusCurrentChat, setStatusCurrentChat] = useState(true);

    const session_user = JSON.parse(sessionStorage.getItem("isAuthenticated"))

    const user_data = {
        name: session_user ? session_user.userInfo.user_nicename : "",
        email: session_user ? session_user.userInfo.user_email : "",
        from: session_user ? session_user.userInfo.role_id : "",
    }

    const panes = [
        {
            menuItem: "C5 Chat",
            render: () => (
                <Tab.Pane attached={false} style={{ backgroundColor: "#dadada", borderWidth: 0, borderColor: "#dadada" }}>
                    {" "}
                    {renderListChats("C5")}
                </Tab.Pane>
            ),
        },
    ];

    const panesHistorial = [
        {
            menuItem: "C5 Historial",
            render: () => (
                <Tab.Pane attached={false} style={{ backgroundColor: "#dadada", borderWidth: 0, borderColor: "#dadada" }}>
                    {" "}
                    {renderListHistorial("Historial")}
                </Tab.Pane>
            ),
        },
    ];
    // const dateFromISO8601 = (internetStandardString) => {
    //     const match = new RegExp(/^([A-Z]{3}) ([A-Za-z]{3}) ([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2}) ([A-Za-z]{3}-[0-9]{2}-[0-9]{2}) ([+-][0-9]{2}:[0-9]{2}) (.*)$/).exec(internetStandardString);

    //     if (match) {
    //         const day = match[1];
    //         const month = match[2];
    //         const year = match[3];
    //         const hour = match[4];
    //         const minute = match[5];
    //         const second = match[6];
    //         const timezone = match[7];
    //         const offset = match[8];
    //         const text = match[9];

    //         // Convertir la zona horaria a una diferencia horaria
    //         const offsetInMinutes = (offset.charAt(0) === "-" ? -1 : 1) * (parseInt(offset.slice(1, 3), 10) * 60 + parseInt(offset.slice(4, 6), 10));

    //         // Crear un objeto Date con la fecha y hora especificadas
    //         const date = new Date(year, month - 1, day, hour, minute, second);

    //         // Ajustar la hora de la fecha según la diferencia horaria
    //         date.setHours(date.getHours() + offsetInMinutes / 60);
    //         date.setMinutes(date.getMinutes() + offsetInMinutes % 60);

    //         return date;
    //     } else {
    //         return null;
    //     }
    // };

    const renderListChats = (type) => {
        return (
            <div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                    <Input
                        placeholder="Buscar usuario"
                        style={{ flex: 2 }}
                    // onChange={filterAction}
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
                    {
                        chats.map((chat, i) => {

                            const date = chat && chat.create_at ? moment(chat.create_at).format("DD-MM-YYYY, HH:mm:ss") : moment(chat.lastModification).format("DD-MM-YYYY, HH:mm:ss");

                            // let badgeNumber = 0;
                            // if (this.state.chatId) {
                            //     badgeNumber = this.state.chatId === chat.id ? 0 : chat.c5Unread;
                            // }
                            return (
                                <Card
                                    className={i === indexChat && "activeChat"}
                                    style={{ width: "100%" }}
                                    key={i}
                                    onClick={() => changeChat(type, chat, i)}
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
                                                <h4 style={{ marginRight: "0.3rem" }}>{chat.user_name}</h4> <p>{date}</p>
                                            </div>
                                            {/* {chat.active ? (
                                            <p>
                                                {
                                                    (chat.messages && chats.messages.length > 0)
                                                }
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
                                            {/* 
                                        {chat.c5Unread !== undefined && badgeNumber !== 0 ? (
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
    };

    const renderListHistorial = (type) => {
        return (
            <div>
                <div style={{ display: "flex", flexDirection: "row" }}>
                    <Input
                        placeholder="Buscar usuario"
                        style={{ flex: 2 }}
                    // onChange={filterAction}
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
                    {
                        historial.map((chat, i) => {

                            const date = chat && chat.create_at ? moment(chat.create_at).format("DD-MM-YYYY, HH:mm:ss") : moment(chat.lastModification).format("DD-MM-YYYY, HH:mm:ss");

                            // let badgeNumber = 0;
                            // if (this.state.chatId) {
                            //     badgeNumber = this.state.chatId === chat.id ? 0 : chat.c5Unread;
                            // }
                            return (
                                <Card
                                    className={i === indexChat && "activeChat"}
                                    style={{ width: "100%" }}
                                    key={i}
                                    onClick={() => changeChat(type, chat, i)}
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
                                                <h4 style={{ marginRight: "0.3rem" }}>{chat.user_name}</h4> <p>{date}</p>
                                            </div>
                                            {/* {chat.active ? (
                                            <p>
                                                {
                                                    (chat.messages && historial.messages.length > 0)
                                                }
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
                                            {/* 
                                        {chat.c5Unread !== undefined && badgeNumber !== 0 ? (
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
    };

    // const filterAction = (e) => {

    //     const filteredName = e.target.value
    //     if (filteredName !== "") {
    //         if (showHistorial) {
    //             const chatsFiltered = historial.filter(el => el.user_name.includes(filteredName));
    //             setAllHistorial(chatsFiltered);
    //         } else {
    //             const chatsFiltered = chats.filter(el => el.user_name.includes(filteredName));
    //             setAllChats(chatsFiltered);
    //         }
    //     } else {
    //         setAllChats(chats);
    //         setAllHistorial(historial);
    //     }
    // };

    const changeChat = (type, chat, index) => {
        setLoadingChat(true);
        setCurrentChat(chat);
        setIndexChat(index);
        setTimeout(() => {
            setLoadingChat(false);
            if (document.querySelector("#messagesContainer") && type === "C5") {
                let messageBody = document.querySelector("#messagesContainer");
                messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
            }
        }, 1500);
    };

    const changeView = () => {
        if (window.location.pathname.includes("chat")) {
            props.history.push(`/chat`);
        };

        setShowHistorial(!showHistorial);
        setLoadingHistorial(true);
        setLoadingChat(true);
        setCurrentChat({});
        setIndexChat("");

        setTimeout(() => {
            setLoadingHistorial(false)
            setLoadingChat(false);
        }, 6000)
    };

    const onMapLoad = (map) => {
        if (currentChat.user_cam.google_cordenate !== undefined) {
            const coords = {
                lat: parseFloat(currentChat.user_cam.google_cordenate.split(",")[0]),
                lng: parseFloat(currentChat.user_cam.google_cordenate.split(",")[1]),
            };
            // this.setState({ map: map }); OJO SI SE NECESITA ESTADO MAP
            new window.google.maps.Marker({
                position: coords,
                map: map,
                title: currentChat.user_nicename,
            });
        } else {
            const coords = {
                lat: parseFloat(currentChat.location.latitude),
                lng: parseFloat(currentChat.location.longitude),
            };
            // this.setState({ map: map }); OJO SI SE NECESITA ESTADO MAP
            new window.google.maps.Marker({
                position: coords,
                map: map,
                title: currentChat.user_nicename,
            });
        };
    };

    const refreshChat = () => {
        setLoadingChat(true);
        setTimeout(() => {
            setLoadingChat(false);
            if (document.querySelector("#messagesContainer")) {
                let messageBody = document.querySelector("#messagesContainer");
                messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
            }
        }, 1500);
    };

    const onKeySend = (e) => {
        let messageToSend = document.getElementById("messsageTextarea");
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
            messageToSend.value = "";
        };
    };

    const sendMessage = () => {

        let messageToSend = document.getElementById("messsageTextarea");
        if (messageToSend.value !== "") {
            let messagesAux = [...currentChat.messages];

            messagesAux.push({
                from: user_data.from,
                dateTime: new Date(),
                msg: messageToSend.value, //msg
                userName: user_data.name,
                userEmail: user_data.email,
            });


            messageToSend.value = "";

            //props.stopNotification();

            firebaseC5Benito
                .app("c5benito")
                .firestore()
                .collection("messages")
                .doc(currentChat.id)
                .update({
                    messages: messagesAux,
                    from: "Chat C5",
                    userUnread: currentChat.userUnread
                        ? currentChat.userUnread + 1
                        : 1,
                    policeUnread: currentChat.policeUnread
                        ? currentChat.policeUnread + 1
                        : 1,
                })

            // liveChat();
        }

    }

    // const liveChat = () => {
    //     let idx = indexChat;
    //     setCurrentChat({});
    //     setLoadingChat(true);
    //     props.getAllChats();
        
    //     setTimeout(() => {
    //         setCurrentChat(chats[idx]);
    //         setLoadingChat(false);
    //     }, 2000);
    // }

    // const ref = firebaseC5Benito.app("c5benito").firestore().collection("messages");

    // const unsubscribe = ref.onSnapshot((snapshot) => {
    //   const chats = snapshot.docChanges().map((change) => {
    //     let value = change.doc.data();

    //     value.lastModification =  new Date(dateFromISO8601(value.lastModification)).toString()
    //     value.id = change.doc.id;
    //     return value;
    //   });
    // //  console.log("chats", chats)
    //  unsubscribe();
    // });


    return (
        <div
            className={
                !props.showMatches
                    ? "hide-matches app-container"
                    : "show-matches app-container"
            }
        >
            <div className="row fullHeight">
                <div className="col-4 userList">
                    <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "0.5rem" }}>
                        <p>Chats</p>
                        <Radio
                            toggle
                            onClick={changeView}
                            id="toggle24"
                            checked={showHistorial}
                            style={{ margin: "0 1rem" }}
                        />
                        <p>Historial</p>
                    </div>
                    <hr />

                    {loadingHistorial ?
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", width: "100%" }}>
                            <Spinner animation="border" variant="info" role="status" size="xl">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        </div>
                        :
                        !showHistorial ?
                            <Tab
                                menu={{ pointing: true }}
                                panes={panes}
                                defaultActiveIndex={props.alarmIndex ? props.alarmIndex : 0}
                            //   onTabChange={(t, i) => {
                            //     const { chats } = this.props;
                            //     const { index } = this.state;
                            //     let newChats = chats.filter(
                            //       (e) => e.alarmType === this.FILTERSOPTIONS[i.activeIndex]
                            //     );
                            //     if (index) {
                            //       let selected =
                            //         newChats.length !== 0 && newChats[index]
                            //           ? newChats[index].alarmType
                            //           : newChats[0].alarmType;
                            //       this.setState({
                            //         from: selected ? selected : "Error getting data",
                            //       });
                            //     }
                            //     this.setState({
                            //       chats: newChats,
                            //       activeIndex: i.activeIndex,
                            //       index: null,
                            //       tabIndex: i.activeIndex,
                            //     });
                            //   }}
                            />
                            :
                            <Tab
                                menu={{ pointing: true }}
                                panes={panesHistorial}
                                defaultActiveIndex={props.alarmIndex ? props.alarmIndex : 0}
                            //   onTabChange={(t, i) => {
                            //     const { chats } = this.props;
                            //     const { index } = this.state;
                            //     let newChats = chats.filter(
                            //       (e) => e.alarmType === this.FILTERSOPTIONS[i.activeIndex]
                            //     );
                            //     if (index) {
                            //       let selected =
                            //         newChats.length !== 0 && newChats[index]
                            //           ? newChats[index].alarmType
                            //           : newChats[0].alarmType;
                            //       this.setState({
                            //         from: selected ? selected : "Error getting data",
                            //       });
                            //     }
                            //     this.setState({
                            //       chats: newChats,
                            //       activeIndex: i.activeIndex,
                            //       index: null,
                            //       tabIndex: i.activeIndex,
                            //     });
                            //   }}
                            />
                    }

                </div>
                <div className="col-8">
                    {
                        loadingChat ?
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
                                <Spinner style={{ marginTop: "3rem" }} animation="border" variant="info" role="status" size="xl" />
                            </div>
                            :
                            showHistorial ? Object.keys(currentChat).length === 0 ?
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
                                                    // backgroundColor: COLORS.c5,
                                                    height: '30px'
                                                }}
                                            >
                                                {currentChat.from}
                                            </h2>
                                            <div className='row' style={{ height: '100%', width: '100%', margin: 0, marginTop: '5px' }}>
                                                <Card style={{ width: '100%' }}>
                                                    <Card.Content>
                                                        <div className='row' style={{ padding: "2rem 1rem" }}>
                                                            <div className='col-9'>
                                                                <div className='row'>
                                                                    <div className='col-6'>
                                                                        <b>Nombre: </b>
                                                                        {currentChat.user_name}
                                                                    </div>
                                                                    <div className='col'>
                                                                        <b>Fecha del último mensaje: </b>
                                                                        {moment.unix(currentChat.messages[currentChat.messages.length - 1].dateTime.seconds).format('DD-MM-YYYY HH:mm')}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='messagesHistorialContainer' id='messagesContainer' style={{ top: "20% !important", height: "100%", padding: "0.5rem !important" }}>
                                                            {currentChat.messages.map((el, index) => {

                                                                const dateTime = moment.unix(el.dateTime.seconds).format('DD-MM-YYYY HH:mm');

                                                                return (
                                                                    <div
                                                                        key={index}
                                                                        className={el.from === "user" ? "user" : "support"}
                                                                        // ref={"message" + index}
                                                                        id={"message" + index}
                                                                    >
                                                                        <p>{el.msg}</p>
                                                                        <small>{dateTime}</small>
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
                                statusCurrentChat ?

                                    <div className="messages">
                                        {(!loadingChat && Object.keys(currentChat).length > 0) && (
                                            <div className="cameraView">
                                                <h2
                                                    className={"Chat C5"}
                                                    style={{
                                                        textAlign: "center",
                                                        //   backgroundColor:
                                                        //     COLORS[
                                                        //     chats[index].alarmType ? chats[index].alarmType : "c5"
                                                        //     ],
                                                        height: "30px",
                                                    }}
                                                >
                                                    {currentChat.alarmType
                                                        ? currentChat.alarmType
                                                        : "Chat C5"}
                                                </h2>
                                                <div className="row" style={{ height: "70%", margin: 0 }}>
                                                    <div className="col" style={{ height: "100%" }}>
                                                        {currentChat.user_cam.google_cordenate ? (
                                                            <MapContainer
                                                                options={{
                                                                    center: {
                                                                        lat: parseFloat(currentChat.user_cam.google_cordenate.split(",")[0]),
                                                                        lng: parseFloat(currentChat.user_cam.google_cordenate.split(",")[1]),
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
                                                                onMapLoad={onMapLoad}
                                                            />
                                                        ) : currentChat.user_cam.location ? (
                                                            <MapContainer
                                                                options={{
                                                                    center: {
                                                                        lat: parseFloat(currentChat.user_cam.location.latitude),
                                                                        lng: parseFloat(currentChat.user_cam.location.longitude),
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
                                                                onMapLoad={onMapLoad}
                                                            />
                                                        )
                                                            :
                                                            <div className="row-6" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "15%", width: "75rem", marginTop: "5rem", marginLeft: "3%", padding: "15rem" }}>
                                                                <img style={{ height: "22rem", marginTop: "-18rem" }} src={noCamera} alt="Imagen-No-Disponible" />
                                                            </div>
                                                        }
                                                    </div>
                                                    <div
                                                        className="col camContainerChatDiv"
                                                        style={{ height: "100%" }}
                                                    >
                                                        {/* {currentChat.user_cam && !loadingChat ? (
                                                            <CameraStream
                                                                hideTitle
                                                                height="250px"
                                                                hideButton
                                                                hideInfo
                                                                propsIniciales={props}
                                                                marker={currentChat.user_cam}
                                                            />
                                                        ) : ( */}
                                                        <p>Sin camara asignada...</p>
                                                        {/* )
                                                        } */}
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
                                                                            <b>Nombre: </b> {currentChat.user_name}
                                                                        </div>
                                                                        <div
                                                                            className="col-3"
                                                                            style={{
                                                                                fontSize: 13,
                                                                                paddingLeft: 0,
                                                                                paddingRight: 0,
                                                                            }}
                                                                        >
                                                                            <b>Celular: </b> {currentChat.user_cam.phone}
                                                                        </div>
                                                                    </div>
                                                                    <div className="row" style={{ padding: "5px" }}>
                                                                        <div
                                                                            className="col-6"
                                                                            style={{ fontSize: 13, paddingRight: 0 }}
                                                                        >
                                                                            <b>Dirección</b> {`${currentChat.user_cam.street || ""} ${currentChat.user_cam.number || ""}, ${currentChat.user_cam.town + "," || ""} ${currentChat.user_cam.township || ""}`}
                                                                        </div>
                                                                        {
                                                                            !currentChat.user_cam &&
                                                                            <div
                                                                                className="col-3"
                                                                                style={{
                                                                                    fontSize: 13,
                                                                                    paddingLeft: 0,
                                                                                    paddingRight: 0,
                                                                                }}
                                                                            >
                                                                                <b>Cámara: </b> #cam{currentChat.user_cam && currentChat.user_cam.num_cam}
                                                                            </div>

                                                                        }

                                                                    </div>
                                                                    <div className="row" style={{ padding: "5px" }}>
                                                                        <div
                                                                            className="col-12"
                                                                            style={{ fontSize: 13, paddingRight: 0 }}
                                                                        >
                                                                            {
                                                                                currentChat.user_cam.entrecalles && <><b>Entre Calles: </b> {currentChat.user_cam.entrecalles}</>
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className="col-4"
                                                                    style={{ margin: "auto" }}
                                                                >
                                                                    <Button onClick={refreshChat}>Actualizar</Button>
                                                                </div>
                                                            </div>
                                                        </Card.Content>
                                                    </Card>
                                                </div>
                                            </div>
                                        )}
                                        <div className="messagesContainer" id="messagesContainer">
                                            {!loadingChat ? (
                                                (currentChat.messages && currentChat.messages.length > 0) ? (
                                                    currentChat.messages.map((el, index) => {

                                                        const dateTime = moment.unix(el.dateTime.seconds).format('DD-MM-YYYY HH:mm');

                                                        if (!(el.userName || el.userEmail)) {
                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className={el.from === "user" ? "user" : "support"}
                                                                    // ref={index === currentChat.messages.length - 1 ? "message" : "message" + index}
                                                                    id={index === currentChat.messages.length - 1 ? "lastMessage" : "message" + index}
                                                                    style={{ backgroundColor: (el.from === 1 || el.from === 2) && "#5ab86d" }}
                                                                >
                                                                    <p>{el.msg}</p>
                                                                    <small>{dateTime}</small>
                                                                </div>
                                                            )

                                                        } else {
                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className={el.from === "user" ? "user" : "support"}
                                                                    // ref={index === currentChat.messages.length - 1 ? "message" : "message" + index}
                                                                    id={index === currentChat.messages.length - 1 ? "lastMessage" : "message" + index}
                                                                    style={{ backgroundColor: (el.from === 1 || el.from === 2) && "#5ab86d" }}
                                                                >
                                                                    <p>{el.msg}</p>
                                                                    <small>{`${dateTime} - ${el.userName || el.userEmail}`}</small>
                                                                </div>
                                                            )
                                                        }

                                                    }
                                                    )
                                                ) : loadingChat ? (
                                                    <>
                                                        <FadeLoader
                                                            height={20}
                                                            width={7}
                                                            radius={20}
                                                            margin={5}
                                                            loading={loadingChat}
                                                        />
                                                        <p style={{ position: "fixed", top: "56%", left: "62%" }}>Cargando chat</p>
                                                    </>
                                                ) : (
                                                    <p style={{ position: "fixed", top: "50%", left: "60%" }}>No se ha seleccionado ningún chat</p>
                                                )
                                            ) : loadingChat ? (
                                                <>
                                                    <FadeLoader
                                                        height={20}
                                                        width={7}
                                                        radius={20}
                                                        margin={5}
                                                        loading={loadingChat}
                                                        css={{ left: "51%", }}
                                                    />
                                                    <p style={{ position: "fixed", top: "56%", left: "62%" }}>Cargando chat</p>
                                                </>
                                            ) : (
                                                <p style={{ position: "fixed", top: "50%", left: "60%" }}>No se ha seleccionado ningún chat</p>
                                            )}
                                        </div>

                                        {
                                            Object.keys(currentChat).length > 0 ? (
                                                <div className="messages_send_box">
                                                    {currentChat.user_cam.active ? (
                                                        <div style={{ position: "relative" }}>
                                                            <textarea
                                                                disabled={!currentChat.user_cam.active}
                                                                placeholder="Escriba su mensaje"
                                                                name="text"
                                                                autoComplete="on"
                                                                autoCorrect="on"
                                                                id="messsageTextarea"
                                                                onKeyDown={onKeySend}
                                                            />
                                                            <Icon
                                                                name="send"
                                                                id="sendbutton"
                                                                onClick={sendMessage}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="closed-ticked">
                                                            El ticket ya se encuentra cerrado
                                                        </div>
                                                    )}
                                                </div>
                                            ) : null
                                        }
                                    </div>
                                    :
                                    currentChat &&
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
                                                                    El usuario <b>{currentChat.user_name}</b> se encuentra <b>DESACTIVADO</b>
                                                                </div>
                                                                <br />
                                                                <div
                                                                    className="row-9"
                                                                    style={{ fontSize: 13, paddingRight: 0 }}
                                                                >
                                                                    <p>Contáctese con soporte para reactivar este usuario</p>
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
    )
}

export default ChatGeneral