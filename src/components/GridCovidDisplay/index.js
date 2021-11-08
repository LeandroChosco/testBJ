import React, { Component } from "react";
import CameraStream from "../CameraStream";
import { Row, Col } from "react-bootstrap";
import { Button, Select } from "semantic-ui-react";
import responseJson from "../../assets/json/suspects.json";
import "./style.css";
import CovidItem from "../CovidItem";
import ReactPaginate from "react-paginate";
import Spinner from "react-bootstrap/Spinner";

const countryOptions = [
  {
    key: 5,
    text: 5,
    value: 5
  },
  {
    key: 10,
    text: 10,
    value: 10
  },
  {
    key: 15,
    text: 15,
    value: 15
  },
  {
    key: 20,
    text: 20,
    value: 20
  },
  {
    key: 25,
    text: 25,
    value: 25
  },
  {
    key: 30,
    text: 30,
    value: 30
  },
  {
    key: 50,
    text: 50,
    value: 50
  }
];
class GridCameraDisplay extends Component {
  state = {
    markers: [],
    height: "auto",
    fullHeight: 10,
    isplaying: [],
    slideIndex: 0,
    matches: [],

    photos: [],
    videos: [],
    video_history: [],
    autoplay: true,
    selectedCamera: {},
    isRecording: false,
    recordingCams: [],
    recordingProcess: [],
    loadingRcord: false,
    limit: 10,
    start: 0,
    pageCount: 1,
    isplay: true,
    servidorMultimedia: "",
    loadingSnap: false,
    videosLoading: false,
    imageLoading: false
  };

