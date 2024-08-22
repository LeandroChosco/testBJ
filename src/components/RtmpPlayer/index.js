import React from 'react'
import videojs from 'video.js'
import 'videojs-flash' //No quitar este import, con este funciona el reproductor con flash
import '@videojs/http-streaming'
import './style.css'

class RtmpPlayer extends React.Component {
   
    render(){
        return(
            <div id={'player'+this.props.num_cam}>
                <div>
                    <video id={"hls-player"+this.props.num_cam} controls autoPlay preload="auto" className='video-js vjs-default-skin vjs-big-play-centered'>
                        <source src={this.props.src} type="rtmp/mp4" />                
                    </video>
                </div>
            </div>
        )
    
    }

    componentDidMount(){
          console.log(this.props)
        const loadPLayer = () =>
        {                        
                var pwidth = document.getElementById('player'+this.props.num_cam).offsetWidth                
                //var pheight = document.getElementById('player'+this.props.num_cam).offsetHeight                
                //$("#player .player-inner").html("");
                //document.getElementById("player"+this.props.num_cam).innerHTML = ""                                
                
                //$("#player .player-inner").html(uiText);
                //document.getElementById("player"+this.props.num_cam).innerHTML = uiText   
                // console.log(videojs('hls-player'+this.props.num_cam.toString()))                             
                // const play = videojs('hls-player'+this.props.num_cam.toString())
                // if(play){
                //     play.destroy()
                // }
                let height = {}                
                if (this.props.height) {
                    height = {
                        height: this.props.height
                    }
                }
                const player = videojs('hls-player'+this.props.num_cam.toString(), {
                    width: pwidth,
                    //height: pheight,
                    ...height,
                    controls: true,
                    liveui:true,
                    autoplay: true,
                    flash: {                        
                        flashVars: {
                            rtmpBufferTime: 100
                        }
                    },
                    techOrder:["flash","html5"],
                    controlBar: {
                        children: [
                            'playToggle',
                            //'volumePanel',
                            'timeDivider',
                            //'currentTimeDisplay',
                            //'liveDisplay',
                            //'progressControl',
                            //'durationDisplay',
                            //'remainingTimeDisplay',
                            //'customControlSpacer',
                            //'playbackRateMenuButton',
                            //'chaptersButton',
                            //'subsCapsButton',
                            //'audioTrackButton',
                            //'qualitySelector',
                            'fullscreenToggle'
                        ],
                    },
                    language:'es',                    
                });                    
                this.setState({player:player})                                
            }
        loadPLayer()
    }

    componentWillUnmount(){
        if (this.state.player) {
            this.state.player.dispose()
        }
    }
    
}

export default RtmpPlayer
