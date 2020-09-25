import React, { Component } from 'react'
import './styles.css'
import { Tab, Card, Button, Icon } from 'semantic-ui-react'
import CameraStream from '../../components/CameraStream'
import MapContainer from '../../components/MapContainer'
import constants from '../../constants/constants';
import Axios from 'axios'

import firebaseC5 from '../../constants/configC5';
const ref = firebaseC5.app('c5cuajimalpa').firestore().collection('messages')


class ChatNew extends Component {

    state = {
        loading: false,
        chatId: '',
        camData: undefined,
        panes: [
            { menuItem: 'Chat C5', render: () => <Tab.Pane attached={false}>{this._renderChatC5()}</Tab.Pane> },
            // { menuItem: 'SOS', render: () => <Tab.Pane attached={false}>{this._renderChatSOS()}</Tab.Pane> },
            { menuItem: 'Alarma Fuego', render: () => <Tab.Pane attached={false}>{this._renderChatFire()}</Tab.Pane> },
            { menuItem: 'Alarma Policia', render: () => <Tab.Pane attached={false}>{this._renderChatPolice()}</Tab.Pane> },
            { menuItem: 'Alarma Medico', render: () => <Tab.Pane attached={false}>{this._renderChatMedic()}</Tab.Pane> },
        ],
    }

    render() {
        return (
            <div>
                <Tab menu={{ secondary: true, pointing: true }} panes={this.state.panes} />
            </div>
        )
    }

    _renderChatC5 = () => {
        const { chats } = this.props
        const { index, loading, chatId } = this.state

        return (
            <div className='row' style={{ height: '80vh', width: '95vw' }}>
                <div className='col-4 userList'>
                    <h3>Lista de Mensajes</h3>
                    {chats.map((chat, i) =>
                        <Card key={i} className={i === index ? 'activeChat' : ''} onClick={() => this.changeChat(chat, i)}>
                            <Card.Content>
                                <div style={{ position: 'relative' }}>
                                    <h3>{chat.user_name}</h3>
                                    <p>
                                        {
                                            chat.messages ?
                                                chat.messages.length > 0 ?
                                                    (chat.messages[chat.messages.length - 1].from === 'user' ? chat.user_name.split(' ')[0] : 'C5') + ': ' + chat.messages[chat.messages.length - 1].msg :
                                                    'No hay mensajes que mostrar' :
                                                'No hay mensajes que mostrar'
                                        }
                                    </p>
                                    {
                                        chat.c5Unread !== undefined && chat.c5Unread !== 0 ?
                                            <div className='notificationNumber'>
                                                <p>{chat.c5Unread}</p>
                                            </div>
                                            :
                                            null
                                    }
                                </div>
                            </Card.Content>
                        </Card>
                    )}
                </div>
                <div className='col-8 messages'>
                    {!loading && chatId !== '' && chats[index] ?
                        <div className='cameraView'>
                            <h2 className='ChatC5'>Chat C5</h2>
                            {this._renderMapAndCamera(chats)}
                            <br />
                            {this._renderInfoUserChat(chats, index)}
                        </div>
                        : null}
                    {this._renderChatInterface(chats, index)}
                </div>
            </div>
        )
    }

    _renderChatSOS = () => {
        const { chats } = this.props
        const { index, loading, chatId } = this.state
        console.log('Chats SOS', chats)
        return (
            <div className='row' style={{ height: '80vh', width: '95vw' }}>
                <div className='col-4 userList'>
                    <h3>Lista de Mensajes</h3>
                    {chats.map((chat, i) =>
                        <Card key={i} className={i === index ? 'activeChat' : ''} onClick={() => this.changeChat(chat, i)}>
                            <Card.Content>
                                <div style={{ position: 'relative' }}>
                                    <h3>{chat.user_name}</h3>
                                    <p>
                                        {
                                            chat.messages ?
                                                chat.messages.length > 0 ?
                                                    (chat.messages[chat.messages.length - 1].from === 'user' ? chat.user_name.split(' ')[0] : 'C5') + ': ' + chat.messages[chat.messages.length - 1].msg :
                                                    'No hay mensajes que mostrar' :
                                                'No hay mensajes que mostrar'
                                        }
                                    </p>
                                    {
                                        chat.c5Unread !== undefined && chat.c5Unread !== 0 ?
                                            <div className='notificationNumber'>
                                                <p>{chat.c5Unread}</p>
                                            </div>
                                            :
                                            null
                                    }
                                </div>
                            </Card.Content>
                        </Card>
                    )}
                </div>
                <div className='col-8 messages'>
                    {!loading && chatId !== '' && chats[index] ?
                        <div className='cameraView'>
                            <h2 className='SOS'>SOS - Auxilio</h2>
                            {this._renderMapAndCamera(chats)}
                            <br />
                            {this._renderInfoUserChat(chats, index)}
                        </div>
                        : null}
                    {this._renderChatInterface(chats, index)}
                </div>
            </div>
        )
    }

