import React, { Component } from 'react'
import './styles.css'
import { Tab, Card, Button, Icon } from 'semantic-ui-react'
import CameraStream from '../../components/CameraStream'
import MapContainer from '../../components/MapContainer'
import constants from '../../constants/constants';
import moment from 'moment'
import Axios from 'axios'

import FadeLoader from "react-spinners/FadeLoader";

import firebaseC5 from '../../constants/configC5';
const ref = firebaseC5.app('c5benito').firestore().collection('messages')


class ChatNew extends Component {

    state = {
        loading: false,
        chatId: '',
        camData: undefined,
        panes: [
            { menuItem: 'C5', render: () => <Tab.Pane attached={false} style={{backgroundColor: '#dadada'}}>{this._renderListChats(this.props.chats)}</Tab.Pane> },
            { menuItem: 'Fuego', render: () => <Tab.Pane attached={false} style={{backgroundColor: '#dadada'}}>{this._renderListChats(this.props.fireChats)}</Tab.Pane> },
            { menuItem: 'Policia', render: () => <Tab.Pane attached={false} style={{backgroundColor: '#dadada'}}>{this._renderListChats(this.props.policeChats)}</Tab.Pane> },
            { menuItem: 'Medico', render: () => <Tab.Pane attached={false} style={{backgroundColor: '#dadada'}}>{this._renderListChats(this.props.medicChats)}</Tab.Pane> },
        ],
        chats: [],
        type: ''
    }

    componentDidMount(){
        this.setState({chats: this.props.chats, type: 'c5'})
    }

    render() {
        return (
            <>
                <div className='row' style={{ height: '95vh', width: '95vw'}} >
                    <div className="col-4 userList">
                        <Tab 
                            menu={{ pointing: true, secondary: true }} 
                            panes={this.state.panes} 
                            onTabChange={(t, i) => {
                                this.setState({index: null})
                                switch (i.activeIndex) {
                                    case 0:
                                        this.setState({type: 'c5'})
                                    break;
                                    case 1:
                                        this.setState({type: 'fire'})
                                    break;
                                    case 2:
                                        this.setState({type: 'police'})
                                    break;
                                    case 3: 
                                        this.setState({type: 'medic'})
                                    default:
                                    break;
                                }
                            }}
                        />
                        <div className='serverStatusBar'>
                            <div>
                                <p><b>{this.props.socket.id ? this.props.socket.id : '-'}</b></p>
                            </div>
                            <div>
                                <h4 className={this.props.socket ? 'onlineServer' : 'offlineServer'}>{this.props.socket ? 'En linea' : 'Desconectado'}</h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-8 messages">
                        {this._renderChat()}
                    </div>
                </div>
            </>
        )
    }

    _renderListChats = (chats) => {
        const {index} = this.state
        return(
            <div style={{height: '81vh', overflow: 'scroll', backgroundColor: '#dadada'}}>
                {chats.map((chat, i) =>
                    <Card 
                        key={i} 
                        style={{ width: "95%" }}
                        className={i === index ? 'activeChat' : ''} 
                        onClick={() => this.changeChat(chat, i)}
                    >
                        <Card.Content>
                            <div style={{ position: 'relative' }}>
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
                                    <div > <small style={{ ...styles.badge, marginLeft: 3, alignSelf: "flex-end", display: "flex" }}> <Icon name={chat.active ? "clock" : "checkmark"}></Icon> <strong>{chat.active ? "Proceso" : "Cerrado"}</strong> </small></div>
                                </div>
                            </div>
                        </Card.Content>
                    </Card>
                )}
            </div>
        )
    }

