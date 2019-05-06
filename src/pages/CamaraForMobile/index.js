import React, { Component } from 'react';
import '../../assets/styles/util.css';
import '../../assets/styles/main.css';
import '../../assets/fonts/iconic/css/material-design-iconic-font.min.css'
import CameraStream from '../../components/CameraStream';
import constants from '../../constants/constants'
import { JellyfishSpinner } from "react-spinners-kit";

class MobileHelp extends Component {

    state = {
        places : [
           
        ],
        camara: undefined
    }
  
  render() {
    return (
        <div>
          {this.state.camera?<CameraStream marker={this.state.camera}  hideTitle hideText height={.5}/>:<JellyfishSpinner
                size={250}
                color="#686769"
                loading={true}                
            />} 
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
                        console.log(value)
                        console.log(camera_id === value.id)    
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
                this.setState({camera:{title:title,extraData:actualCamera}})              
            }).catch(error=>{
                this.setState({loading: false,error:error})
                console.log('eeeeeeeeeeeerrrrrooooooor',error)
            })
        
    }

}

export default MobileHelp;