import React, {Component} from 'react'
import Clappr from 'clappr'
import ReactPlayer from 'react-player'


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
            //source  : 'http://34.235.144.27:8080/hls/camp01.m3u8',
            parentId: '#player'+this.props.num_cam,
            ...width,            
            ...height,
            autoPlay: true,
            hideVolumeBar: true,
            playback: {
                playInline: true,
                hlsjsConfig: {
                    autoStartLoad: true,
                    startPosition: -1,
                    debug: false,
                    capLevelOnFPSDrop: false,
                    capLevelToPlayerSize: false,
                    defaultAudioCodec: undefined,
                    initialLiveManifestSize: 1,
                    maxBufferLength: 10,
                    maxMaxBufferLength: 100,
                    maxBufferSize: 10*1000*1000,
                    maxBufferHole: 0.5,
                    lowBufferWatchdogPeriod: 0.5,
                    highBufferWatchdogPeriod: 3,
                    nudgeOffset: 0.1,
                    nudgeMaxRetry: 3,
                    maxFragLookUpTolerance: 0.25,
                    liveSyncDurationCount: 3,
                    liveMaxLatencyDurationCount: Infinity,
                    liveDurationInfinity: false,
                    liveBackBufferLength: Infinity,
                    enableWorker: true,
                    enableSoftwareAES: true,
                    manifestLoadingTimeOut: 10000,
                    manifestLoadingMaxRetry: 1,
                    manifestLoadingRetryDelay: 1000,
                    manifestLoadingMaxRetryTimeout: 64000,
                    startLevel: undefined,
                    levelLoadingTimeOut: 10000,
                    levelLoadingMaxRetry: 4,
                    levelLoadingRetryDelay: 1000,
                    levelLoadingMaxRetryTimeout: 64000,
                    fragLoadingTimeOut: 20000,
                    fragLoadingMaxRetry: 6,
                    fragLoadingRetryDelay: 1000,
                    fragLoadingMaxRetryTimeout: 64000,
                    startFragPrefetch: false,
                    testBandwidth: true,
                    fpsDroppedMonitoringPeriod: 5000,
                    fpsDroppedMonitoringThreshold: 0.2,
                    appendErrorMaxRetry: 3,
                    enableWebVTT: true,
                    enableCEA708Captions: true,
                    stretchShortVideoTrack: false,                    
                    forceKeyFrameOnDiscontinuity: true,
                  }                
            },
            preload: 'metadata'            
        });       
        
         player.on(Clappr.Events.PLAYER_ERROR, err =>  {
             console.log('error en el player',err)
             console.log('error en el player code',err.code)
            
         
             if (err.code === 'hls:3' || err.code === 'hls:networkError_levelLoadTimeOut' || err.code === 'hls:networkError_manifestLoadTimeOut') {
                console.log('network error') 
                player.load(this.props.src)
                player.play()
             }

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