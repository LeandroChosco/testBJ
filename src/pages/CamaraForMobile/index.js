import React, { Component } from 'react';
import jsmpeg from 'jsmpeg';
import constants from '../../constants/constants'
import { JellyfishSpinner } from "react-spinners-kit";

class MobileHelp extends Component {

    state = {
        places : [
           
        ],
        camara: undefined,
        loading:true
    }
  
  render() {      
    return (
        <div style={{width:'100vw',height:'100vh',overflowY: 'hidden'}}>
            <canvas ref="canvas" style={{width:'100%',height:'100%'}}>                        
            </canvas>
            <div style={{position:'absolute',top:'30%',left:'30%', alignContent:'center'}}              >
                <JellyfishSpinner
                    size={250}
                    color="#686769"
                    loading={this.state.loading}                      
                />    
            </div>            
        </div>        
    );
  }

 


            

    componentDidMount(){

        fetch(constants.base_url+':'+constants.apiPort+'/register-cams/all-cams')       
            .then((response) => {
                return response.json();
            })
            .then((camaras) => {
                let actualCamera = {}
                let title = ''
                const camera_id = parseInt(this.props.match.params.id)
                console.log(camera_id)
                camaras.map(value=>{
                    if (value.active === 1) {                
                        if ( camera_id === value.id) {
                            title= value.street +' '+ value.number + ', ' + value.township+ ', ' + value.town+ ', ' + value.state
                            actualCamera = {
                                id:value.id,
                                num_cam:value.num_cam,
                                lat:value.google_cordenate.split(',')[0], 
                                lng:value.google_cordenate.split(',')[1],                            
                                webSocket:constants.webSocket + ':' +constants.webSocketPort+(value.num_cam>=10?'':'0') + value.num_cam,
                                name: value.street +' '+ value.number + ', ' + value.township+ ', ' + value.town+ ', ' + value.state
                            }
                                                            
                        }
                        
                    }
                    return true;
                })      
                console.log(actualCamera)  
                if (actualCamera.webSocket) {
                    console.log('here')
                    this.setState({camera:{title:title,extraData:actualCamera},loading:false})  
                    try{
                        var ws = new WebSocket(actualCamera.webSocket)                    
                        ws.onclose = function() {}                 
                    } catch (err) {
                    //this._wsError(err)
                    }
                    try {
                    var p = new jsmpeg(ws, {canvas:this.refs.canvas, autoplay:true,audio:false,loop: true,disableGl:true,forceCanvas2D: true});                  
                    console.log(p)
                    } catch (err) {
                        //this._playerError(err)
                    } 
                }           
            }).catch(error=>{
                this.setState({loading: false,error:error})
                console.log('eeeeeeeeeeeerrrrrooooooor',error)
            })
        
    }

}

export default MobileHelp;