    _renderChat = () => {
        const {loading, chatId, index, type} = this.state

        const chatView = (chats) => {
            return(
                <>
                    {!loading && chatId !== '' && chats[index] ?
                        <div className='cameraView'>
                            <h2 className={type}>
                                {
                                    type === 'c5' ? 'Chat C5' 
                                    : type === 'fire' ? 'C5 - Fuego' 
                                    : type === 'police' ? 'C5 - Policia' 
                                    : type === 'medic' ? 'C5 - Medico'
                                    : null
                                }
                            </h2>
                            {this._renderMapAndCamera(chats, index)}
                            <br />
                            {this._renderInfoUserChat(chats, index)}
                        </div>
                        : null}
                    {this._renderChatInterface(chats, index)}
                </>
            )
        }
        
        switch (type) {
            case 'c5':
                return chatView(this.props.chats)
            case 'fire':
                return chatView(this.props.fireChats)
            case 'police':
                return chatView(this.props.policeChats)
            case 'medic':
                return chatView(this.props.medicChats)
            default:
            break;
        }
        
    }

    _renderMapAndCamera = (chats, index) => {
        const { camData } = this.state
        return (
            <div className='row' style={{ height: '70%' }}>
                <div className='col' style={{ height: '100%' }}>
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
                            onMapLoad={this.onMapLoad}
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
                            onMapLoad={this.onMapLoad}
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
        )
    }

    _renderInfoUserChat = (chats, index) => {
        return (
            <div className="row" style={{ height: '2vh' }}>
                <Card style={{ width: '100vw' }}>
                    <Card.Content>
                        <div className="row">
                            <div className="col-8">
                                <div className="row textContainer">
                                    <div style={{ fontSize: 13, paddingRight: 0 }} className="col-6">
                                        <b>Nombre: </b>{chats[index].user_name}
                                    </div>
                                    <div style={{ fontSize: 13, paddingLeft: 0, paddingRight: 0 }} className="col-3">
                                        <b>Telefono: </b>{chats[index].user_cam.phone}
                                    </div>
                                    <div style={{ fontSize: 13, paddingLeft: 0, paddingRight: 0 }} className="col-3">
                                        <b>Celular: </b>{chats[index].user_cam.cellphone}
                                    </div>
                                </div>
                                <div className="row textContainer" style={{ paddingTop: 0 }}>
                                    {/* {chats[index].alarmType !== undefined ?
                                        <div style={{ fontSize: 13 }} className="col">
                                            <b>Descripción: </b> {chats[index].alarm.description}
                                        </div>
                                        : null} */}
                                    <div style={{ fontSize: 13 }} className="col">
                                        <b>Dirección: </b>{chats[index].user_cam.street} {chats[index].user_cam.number}, {chats[index].user_cam.town}, {chats[index].user_cam.township}, {chats[index].user_cam.state}
                                    </div>
                                </div>
                                {/* {chats[index].alarmType !== undefined ?
                                    <div className="row textContainer">
                                        <div style={{ fontSize: 13, paddingRight: 0 }} className="col-6"><b>Tipo de Alarma: </b>{chats[index].alarmType}</div>
                                        <div style={{ fontSize: 13, paddingLeft: 0, paddingRight: 0 }} className="col-3"><b>Marca Alarma: </b>{chats[index].alarm.device_brand.name}</div>
                                        <div style={{ fontSize: 13, paddingLeft: 0, paddingRight: 0 }} className="col-3"><b>Numero de Serie: </b>{chats[index].alarm.serial_number}</div>
                                    </div>
                                    : null} */}
                            </div>
                            <div className="col-4" style={{ margin: 'auto' }} >
                                <Button color="red" style={{ width: '80%', alignItems: 'center', }} className="ui button" onClick={this.closeChat}>
                                    <Icon name='taxi' /> Mandar unidad
                                </Button>
                            </div>
                        </div>
                    </Card.Content>
                </Card>
            </div>
        )
    }

