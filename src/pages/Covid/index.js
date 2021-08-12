import React, { Component, Fragment } from 'react';
import { ToggleButton, ToggleButtonGroup } from 'react-bootstrap'
import { Icon, Tab } from 'semantic-ui-react'
import '../../assets/styles/util.css';
import '../../assets/styles/main.css';
import '../../assets/fonts/iconic/css/material-design-iconic-font.min.css'
import './style.css'
import LoopCamerasDisplay from '../../components/LoopCamerasDisplay';
import GridCovidDisplay from '../../components/GridCovidDisplay';
import CameraStream from '../../components/CameraStream';
import constants from '../../constants/constants'
import { JellyfishSpinner } from "react-spinners-kit";
import conections from '../../conections'

import {
  Legend,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  ComposedChart,
} from 'recharts';
import { ClassicSpinner } from "react-spinners-kit";
import CovidItem from "../../components/CovidItem"
import Spinner from "react-bootstrap/Spinner";
import ColorScheme from 'color-scheme'

const scm = new ColorScheme();
const COLORS = scm.from_hue(235)
  .scheme('analogic')
  .distance(0.3)
  .add_complement(false)
  .variation('pastel')
  .web_safe(false).colors();


class Analysis extends Component {

  state = {
    places: [

    ],
    actualCamera: {
      title: '',
      extraData: {}
    },
    displayTipe: 1,
    cameraID: null,
    webSocket: constants.webSocket,
    loading: true,
    error: null,
    recordingCams: [],
    recordingProcess: [],
    loadingRcord: false,
    isRecording: false,
    interval: null,
    loadingSnap: false,
    loadingFiles: false,
    modal: false,
    recordMessage: '',
    cameraProblem: {},
    problemDescription: '',
    typeReport: 1,
    phones: [],
    mails: [],
    user_id: 0,
    userInfo: {},
    moduleActions: {},
    id_cam: 0,
    panes: [
      { menuItem: 'En linea', render: () => <Tab.Pane attached={false}>{this._renderOnlineTab()}</Tab.Pane> },
      { menuItem: 'Dashboard', render: () => <Tab.Pane attached={false}>{this._renderCovidPerDay()}</Tab.Pane> },
    ],
    covidPerDay: [
      {
        date: "2020-06-16",
        total: 5,
        cam_id: 154
      },
      {
        date: "2020-06-17",
        total: 15,
        cam_id: 154
      },
      {
        date: "2020-06-18",
        total: 25,
        cam_id: 154
      },
      {
        date: "2020-06-19",
        total: 5,
        cam_id: 154
      },
      {
        date: "2020-06-20",
        total: 35,
        cam_id: 154
      },
      {
        date: "2020-06-21",
        total: 5,
        cam_id: 154
      },
      {
        date: "2020-06-22",
        total: 5,
        cam_id: 154
      },
    ],
    photos: [],
    imageLoading: false,
    loadingCovidGrid: false

  }

  render() {
    if (this.state.loading) {
      return (
        <div style={{ position: 'absolute', top: '30%', background: 'transparent', width: '100%' }} align='center'>
          <JellyfishSpinner
            size={250}
            color="#686769"
            loading={this.state.loading}
          />
        </div>
      )
    }
    return (
      <div id="analisis_holder" className={!this.props.showMatches ? "hide-matches" : "show-matches"}>
        <Tab menu={{ secondary: true, pointing: true }} panes={this.state.panes} />

      </div>
    );
  }


  _renderOnlineTab = () => {
    return (
      <Fragment>
        {this.state.displayTipe !== 3 && !this.state.loading ? <div className="toggleViewButton row">
          <ToggleButtonGroup className='col-12' type="radio" name="options" defaultValue={2} onChange={this._changeDisplay} value={this.state.displayTipe}>
            <ToggleButton value={1} variant='outline-dark' ><Icon name="grid layout" /></ToggleButton>
            <ToggleButton value={2} variant='outline-dark' ><Icon name="clone" /></ToggleButton>
            {this.state.cameraID ? <ToggleButton value={3} variant='outline-dark' ><Icon name="square" /></ToggleButton> : null}
          </ToggleButtonGroup>
        </div> : null}
        <div style={{ position: 'absolute', top: '30%', background: 'transparent', width: '100%' }} align='center'>

        </div>
        {
          this._showDisplay()
        }
      </Fragment>
    )
  }

