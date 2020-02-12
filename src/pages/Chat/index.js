import React, { Component } from 'react';
import { Card, Icon, Button } from 'semantic-ui-react';

import './style.css'
import firebaseC5 from '../../constants/configC5';
import CameraStream from '../../components/CameraStream';
import constants from '../../constants/constants';
import MapContainer from '../../components/MapContainer';
import Axios from 'axios';
const ref = firebaseC5.app('c5cuajimalpa').firestore().collection('messages')
 class Chat extends Component {
    state = {
        messages:[],
        chatId:'',
        text:'',
        from:'',
        fisrt:{
          
        },
        camData:undefined,
        loading : false,
        hashUsed: false
    }

  render() {
    const {chats} = this.props;
    const {chatId,index, from, camData, loading} = this.state;    
    if (index!==undefined&&chatId===""&&chats.length>0){
      this.setState({chatId:chats[index].id});
    }     
    return (
        <div  className="app-container" >   
            <div className="row fullHeight">
              <div className="col-4 userList">
                  {chats.map((chat,i)=>
                    <Card className={i===index?'activeChat':''} key={i} onClick={()=>this.changeChat(chat,i)}>
                      <Card.Content>
                        <div style={{position:'relative'}}>
                          <h3>{chat.user_name} </h3>
                          <p>
                            {chat.messages?chat.messages.length>0?(chat.messages[chat.messages.length-1].from==='user'?chat.user_name.split(' ')[0]:'C5')+': '+chat.messages[chat.messages.length-1].msg:'No hay mensajes que mostart':'No hay mensajes que mostart'}
                          </p>
                          {chat.c5Unread!==undefined&&chat.c5Unread!==0?<div className='notificationNumber'><p>{chat.c5Unread}</p></div>:null}
                        </div>
                      </Card.Content>                      
                    </Card>
                  )}
              </div>
              <div className="col-8 messages">
                    {!loading&&chatId!==''&&chats[index]?
                    <div className="cameraView">
                      <h2 className={from} style={{textAlign: 'center', height: '10%'}}>{from==='Chat Soporte'?'Chat C5':from}</h2> 
                      <div className="row" style={{height: '70%'}}>                       
                        <div className="col" style={{height: '100%'}}>
                          <MapContainer                 
                            options={{
                                center: {lat: parseFloat(chats[index].user_cam.google_cordenate.split(',')[0]), lng: parseFloat(chats[index].user_cam.google_cordenate.split(',')[1])},
                                zoom: 15,
                                mapTypeId: 'roadmap',
                                zoomControl: false,
                                mapTypeControl: false,
                                streetViewControl: false,
                                fullscreenControl: false,
                                openConfirm: false,
                                typeConfirm:false,
                                openSelection:false,
                                checked:''
                            }}
                            onMapLoad={this._onMapLoad} /> 
                        </div>
                        <div className="col camContainerChatDiv" style={{height: '100%'}}>
                          {camData!==undefined?<CameraStream
                            style={{height:'100%'}}
                            hideTitle 
                            height="100%"
                            hideButton
                            marker={camData}/>:null}
                        </div>
                        
                      </div>
                      
                      <div className="row" style={{paddingTop:15, height: '20%'}}>
                        
                          <Card style={{width:'100%'}}>
                            <Card.Content style={{padding: 0}}>
                              <div className="row">
                              <div className="col-8">
                                <div className="row textContainer">
                                    <div style={{fontSize:13,paddingRight:0}} className="col-6"><b>Nombre: </b>{chats[index].user_name}</div>
                                    <div style={{fontSize:13,paddingLeft:0 ,paddingRight:0}} className="col-3"><b>Telefono: </b>{chats[index].user_cam.phone}</div>
                                    <div style={{fontSize:13,paddingLeft:0, paddingRight:0}} className="col-3"><b>Celular: </b>{chats[index].user_cam.cellphone}</div>
                                </div>
                                <div className="row textContainer" style={{paddingTop: 0}}>
                                    <div style={{fontSize:13}} className="col">
                                        <b>Dirección: </b>{chats[index].user_cam.street} {chats[index].user_cam.number}, {chats[index].user_cam.town}, {chats[index].user_cam.township}, {chats[index].user_cam.state}
                                    </div>
                                </div>
                              </div>                            
                              <div className="col-4" style={{margin: 'auto'}} >
                                <Button color="red" style={{width:'80%', alignItems: 'center',}} className="ui button" onClick={this.closeChat}>
                                  <Icon name='taxi' />Mandar unidad
                                </Button>
                              </div>
                              </div>

                            </Card.Content>
                          </Card>
                        
                        
                      </div>
                    </div>:null}
                    <div className="messagesContainer" id='messagesContainer'>
                      {!loading&&chatId!==''&&chats[index]?chats[index].messages?
                        chats[index].messages.map((value,ref)=>
                        <div key={ref} className={value.from} ref={ref===chats[index].messages.length-1?"message":"message"+ref} id={ref===chats[index].messages.length-1?"lastMessage":"message"+ref}>
                          <p>{value.msg}</p>
                          <small>{value.dateTime.toDate?value.dateTime.toDate().toLocaleString():null}</small>
                        </div>)
                        :loading===true?'Cargando...':'No se ha seleccionado ningun chat':loading===true?'Cargando...':'No se ha seleccionado ningun chat'}
                        
                    </div>
                      {chatId!==''?<div className="messages_send_box">
                          <div style={{position: "relative"}}>
                              <textarea 
                                placeholder="Escriba su mensaje"                                  
                                name="text" 
                                autoComplete="on" 
                                autoCorrect="on"
                                id="messsageTextarea"
                                value={this.state.text}  
                                onKeyPress={this.checkKey}
                                onChange={event=>{this.setState({text:event.target.value})}}                              
                              >          
                              </textarea>
                              <Icon name="send" id="sendbutton" onClick={this.sendMessage}/>
                          </div>
                      </div> :null}   
              </div>
            </div>
        </div>
    
    );
  }

  _onMapLoad = (map) => {
    const { chats } = this.props
    const {index} = this.state
    const coords ={lat: parseFloat(chats[index].user_cam.google_cordenate.split(',')[0]), lng: parseFloat(chats[index].user_cam.google_cordenate.split(',')[1])}    
    this.setState({map:map})        
    new window.google.maps.Marker({
        position: coords,
        map: map,
        title: chats[index].user_nicename,        
    });    
  }

  changeChat = (chat,i) => {
    console.log(chat)
    this.setState({chatId:'',loading:true, camData: undefined});
    setTimeout(()=>{
      this._changeUserCam(chat)
      this.props.stopNotification()
      ref.doc(chat.id).update({c5Unread:0}).then(()=>{
        this.setState({text:'',from:'Chat C5'})
      })  
      this.setState({
        chatId:chat.id,
        messages:chat.messages,
        index:i,
        from:chat.from,                          
        loading:false
      })
    },1000)
  }

  checkKey = (event) => {
    var key = window.event.keyCode;    
    if (key === 13) {
      this.sendMessage()
      return false;
    }
    else {
        return true;
    }
  }

  _changeUserCam = (chat) => {
    Axios.get(constants.base_url+':'+constants.apiPort+'/admin/users/'+chat.user_creation).then(response=>{    
      if (response.status ===200) {
        if (response.data.success) {
          const data = response.data.data
          console.log('data',data)
          this.setState({camData:{
            extraData:{
              num_cam:data.UserToCameras[0].Camare.num_cam,
              cameraID:data.UserToCameras[0].Camare.num_cam,
              //webSocket:'ws://'+data.UserToCameras[0].Camare.UrlStreamToCameras[0].Url.dns_ip+':'+data.UserToCameras[0].Camare.port_output_streaming
              isHls:true,
              url: 'http://' + data.UserToCameras[0].Camare.UrlStreamMediaServer.ip_url_ms + ':' + data.UserToCameras[0].Camare.UrlStreamMediaServer. output_port + data.UserToCameras[0].Camare.UrlStreamMediaServer. name + data.UserToCameras[0].Camare.channel 
            }
          }})
        }
      }
    })
  }


  closeChat = () => {
    /*let {chats} = this.props
    */
  }

  sendMessage = () =>{
    if(this.state.text==='')
      return;


    let messages = this.props.chats[this.state.index].messages
    messages = messages.map(message =>{
      message.dateTime = message.dateTime.toDate()
      return message
    })
    messages.push({
      from:'support',
      dateTime: new Date(),
      msg:this.state.text
    })
    this.props.stopNotification()
    ref.doc(this.state.chatId).update({
      messages:messages,
      from:'Chat C5',
      userUnread:this.props.chats[this.state.index].userUnread?
        this.props.chats[this.state.index].userUnread+1:
        1,
      policeUnread:this.props.chats[this.state.index].policeUnread?
        this.props.chats[this.state.index].policeUnread+1:
        1,
    }).then(()=>{
      this.setState({text:'',from:'Chat C5'})
    })    
  }

  componentDidMount(){  
    if(this.props.location.hash!==''&&this.state.index!=0 && this.state.hashUsed=== false)
    {
      if (this.props.chats[0]!==undefined) {     
        //this.setState({index:0, from:this.props.chats[0].from})
        this._changeUserCam(this.props.chats[0])
        this.setState({index:0,from:this.props.chats[0].from,chatId:this.props.chats[0].id,hashUsed:true})    
      }
    } 
    if (this.props.location.search!=='') {
      let params = this.QueryStringToJSON(this.props.location.search)      
      if (this.props.chats.length>0) {        
        let i         
        this.props.chats.forEach((chat,index)=>{
          if (chat.user_creation == params.u) {
            i = index
          }
        })        
        
        if (this.state.index!=i&&this.state.fisrt.u!==params.u) {
          this._changeUserCam(this.props.chats[i])
          this.setState({index:i,fisrt:params,from:this.props.chats[i].from,chatId:this.props.chats[i].id})

        }
      }
    }
    if(this.state.index !== undefined && this.props.chats[this.state.index] !== undefined){
      if(this.state.from!=this.props.chats[this.state.index].from){
        this.setState({from:this.props.chats[this.state.index].from})
      }
    }

    var messageBody = document.querySelector('#messagesContainer');
    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;

  console.log('chatss',this.props.chats)
  }

  QueryStringToJSON(query) {
    query = query.replace('?','')            
    var pairs = query.split('&');
    
    var result = {};
    pairs.forEach(function(pair) {
        pair = pair.split('=');
        result[pair[0]] = decodeURIComponent(pair[1] || '');
    });

    return JSON.parse(JSON.stringify(result));
}


    
  componentDidUpdate(){    
    if(this.props.location.hash!==''&&this.state.index!=0 && this.state.hashUsed=== false)
    {
      if (this.props.chats[0]!==undefined) {     
        //this.setState({index:0, from:this.props.chats[0].from})
        this._changeUserCam(this.props.chats[0])
        this.setState({index:0,from:this.props.chats[0].from,chatId:this.props.chats[0].id,hashUsed:true})    
      }
    } 
    if (this.props.location.search!=='') {
      let params = this.QueryStringToJSON(this.props.location.search)      
      if (this.props.chats.length>0) {        
        let i         
        this.props.chats.forEach((chat,index)=>{
          if (chat.user_creation == params.u) {
            i = index
          }
        })        
        
        if (this.state.index!=i&&this.state.fisrt.u!==params.u) {
          this._changeUserCam(this.props.chats[i])
          this.setState({index:i,fisrt:params,from:this.props.chats[i].from,chatId:this.props.chats[i].id})

        }
      }
    }
    if(this.state.index !== undefined && this.props.chats[this.state.index] !== undefined){
      if(this.state.from!=this.props.chats[this.state.index].from){
        this.setState({from:this.props.chats[this.state.index].from})
      }
    }

    var messageBody = document.querySelector('#messagesContainer');
    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;

  }
  

}

export default Chat;