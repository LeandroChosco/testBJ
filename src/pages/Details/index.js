import React, { Component } from 'react';
import responseJson from '../../assets/json/suspects.json'
import { Image, Header, Button, Radio } from 'semantic-ui-react';

import './style.css'
import MapContainer from '../../components/MapContainer/index.js';
import { Modal, Navbar } from 'react-bootstrap';
const mapOptions= {
    center: {lat: 19.459430, lng: -99.208588},
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
}

 class Details extends Component {
    state = {
        places : [
            {
                name:'Carrilo Puerto , 413 ,Tacuba Miguel Hidalgo CDMX', 
                lat:19.459430, 
                lng:-99.208588,
                id:1,
                webSocket:'ws://18.222.106.238:1001'
            }
        ],    
        images: [{},{}],
        idCamera:Math.floor(Math.random() * 10) + 1,
    }

  render() {
    return (
        <div  className="app-container" >   
            <Navbar sticky="top" expand="lg" variant="light" bg="mh">                       
                <Navbar.Text >
                   Camara {this.state.idCamera}
                </Navbar.Text>                
            </Navbar>     
            <div  className="mapContainerForDetail" >    
                <MapContainer                 
                    options={mapOptions}
                    places={this.state.places} 
                    onMapLoad={this._onMapLoad} />            
            </div>
            <div  className="row">
                &nbsp;
            </div>	
            <div  className="card">
                <div  className="row imageContainer">
                    <div  className="col-1"></div>
                    <div  className="col-4 imageContainer">
                        <div  className="row">
                            <div  className="col imageContainer" align='center'>
                                <h4>Imagen de camara</h4>
                                <div  className="card-image">
                                    <Image wrapped size="small" src={this.state.images[0].original}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div  className="col-2 center imageContainer" >
                        <div  className="row" >
                            <div  className="col" align='center'>  
                                <Header size='huge' color="brown">95%</Header>
                            </div>
                        </div>
                        <div  className="row" >
                            <div  className="col" align='center'>  
                                de poincidencia
                            </div>
                        </div>
                    </div>
                    <div  className="col-4 imageContainer">
                        <div  className="row">
                            <div  className="col imageContainer" align='center'>
                                <h4>Imagen registrada</h4>
                                <div  className="card-image">
                                    <Image wrapped size="small" src={this.state.images[1]?this.state.images[1].original:this.state.images[0].original}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div  className="col-1">
                    </div>
                </div>
            </div>
            <div  className="row">
                &nbsp;
            </div>
            <div  className="card">
                <div  className="row"  >
                    
                    <div  className="col-6">
                        <h4>Datos</h4>
                        <div  className="row"   >
                            <div  className="col-4">
                                <b>Nombre:</b>
                            </div>
                            <div  className="col-8">
                                 {this.state.title}
                            </div>
                            <div  className="col-4">
                                <b>Aliases:</b>
                            </div>
                            <div  className="col-8">
                                {this.state.aliases}
                            </div>
                            <div  className="col-4">
                                <b>Detalles:</b>
                            </div>
                            <div  className="col-8">
                                {this.state.details}
                            </div>
                            <div  className="col-4">
                                <b>Lugar de nacimiento:</b>
                            </div>
                            <div  className="col-8">
                                PASADENA, CALIFORNIA, United States
                            </div>
                            <div  className="col-4">
                                <b>Fecha de nacimiento:</b>
                            </div>
                            <div  className="col-8">
                                March 28, 1979
                            </div>
                            <div  className="col-4">
                                <b>Nacionalidad:</b>
                            </div>
                            <div  className="col-8">
                                American
                            </div>
                        </div>
                    </div>
                    <div  className="col-6">
                        <h4>Descripción fisica</h4>
                        <div  className="row"  >
                            <div  className="col-4">
                                <b>Altura:</b>
                            </div>
                            <div  className="col-8">
                                1.85 metros
                            </div>
                            <div  className="col-4">
                                <b>Peso:</b>
                            </div>
                            <div  className="col-8">
                                82 kilogramos
                            </div>
                            <div  className="col-4">
                                <b>Color de pelo:</b>
                            </div>
                            <div  className="col-8">
                                Negro
                            </div>
                            <div  className="col-4">
                                <b>Color de ojos:</b>
                            </div>
                            <div  className="col-8">
                                Cafe
                            </div>
                            <div  className="col-4">
                                <b>Marcas y cicatrices:</b>
                            </div>
                            <div  className="col-8">
                                John Doe has a cleft chin and a surgical scar on this lower back.
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
            <div  className="row">
                &nbsp;
            </div>
            <div  className="row">
                <div  className="col center" align='center'>
                    <Button positive onClick={()=>this.setState({openConfirm:true})}>
                    Confirmar evento
                    </Button>		    
                </div>
                
            </div>
            <div  className="row">
                &nbsp;
            </div>
            
            <Modal show={this.state.openConfirm} onHide={()=>this.setState({openConfirm:false})}>
                <Modal.Header closeButton>
                    
                </Modal.Header>
                <Modal.Body>¿Confirmar evento?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={()=>this.handleClose(false)}>
                    No
                    </Button>
                    <Button variant="primary" onClick={()=>this.handleClose(true)}>
                    Si
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={this.state.openSelection} onHide={()=>this.setState({openSelection:false})}>
                <Modal.Header closeButton>
                    
                </Modal.Header>
                <Modal.Body>
                {this.state.typeConfirm?
                <div>
                    <Radio
                        label="Sospechoso se encuentra en libertad condicional"
                        onChange={()=>{this.setState({checked:'similar'})}}                        
                        checked={this.state.checked==='conditional'}
                    />
                    <Radio
                        label="Sospechoso arrestado y puesto a disposición de las autoridades"
                        onChange={()=>{this.setState({checked:'to_authorities'})}}                        
                        checked={this.state.checked==='to_authorities'}
                    />
                    <Radio
                        label='Arrestadó y solicitadó refuerzo federal'
                        onChange={()=>{this.setState({checked:'federal_reinforcement'})}}                        
                        checked={this.state.checked==='federal_reinforcement'}
                    />
                    <Radio
                        label='Arrestadó y solicitadó refuerzo estatal'
                        onChange={()=>{this.setState({checked:'statal_reinforcement'})}}                        
                        checked={this.state.checked==='statal_reinforcement'}
                    />
                    </div>:
                    <div>
                    <Radio
                        label="Match similar pero el sospechoso no era el"
                        onChange={()=>{this.setState({checked:'similar'})}}                        
                        checked={this.state.checked==='similar'}
                    />
                    <Radio
                        label="Match no era nada similar al sospechoso"
                        onChange={()=>{this.setState({checked:'no_similar'})}}                        
                        checked={this.state.checked==='no_similar'}
                    />
                    <Radio
                        label='Match con una mujer, el sospechoso es hombre'
                        onChange={()=>{this.setState({checked:'female_on_male'})}}                        
                        checked={this.state.checked==='female_on_male'}
                    />
                    <Radio
                        label='Match con un hombre, sospechosa es mujer'
                        onChange={()=>{this.setState({checked:'male_on_female'})}}                        
                        checked={this.state.checked==='male_on_female'}
                    />
                    <Radio
                        label='Match en objeto y no en persona'
                        onChange={()=>{this.setState({checked:'object'})}}                        
                        checked={this.state.checked==='object'}
                    />
                </div>}

                </Modal.Body>
                <Modal.Footer>                    
                    <Button variant="primary" onClick={this.saveChange}>
                    Guardar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    
    );
  }

  handleClose = (type) => {
    this.setState({openSelection:true,openConfirm:false,typeConfirm:type})
  }

  saveChange = () => {
    this.setState({openSelection:false})
    console.log(this.props.history)
    this.props.history.push('/analisis')
  }

  _onMapLoad = map => {
        const marker = []
        this.state.places.map((value,index)=>{
             marker[index]= new window.google.maps.Marker({
                position: { lat:value.lat, lng:value.lng },
                map: map,
                title: value.name,
                extraData:value
            });
        })
  }

    componentDidMount(){
        var data = {}; 
        responseJson.items.map(el=> {
        if(el.id == this.props.match.params.id) 
            data = el
            return true
        })
        this.setState(data)
    }

    changeInfo = (props) => {
        var data = {}; 
        responseJson.items.map(el=> {
        if(el.id == props.match.params.id) 
            data = el
            return true
        })
        this.setState(data)
    }

    static getDerivedStateFromProps(props, state) {        
        if (props.match.params.id !== state.id) {
            return (responseJson.items.filter(el => el.id == props.match.params.id)[0])
        }
        return null;
    }
    

}

export default Details;