    _renderChatFire = () => {
        const { fireChats } = this.props
        const { index, loading, chatId } = this.state
        return (
            <div className='row' style={{ height: '80vh', width: '95vw' }}>
                <div className='col-4 userList'>
                    <h3>Lista de Mensajes</h3>
                    {fireChats.map((chat, i) =>
                        <Card key={i} className={i === index ? 'activeChat' : ''} onClick={() => this.changeChat(chat, i)}>
                            <Card.Content>
                                <div style={{ position: 'relative' }}>
                                    <h3>{chat.user_name}</h3>
                                    <p>
                                        {
                                            chat.messages ?
                                                chat.messages.length > 0 ?
                                                    (chat.messages[chat.messages.length - 1].from === 'user' ? chat.user_name.split(' ')[0] : 'C5') + ': ' + chat.messages[chat.messages.length - 1].msg :
                                                    'No hay mensajes que mostrar' :
                                                'No hay mensajes que mostrar'
                                        }
                                    </p>
                                    {
                                        chat.c5Unread !== undefined && chat.c5Unread !== 0 ?
                                            <div className='notificationNumber'>
                                                <p>{chat.c5Unread}</p>
                                            </div>
                                            :
                                            null
                                    }
                                </div>
                            </Card.Content>
                        </Card>
                    )}
                </div>
                <div className='col-8 messages'>
                    {!loading && chatId !== '' && fireChats[index] ?
                        <div className='cameraView'>
                            <h2 className='fire'>Alarma Fuego</h2>
                            {this._renderMapAndCamera(fireChats)}
                            <br />
                            {this._renderInfoUserChat(fireChats, index)}
                        </div>
                        : null}
                    {this._renderChatInterface(fireChats, index)}
                </div>
            </div>
        )
    }

    _renderChatPolice = () => {
        const { policeChats } = this.props
        const { index, loading, chatId } = this.state
        return (
            <div className='row' style={{ height: '80vh', width: '95vw' }}>
                <div className='col-4 userList'>
                    <h3>Lista de Mensajes</h3>
                    {policeChats.map((chat, i) =>
                        <Card key={i} className={i === index ? 'activeChat' : ''} onClick={() => this.changeChat(chat, i)}>
                            <Card.Content>
                                <div style={{ position: 'relative' }}>
                                    <h3>{chat.user_name}</h3>
                                    <p>
                                        {
                                            chat.messages ?
                                                chat.messages.length > 0 ?
                                                    (chat.messages[chat.messages.length - 1].from === 'user' ? chat.user_name.split(' ')[0] : 'C5') + ': ' + chat.messages[chat.messages.length - 1].msg :
                                                    'No hay mensajes que mostrar' :
                                                'No hay mensajes que mostrar'
                                        }
                                    </p>
                                    {
                                        chat.c5Unread !== undefined && chat.c5Unread !== 0 ?
                                            <div className='notificationNumber'>
                                                <p>{chat.c5Unread}</p>
                                            </div>
                                            :
                                            null
                                    }
                                </div>
                            </Card.Content>
                        </Card>
                    )}
                </div>
                <div className='col-8 messages'>
                    {!loading && chatId !== '' && policeChats[index] ?
                        <div className='cameraView'>
                            <h2 className='police'>Alarma Policia</h2>
                            {this._renderMapAndCamera(policeChats)}
                            <br />
                            {this._renderInfoUserChat(policeChats, index)}
                        </div>
                        : null}
                    {this._renderChatInterface(policeChats, index)}
                </div>
            </div>
        )
    }

