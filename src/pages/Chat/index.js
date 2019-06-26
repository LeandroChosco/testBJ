import React, { Component } from 'react';
import { Card, Icon, Button } from 'semantic-ui-react';

import './style.css'
import firebaseC5 from '../../constants/configC5';
import CameraStream from '../../components/CameraStream';
import constants from '../../constants/constants';
import MapContainer from '../../components/MapContainer';
const ref = firebaseC5.app('c5virtual').firestore().collection('messages')
 class Chat extends Component {
    state = {
        messages:[],
        chatId:'',
        text:'',
        from:'',
        fisrt:{
          
        }
    }

  render() {
    const {chats} = this.props;
    const {chatId,index, from} = this.state;
    if (index!==undefined&&chatId===""&&chats.length>0) {
      this.setState({chatId:chats[index].id})
    }    
    return (
        <div  className="app-container" >   
            <div className="row fullHeight">
              <div className="col-4 userList">
                  {chats.map((chat,i)=>
                    <Card className={i===index?'activeChat':''} key={i} onClick={()=>{this.setState({chatId:''});setTimeout(()=>this.setState({chatId:chat.id,messages:chat.messages,index:i,from:chat.from}),500)}}>
                      <Card.Content>
                        <h3>{chat.user_name} </h3>
                        <p>
                          {chat.messages?chat.messages.length>0?(chat.messages[chat.messages.length-1].from==='user'?chat.user_name.split(' ')[0]:'C5')+': '+chat.messages[chat.messages.length-1].msg:'No hay mensajes que mostart':'No hay mensajes que mostart'}
                        </p>
                      </Card.Content>                      
                    </Card>
                  )}
              </div>
              <div className="col-8 messages">
                    {chatId!==''&&chats[index]?
                    <div className="cameraView">
                      <h2 style={{textAlign: 'center', height: '10%'}}>{from}</h2>
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
                        <div className="col" style={{height: '100%'}}>
                          <CameraStream
                            style={{height:'100%'}}
                            hideTitle 
                            marker={{extraData:{num_cam:chats[index].user_cam.num_cam,cameraID:chats[index].user_cam.id,webSocket:constants.webSocket+':'+(2000+chats[index].user_cam.num_cam)}}}/>
                        </div>
                        
                      </div>
                      
                      <div className="row" style={{paddingTop:15, height: '20%'}}>
                        <div className="col-8">
                          <Card style={{width:'100%'}}>
                            <Card.Content style={{padding: 0}}>
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
                                </Card.Content>
                          </Card>
                        </div>
                        <div className="col-4" style={{margin: 'auto'}} >
                          <Button color="red" style={{width:'80%', alignItems: 'center',}} className="ui button">
                            <Icon name='taxi' />Mandar unidad
                          </Button>
                        </div>
                      </div>
                    </div>:null}
                    <div className="messagesContainer" id='messagesContainer'>
                      {chatId!==''&&chats[index]?chats[index].messages?
                        chats[index].messages.map((value,ref)=>
                        <div key={ref} className={value.from} ref={ref===chats[index].messages.length-1?"message":"message"+ref} id={ref===chats[index].messages.length-1?"lastMessage":"message"+ref}>
                          <p>{value.msg}</p>
                          <small>{value.dateTime.toDate?value.dateTime.toDate().toLocaleString():null}</small>
                        </div>)
                        :'No se ha seleccionado ningun chat':'No se ha seleccionado ningun chat'}
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
    const marker = new window.google.maps.Marker({
        position: coords,
        map: map,
        title: chats[index].user_nicename,        
    });    
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
    ref.doc(this.state.chatId).update({messages:messages}).then(()=>{
      this.setState({text:''})
    })    
  }

  componentDidMount(){  
    console.log(this.props)
    if(this.props.location.hash!=='')
      this.setState({index:0})    
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
    //console.log(this.props)
    if (this.props.location.search!=='') {
      let params = this.QueryStringToJSON(this.props.location.search)      
      if (this.props.chats.length>0) {
        console.log(params)
        let i 
        console.log(this.props.chats)
        this.props.chats.forEach((chat,index)=>{
          if (chat.user_creation == params.u) {
            i = index
          }
        })
        console.log(i)
        
        if (this.state.index!=i&&this.state.fisrt.u!==params.u) {
          this.setState({index:i,fisrt:params})

        }
      }
    }
    var messageBody = document.querySelector('#messagesContainer');
    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
  }

}

export default Chat;