    _renderChatInterface = (chats, index) => {
        const { loading, chatId } = this.state
        return (
            <>
                <div className="messagesContainer" id='messagesContainer' style={{ top: '60%' }}>
                    {!loading && chatId !== '' && chats[index] ? chats[index].messages ?
                        chats[index].messages.map((value, ref) =>
                            <div 
                                key={ref} 
                                className={value.from} 
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
                                    {value.dateTime.toDate ? 
                                    value.dateTime.toDate().toLocaleString() : 
                                    null}
                                </small>
                            </div>)
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
                {
                    chatId !== '' && chats[index] ?
                        <div className="messages_send_box">
                            <div style={{ position: "relative", width: "98%" }} >
                                <textarea
                                    name="text"
                                    autoComplete="on"
                                    autoCorrect="on"
                                    id="messsageTextarea"
                                    value={this.state.text}
                                    onKeyPress={this.checkKey}
                                    onChange={event => { this.setState({ text: event.target.value }) }}
                                >
                                </textarea>
                                <div style={{ padding: '4px' }}>
                                    <Icon name="send" id="sendbutton" onClick={this.sendMessage} style={{ right: '20px' }} />
                                </div>
                            </div>
                        </div>
                        : null}
            </>
        )
    }

    onMapLoad = (map, lat, lng) => {
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
    }

    changeChat = (chat, i) => {
        console.log('changChat', chat)
        this.setState({
            chatId: '',
            loading: true,
            camData: undefined
        });
        setTimeout(() => {
            this.changeUserCam(chat)
            this.props.stopNotification()
            ref
                .doc(chat.id)
                .update({ c5Unread: 0 })
                .then(() => {
                this.setState({ text: '', from: 'Chat C5' })
            })
            this.setState({
                chatId: chat.id,
                messages: chat.messages,
                index: i,
                from: chat.from,
                loading: false,
                alarmType: chat.alarmType,
                alarm: chat.alarm
            })
        }, 1000)
    }

    changeUserCam = (chat) => {
        Axios.get(constants.base_url + ':' + constants.apiPort + '/admin/users/' + chat.user_creation).then(response => {
            if (response.status === 200) {
                if (response.data.success) {
                    const data = response.data.data
                    this.setState({
                        camData: data.UserToCameras[0] == undefined ? undefined : {
                            extraData: {
                                num_cam: data.UserToCameras[0] !== undefined ? data.UserToCameras[0].Camare.num_cam : null,
                                cameraID: data.UserToCameras[0] !== undefined ? data.UserToCameras[0].Camare.num_cam : null,
                                //webSocket:'ws://'+data.UserToCameras[0].Camare.UrlStreamToCameras[0].Url.dns_ip+':'+data.UserToCameras[0].Camare.port_output_streaming
                                isHls: true,
                                url: data.UserToCameras[0] !== undefined ? 'http://' + data.UserToCameras[0].Camare.UrlStreamMediaServer.ip_url_ms + ':' + data.UserToCameras[0].Camare.UrlStreamMediaServer.output_port + data.UserToCameras[0].Camare.UrlStreamMediaServer.name + data.UserToCameras[0].Camare.channel : null,
                                dataCamValue: data.UserToCameras[0] !== undefined ? data.UserToCameras[0].Camare : null
                            }
                        }
                    })
                }
            }
        })
    }

    sendMessage = () => {
        if (this.state.text === '') return;

        let messages = this.props.chats[this.state.index].messages
        messages = messages.map(message => {
            message.dateTime = message.dateTime.toDate()
            return message
        })
        messages.push({
            from: 'support',
            dateTime: new Date(),
            msg: this.state.text
        })
        this.props.stopNotification()
        ref
            .doc(this.state.chatId)
            .update({
                messages: messages,
                from: 'Chat C5',
                userUnread: this.props.chats[this.state.index].userUnread ?
                    this.props.chats[this.state.index].userUnread + 1 :
                    1,
                policeUnread: this.props.chats[this.state.index].policeUnread ?
                    this.props.chats[this.state.index].policeUnread + 1 :
                    1,
        }).then(() => {
            this.setState({ text: '' })
        })
    }
}

export default ChatNew

const styles = {
    badge: {
      paddingLeft: 3,
      paddingRight: 3,
      borderRadius: 3,
      fontSize: 10,
      paddingTop: 2,
      paddingBottom: 2
    },
    tab: { backgroundColor: "#dadada", borderWidth: 0, borderColor: "#dadada" },
    centered: {  position: "fixed", top: '50%', left: '65%'}
  }