    _renderChatMedic = () => {
        const { medicChats } = this.props
        const { index, loading, chatId } = this.state
        return (
            <div className='row' style={{ height: '80vh', width: '95vw' }}>
                <div className='col-4 userList'>
                    <h3>Lista de Mensajes</h3>
                    {medicChats.map((chat, i) =>
                        <Card key={i} className={i === index ? 'activeChat' : ''} onClick={() => this.changeChat(chat, i)}>
                            <Card.Content>
                                <div style={{ position: 'relative' }}>
                                    <h3>{chat.user_name}</h3>
                                    <p>
                                        {
                                            chat.messages ?
                                                chat.messages.length > 0 ?
                                                    (chat.messages[chat.messages.length - 1].from === 'user' ? chat.user_name.split(' ')[0] : 'C5') + ': ' + chat.messages[chat.messages.length - 1].msg :
                                                    'No hay mensajes que mostrar' :
                                                'No hay mensajes que mostrar'
                                        }
                                    </p>
                                    {
                                        chat.c5Unread !== undefined && chat.c5Unread !== 0 ?
                                            <div className='notificationNumber'>
                                                <p>{chat.c5Unread}</p>
                                            </div>
                                            :
                                            null
                                    }
                                </div>
                            </Card.Content>
                        </Card>
                    )}
                </div>
                <div className='col-8 messages'>
                    {!loading && chatId !== '' && medicChats[index] ?
                        <div className='cameraView'>
                            <h2 className='medic'>Alarma Medica</h2>
                            {this._renderMapAndCamera(medicChats)}
                            <br />
                            {this._renderInfoUserChat(medicChats, index)}
                        </div>
                        : null}
                    {this._renderChatInterface(medicChats, index)}
                </div>
            </div>
        )
    }

    _renderMapAndCamera = (chats) => {
        const { camData } = this.state
        return (
            <div className='row' style={{ height: '70%' }}>
                <div className='col' style={{ height: '100%' }}>
                    <MapContainer
                        options={{
                            center: { lat: parseFloat(chats[0].user_cam.google_cordenate.split(',')[0]), lng: parseFloat(chats[0].user_cam.google_cordenate.split(',')[1]) },
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
                            <div key={ref} className={value.from} ref={ref === chats[index].messages.length - 1 ? "message" : "message" + ref} id={ref === chats[index].messages.length - 1 ? "lastMessage" : "message" + ref}>
                                <p>{value.msg}</p>
                                <small>{value.dateTime.toDate ? value.dateTime.toDate().toLocaleString() : null}</small>
                            </div>)
                        : loading === true ? 'Cargando...' : 'No se ha seleccionado ningun chat' : loading === true ? 'Cargando...' : 'No se ha seleccionado ningun chat'}

                </div>
                {
                    chatId !== '' ?
                        <div className="messages_send_box">
                            <div style={{ position: "relative", width: "98%" }} >
                                <textarea
                                    placeholder="Escriba su mensaje"
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

    _onMapLoad = (map) => {
        const { chats } = this.props
        // const { index } = this.state
        const index = 0
        const coords = { lat: parseFloat(chats[index].user_cam.google_cordenate.split(',')[0]), lng: parseFloat(chats[index].user_cam.google_cordenate.split(',')[1]) }
        this.setState({ map: map })
        new window.google.maps.Marker({
            position: coords,
            map: map,
            title: chats[index].user_nicename,
        });
    }

    changeChat = (chat, i) => {
        console.log('changChat', chat)
        this.setState({
            chatId: '',
            loading: true,
            camData: undefined
        });
        setTimeout(() => {
            this._changeUserCam(chat)
            this.props.stopNotification()
            ref.doc(chat.id).update({ c5Unread: 0 }).then(() => {
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

    _changeUserCam = (chat) => {
        Axios.get(constants.base_url + ':' + constants.apiPort + '/admin/users/' + chat.user_creation).then(response => {
            if (response.status === 200) {
                if (response.data.success) {
                    const data = response.data.data
                    console.log('data', data)
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
        if (this.state.text === '')
            return;


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
        ref.doc(this.state.chatId).update({
            messages: messages,
            from: 'Chat C5',
            userUnread: this.props.chats[this.state.index].userUnread ?
                this.props.chats[this.state.index].userUnread + 1 :
                1,
            policeUnread: this.props.chats[this.state.index].policeUnread ?
                this.props.chats[this.state.index].policeUnread + 1 :
                1,
        }).then(() => {
            this.setState({ text: '', from: 'Chat C5' })
        })
    }
}

export default ChatNew