  _renderCovidPerDay() {
    return (
      <div className="row">
        <div className='col-12 chart-covid' align='center'>
          <h3>Personas por dia</h3>
          {
            this.state.covidPerDay.length < 1 ?
              <ClassicSpinner
                loading={true}
                size={40}
                color="#686769"
              /> : <ResponsiveContainer width="99%" height={400}>
                <ComposedChart
                  data={this.state.covidPerDay}
                  margin={{
                    top: 5, right: 30, left: 20, bottom: 30,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill={'#' + COLORS[1]} />
                </ComposedChart>
              </ResponsiveContainer>
          }

          <div className="row mt-10">

            {!this.state.loadingCovidGrid && this.state.photos.map((value, index) => (
              <div key={index} className="col-3 p10">
                <CovidItem
                  dashboard={false}
                  info={value}
                  covid={true}
                  clasName="col"
                  servidorMultimedia={this.state.servidorMultimedia}
                  image={true}
                  value={value}
                  cam={this.state.selectedCamera}
                  reloadData={this._loadCovidFiles}
                  src={value.relative_url}
                />
              </div>
            ))}
          </div>
          {this.state.imageLoading &&
            <div className="p-3">
              <Spinner
                animation="border"
                variant="info"
                role="status"
                size="xl"
              >
                <span className="sr-only">Loading...</span>
              </Spinner>
            </div>
          }
          {!this.state.imageLoading && this.state.photos.length === 0 &&
            <div style={{ "marginTop": "15px" }} align="center ">
              <p className="big-letter">No hay archivos que mostrar</p>
              <i className="fa fa-image fa-5x"></i>
            </div>
          }

        </div>
      </div>
    )
  }


  _loadCovidFiles = () => {
    console.log("COVID", this.props.alertaCovid)
    this.setState({
      photos: [],
      imageLoading: true,
      loadingCovidGrid: true
    });
    let covidTmp = [];
    if (this.props.alertaCovid) {
      this.props.alertaCovid.forEach(element => {
        if (element.camData[0].termic_type === 1) {
          covidTmp.push(element);
        }
      });
    }else{
      console.log('Sin informaciòn');
    }
    setTimeout(() => {
      this.setState({
        imageLoading: false,
        loadingCovidGrid: false,
        photos: covidTmp
      });
    }, 1000);
  }

  onChange = chips => {
    this.setState({ phones: chips });
  }

  _showDisplay = () => {
    switch (this.state.displayTipe) {
      case 1:
        return (<>
          <GridCovidDisplay
            ref='myChild'
            newCovidState={this.props.newCovidState}
            _newCovidItem={this.props._newCovidItem}
            newCovidItem={this.props.newCovidItem}
            alertaCovid={this.props.alertaCovid}
            error={this.state.error}
            loading={this.state.loading}
            places={this.state.places}
            loadingRcord={this.state.loadingRcord}
            isRecording={this.state.isRecording}
            recordingCams={this.state.recordingCams}
            recordingProcess={this.state.recordingProcess}
            loadingSnap={this.state.loadingSnap}
            loadingFiles={this.state.loadingFiles}
            moduleActions={this.state.moduleActions}
            matches={this.props.matches}
            changeStatus={this._chageCamStatus}
            showMatches={this.props.showMatches}
            propsIniciales={this.props} />

        </>)
      case 2:
        return (<LoopCamerasDisplay
          ref='myChild'
          error={this.state.error}
          loading={this.state.loading}
          places={this.state.places}
          loadingRcord={this.state.loadingRcord}
          isRecording={this.state.isRecording}
          recordingCams={this.state.recordingCams}
          recordingProcess={this.state.recordingProcess}
          loadingSnap={this.state.loadingSnap}
          loadingFiles={this.state.loadingFiles}
          moduleActions={this.state.moduleActions}
          matches={this.props.matches}
          changeStatus={this._chageCamStatus}
          propsIniciales={this.props} />)
      case 3:
        return (<div className="camUniqueHolder"><CameraStream marker={this.state.actualCamera} showButtons height="250px" hideFileButton showFilesBelow moduleActions={this.state.moduleActions} /></div>)
      default:
        return null
    }
  }

  _changeDisplay = (value) => {
    this.setState({ displayTipe: value })
  }

  componentDidUpdate() {
    console.log("PROPS ALERTACOVID", this.props)
    if (this.props.newCovidState === true) {
      this.props._newCovidItem();
      let tmpArr = [...this.state.photos];
      console.log(this.props.newCovidItem);
      tmpArr.unshift(this.props.newCovidItem);
      this.setState({ photos: tmpArr });
    }
    if (this.props.alertaCovidState) {
      this.props._alertaCovidState()
      this._loadCovidFiles()
    }
  }


  componentDidMount() {
    // console.log(this.props.showMatches) 
    this._loadCovidFiles()
    if (!this.props.match.params.id) {
      const isValid = this.props.canAccess(2)
      if (!isValid) {
        this.props.history.push('/welcome')
      }
      if (isValid.UserToModules[0]) {
        this.setState({ moduleActions: JSON.parse(isValid.UserToModules[0].actions) })
      }
    } else {
      this.setState({ moduleActions: { btnrecord: true, btnsnap: true, viewHistorial: true }, id_cam: this.props.match.params.id })
    }
    this._loadCameras()
    window.addEventListener('restartCamEvent', this._loadCameras, false)
  }



  _loadCameras = () => {
    // console.log('este es _loadCamera')
    this.setState({ loading: true }, console.log('loading'))
    conections.getAllCams()
      .then((response) => {
        // console.log(response)
        const camaras = response.data
        let auxCamaras = []
        let offlineCamaras = []
        let actualCamera = {}
        let title = ''
        let idCamera = null
        let index = 1
        // let indexFail = 1
        camaras.map(value => {
          if (value.active === 1 && value.tipo_camara === 4) {
            console.log("value", value)

            var urlHistory = null
            var urlHistoryPort = null

            if ("urlhistory" in value){
                urlHistory = value.urlhistory
            }

            if ("urlhistoryport" in value){
                urlHistoryPort = value.urlhistoryport
            }

            // let url = 'rtmp://18.212.185.68/live/cam';                                               
            auxCamaras.push({
              id: value.id,
              num_cam: index,
              lat: value.google_cordenate.split(',')[0],
              lng: value.google_cordenate.split(',')[1],
              name: value.street + ' ' + value.number + ', ' + value.township + ', ' + value.town + ', ' + value.state + ' #cam' + value.num_cam,

              isHls: value.tipo_camara === 3 ? false : true,
              url: value.tipo_camara !== 3 ? 'http://' + value.UrlStreamMediaServer.ip_url_ms + ':' + value.UrlStreamMediaServer.output_port + value.UrlStreamMediaServer.name + value.channel : null,
              real_num_cam: value.num_cam < 10 ? ('0' + value.num_cam.toString()) : value.num_cam.toString(),
              camera_number: value.num_cam,
              dataCamValue: value,
              tipo_camara: value.tipo_camara,
              urlHistory: urlHistory,
              urlHistoryPort: urlHistoryPort
            })
            index = index + 1
            // console.log(this.state.id_cam)
            if (this.state.id_cam !== 0) {
              if (parseInt(this.state.id_cam) === value.id) {
                title = value.street + ' ' + value.number + ', ' + value.township + ', ' + value.town + ', ' + value.state
                actualCamera = {
                  id: value.id,
                  num_cam: value.num_cam,
                  lat: value.google_cordenate.split(',')[0],
                  lng: value.google_cordenate.split(',')[1],
                  name: value.street + ' ' + value.number + ', ' + value.township + ', ' + value.town + ', ' + value.state,
                  isHls: true,
                  url: 'http://' + value.UrlStreamMediaServer.ip_url_ms + ':' + value.UrlStreamMediaServer.output_port + value.UrlStreamMediaServer.name + value.channel,
                  real_num_cam: value.num_cam < 10 ? ('0' + value.num_cam.toString()) : value.num_cam.toString(),
                  camera_number: value.num_cam,
                  dataCamValue: value,
                  tipo_camara: value.tipo_camara

                }
                idCamera = value.id
              }
            }

          }
          return true;
        })
        if (idCamera == null) {
          this.setState({ places: auxCamaras, offlineCamaras: offlineCamaras, loading: false, error: undefined })
        } else {
          this.setState({ places: auxCamaras, offlineCamaras: offlineCamaras, loading: false, cameraID: idCamera, actualCamera: { title: title, extraData: actualCamera }, error: undefined })
          this.setState({ displayTipe: 3 })
        }
      }).catch(error => {
        this.setState({ loading: false, error: 'Error de conexion' })
      })
  }

  componentWillUnmount() {
    window.removeEventListener('restartCamEvent', this._loadCameras, false)
    this.state.recordingProcess.map(value => {

      conections.stopRecord({
        record_proccess_id: value.process_id
      }, value.cam_id)
      // .then((r) => {
      //     const response = r.data                
      // })
      return value;
    })
  }
  _chageCamStatus = (camare) => {
    conections.changeCamStatus(camare.id)
      .then(response => {
        // console.log(response)
        if (response.status === 200) {
          if (response.data.success) {
            const event = new Event('restartCamEvent')
            window.dispatchEvent(event)
          }
        }
      })
      .catch(err => {
        console.log(err)
      })

  }
}

export default Analysis;