  render() {
    return (
      <div className="gridCameraContainer" align="center">
        <Row>
          {this.state.markers.map((value, index) =>
            index < this.state.start + this.state.limit &&
            index >= this.state.start ? (
              <Col
                className={
                  this.state.selectedCamera === value.extraData
                    ? "p-l-0 p-r-0 activeselectedcameragrid camcolgridholder"
                    : "p-l-0 p-r-0 camcolgridholder"
                }
                lg={4}
                sm={6}
                // key={value.extraData.id}
                key={index}
                onClick={() => this._openCameraInfo(value, index)}
                marker={value.id}
              >
                <CameraStream
                  propsIniciales={this.props.propsIniciales}
                  ref={"camrefgrid" + value.extraData.id}
                  key={value.extraData.id}
                  marker={value}
                />
              </Col>
            ) : null
          )}
        </Row>
        {this.props.loading ? null : (
          <Row
            className={
              !this.props.showMatches
                ? "hide-matches paginatorContainerOnGrid2"
                : "show-matches paginatorContainerOnGrid"
            }
          >
            <Col style={{ height: "100%" }}>
              Camaras por pagina{" "}
              <Select
                placeholder="Camaras por pagina"
                options={countryOptions}
                value={this.state.limit}
                onChange={(e, value) => {
                  const pageCount = Math.ceil(
                    this.state.markers.length / value.value
                  );
                  // console.log("paginas a mostar",pageCount)
                  this.setState({
                    start: 0,
                    limit: value.value,
                    pageCount: pageCount
                  });
                }}
              />
            </Col>
            <Col>
              <ReactPaginate
                previousLabel={"Anterior"}
                nextLabel={"Siguiente"}
                breakLabel={"..."}
                pageCount={this.state.pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={this.handlePageClick}
                containerClassName={"pagination"}
                subContainerClassName={"pages pagination"}
                activeClassName={"active"}
              />
            </Col>
          </Row>
        )}
        {this.props.error && this.state.markers.length === 0 ? (
          <div className="errorContainer">
            Error al cargar informacion: {JSON.stringify(this.props.error)}
          </div>
        ) : null}
        <div
          className={
            this.props.dashboard
              ? !this.props.showMatches
                ? "sin-margin camGridControl2 showfiles2"
                : "con-margin camGridControl2 showfiles2"
              : !this.state.autoplay
              ? !this.props.showMatches
                ? "sin-margin camGridControl2 showfiles2"
                : "con-margin camGridControl2 showfiles2"
              : !this.props.showMatches
              ? "sin-margin camGridControl2"
              : "con-margin camGridControl2"
          }
        >
          <div
            className="row stiky-top"
            style={{ backgroundColor: "lightgray" }}
          >
            <div className="col">
              <b>
                Alerta de Temperatura Camara {this.state.selectedCamera.num_cam}
              </b>
              <br />
              {this.state.selectedCamera.name}
            </div>
            <div className="col-3 d-flex">
              <Button
                onClick={() => this._loadFiles(this.state.selectedCamera)}
                className="danger"
                primary
              >
                {/* {this.state.autoplay ? "" : "Recargar imagenes"}{" "} */}
                Recargar imagenes <i className={"fa fa-repeat"}></i>
              </Button>
              {!this.props.dashboard && (
                <Button
                  onClick={() => this._openCameraInfo(false)}
                  className="pull-right"
                  primary
                >
                  {" "}
                  {this.state.autoplay ? "" : "Ocultar controles"}{" "}
                  <i
                    className={
                      this.state.autoplay
                        ? "fa fa-chevron-up"
                        : "fa fa-chevron-down"
                    }
                  ></i>
                </Button>
              )}
            </div>
          </div>
          <div style={{ backgroundColor: "white" }}>
            <div
              className={
                !this.state.autoplay
                  ? "row showfilesinfocameragrid2"
                  : "row hidefiles"
              }
            >
              <div className="col">
                {/* <Tab
                  menu={{ secondary: true, pointing: true }}
                  panes={[
                    {
                      menuItem: "Actuales",
                      render: () => (
                        <Tab.Pane attached={false}>
                          <CovidChart/>
                        </Tab.Pane>
                      )
                    },
                    {
                      menuItem: "Historico",
                      render: () => (
                        <Tab.Pane attached={false}>Este es un tab</Tab.Pane>
                      )
                    }
                  ]}
                /> */}

                <div className="row">
                  {this.state.photos.map((value, index) => (
                    <div key={index} className="col-3 p10">
                      <CovidItem
                        dashboard={this.props.dashboard}
                        info={value}
                        covid={true}
                        clasName="col"
                        servidorMultimedia={this.state.servidorMultimedia}
                        image={true}
                        value={value}
                        cam={this.state.selectedCamera}
                        reloadData={this._loadFiles}
                        src={value.relative_url}
                      />
                    </div>
                  ))}
                </div>
                {this.state.imageLoading ? (
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
                ) : this.state.photos.length === 0 ? (
                  <div align="center">
                    <p className="big-letter">No hay archivos que mostrar</p>
                    <i className="fa fa-image fa-5x"></i>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  handlePageClick = data => {
    // console.log(data)
    this.setState({ start: data.selected * this.state.limit });
  };

  _loadFiles = cam => {
    this.setState({
      loading: true,
      photos: [],
      imageLoading: true
    });
    if (this.props.dashboard) {
      // console.log(this.props.alertaCovid);
      setTimeout(() => {
        this.setState({
          imageLoading: false,
          loading: false,
          photos: this.props.alertaCovid
        });
      }, 1000);
    }
    // console.log(this.state.selectedCamera);
    // console.log("CAM: ", cam);
    if (!this.props.dashboard) {
      let auxCovidFile = [];
      if(this.props.alertaCovid){
      let arrAux = [...this.props.alertaCovid];

      arrAux.forEach(element => {
        if (element.cam_id === cam.id) {
          auxCovidFile.push(element);
        }
      });
    }
      setTimeout(() => {
        this.setState({
          imageLoading: false,
          loading: false,
          photos: auxCovidFile
        });
      }, 500);
    }
  };

  _openCameraInfo = marker => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.spinnerif();
    }, 2500);

    if (marker) {
      let index = this.state.markers.indexOf(marker);
      let recording = false;
      if (this.state.recordingCams.indexOf(marker.extraData) > -1) {
        recording = true;
      }
      if (this.state.isplaying.length === 0) {
        let isp = {};
        this.state.markers.map((value, index) => {
          isp[index] = true;
          return true;
        });
        this.setState({ isplaying: isp });
      }
      /*  --- matches reales ---  
            this.setState({ matches:[],selectedCamera: marker.extraData, autoplay:false, slideIndex: index, isRecording: recording,isplay:this.state.isplaying[this.state.slideIndex]===undefined?true:this.state.isplaying[this.state.slideIndex]})
            this._loadFiles(marker.extraData)
        } else {
            this.setState({selectedCamera: {}, autoplay:true, videos:[],photos:[], video_history:[], matches:[]})
        }             
        */

      // --- matches forzados
      this.setState({
        selectedCamera: marker.extraData,
        autoplay: false,
        slideIndex: index,
        isRecording: recording,
        isplay:
          this.state.isplaying[this.state.slideIndex] === undefined
            ? true
            : this.state.isplaying[this.state.slideIndex]
      });
      this._loadFiles(marker.extraData);
    } else {
      this.setState({
        selectedCamera: {},
        autoplay: true,
        videos: [],
        photos: [],
        video_history: []
      });
    }
  };

  spinnerif = () => {
    if (this.state.loading) {
      setTimeout(() => {
        this.setState({ loading: false });
      }, 2500);
    }
  };
  componentDidUpdate() {
    if (this.props.newCovidState === true) {
      this.props._newCovidItem();
      if (
        this.state.selectedCamera !== {} &&
        this.props.newCovidItem.cam_id === this.state.selectedCamera.id
      ) {
        console.log(this.state.selectedCamera);
        // this._loadFiles(this.state.selectedCamera);
        let tmpArr = [...this.state.photos];
        console.log(this.props.newCovidItem);
        tmpArr.unshift(this.props.newCovidItem);
        this.setState({ photos: tmpArr });
      }
    }
  }

  componentDidMount() {
    // console.log("PROPS", this.props);
    // if (this.props.newCovidState === true) {
    // let tmpArr = [...this.state.alertaCovid]
    // tmpArr.unshift(data.data)
    // console.log("NUEVA NOTIFICACION");
    // }
    if (this.props.dashboard) {
      this._loadFiles();
    }
    let markersForLoop = [];
    this.props.places.map(value => {
      markersForLoop.push({
        title: value.name,
        extraData: value
      });
      return true;
    });

    /* --- matches reales---
        const pageCount = Math.ceil(markersForLoop.length /this.state.limit)        
        this.setState({markers:markersForLoop,pageCount:pageCount})
        */

    // --- matches forzados ---
    let cameras = [];
    for (let item in responseJson.items) {
      let suspect = responseJson.items[item];
      //if(suspect.person_classification !== "Victim"){
      suspect.description = suspect.description
        .replace(/<p>/g, "")
        .replace(/<\/p>/g, "");
      cameras.push(suspect);
      //}
    }
    const pageCount = Math.ceil(cameras.length / this.state.limit);
    this.setState({
      markers: markersForLoop,
      matches: cameras,
      pageCount: pageCount
    });
  }

  componentWillUnmount() {}

  static getDerivedStateFromProps(props, state) {
    let markersForLoop = [];
    props.places.map((value, index) => {
      markersForLoop.push({
        title: value.name,
        extraData: value
      });
      return true;
    });
    let aux = state;
    const pageCount = Math.ceil(markersForLoop.length / state.limit);
    aux.markers = markersForLoop;
    aux.pageCount = pageCount;
    return aux;
  }
}

export default GridCameraDisplay;
