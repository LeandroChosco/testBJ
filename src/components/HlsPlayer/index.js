import React, {Component} from 'react'
import Clappr from 'clappr'
class HlsPlayer extends Component{

    state = { player: undefined }

    render(){
        return(
            <div id={'player'+this.props.num_cam} style={{height:this.props.height?this.props.height:'100%'}}>
            </div>
        )
    }

    componentDidMount(){        
        let height = {            
        }                
        if (this.props.height) {
            height = {
                height: this.props.height
            }
        } 
        let width = {   
            width:'100%'
        }                
        if (this.props.width) {
            width = {
                width: this.props.width
            }
        } 
        console.log('url',this.props.src) 
        var player = new Clappr.Player({
            // this is an example url - for this to work you'll need to generate fresh token
            source: this.props.src,
            parentId: '#player'+this.props.num_cam,
            ...width,            
            ...height,
            autoPlay: true,
            hideVolumeBar: true,
            playback: {
                playInline: true,
            },
        });        
        this.setState({player:player})
    }

    componentWillUnmount(){
        if (this.state.player) {
            this.state.player.destroy()
        }
    }
}

export default HlsPlayer;