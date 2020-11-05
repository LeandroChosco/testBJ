import React, { Component } from 'react';
import '../../assets/styles/util.css';
import '../../assets/styles/main.css';
import '../../assets/fonts/iconic/css/material-design-iconic-font.min.css'
import './style.css'
import conections from '../../conections';
import {
  PieChart, 
  Pie, 
  Legend, 
  Tooltip, 
  Cell, 
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  LabelList,  
  ComposedChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Text
} from 'recharts';
import ColorScheme from 'color-scheme'
import { ClassicSpinner } from "react-spinners-kit";
import Card from "../../components/Card/Card";
import CardHeader from "../../components/Card/CardHeader";
import CardBody from '../../components/Card/CardBody';
import neutralEmoji from '../../assets/images/emojis/neutral.png'
import sadEmoji from '../../assets/images/emojis/triste.png'
import happyEmoji from '../../assets/images/emojis/feliz.png'
import angryEmoji from '../../assets/images/emojis/enojado.png'
import surpriseEmoji from '../../assets/images/emojis/sorprendido.png'
import { Tab } from 'semantic-ui-react'
import socketIOClient from 'socket.io-client';
import sailsIOClient from 'sails.io.js';
import constants from '../../constants/constants';
import * as moment from 'moment'

const scm = new ColorScheme();
const COLORS =  scm.from_hue(235)
  .scheme('analogic')
  .distance(0.3)
  .add_complement(false)
  .variation('pastel')
  .web_safe(false).colors();


  const MOODS = {
    "Happy":"Feliz",
    "Happiness":"Feliz",
    "Sad":"Triste",
    "Sadness":"Triste",
    "Angry":"Enojado",
    "Anger":"Enojado",
    "Surprised":"Sorprendido",
    "Surprise":"Sorprendido",
    "Disgusted":"Disgustado",
    "Contemptuous":"Desprecio",
  }

class Dashboard extends Component {

    state = {    
      loadingCams: true,
      dataCams: [],
      loadingTickets: true,
      dataTickets:[],
      dataTotalTickets:[],
      dataTicketsPerUser:{
        closed:[],
        attended:[],
        created:[]
      },
      loadTotalRecognition:true,
      loadRecognitionAges:true,
      loadingRecognitionPerDay:true,
      loadingRecognitionMood:true,
      loadingCamsGrid:true,
      personsMood:[
        {
          "mood": "Feliz",
          "total": 25,          
          "fullMark": 100
        },
        {
          "mood": "Enojado",
          "total": 55,          
          "fullMark": 100
        },
        {
          "mood": "Triste",
          "total": 65,          
          "fullMark": 100
        },
        {
          "mood": "Neutral",
          "total": 52,          
          "fullMark": 100
        },
        {
          "mood": "Procupado",
          "total": 60,          
          "fullMark": 100
        },
        {
          "mood": "Ansioso",
          "total": 90,          
          "fullMark": 100
        }
      ],
      genderDetected:[],
      agesDetected:[],
      personsperDay:[],
      attendedVSclosed: [],
      panes: [
        { menuItem: 'Camaras', render: () => <Tab.Pane attached={false}>{this.renderCamsDashboard()}</Tab.Pane> },
        { menuItem: 'Tickets', render: () => <Tab.Pane attached={false}>{this.renderTicketsDashboard()}</Tab.Pane> },
        { menuItem: 'Reconocimiento', render: () => <Tab.Pane attached={false}>{this.renderRecognitionDashboard()}</Tab.Pane> },
      ]
    }

  renderCamsDashboard() {
    const c = shuffle(COLORS);
    return (
        <div className='container-flex'>
          <div className='row'>
          <div className='col chart overflow table-responsive' align='center'>
          {
              this.state.loadingCamsGrid?
              <ClassicSpinner 
                loading={true}
                size={40}
                color="#686769"
              />:
            
            this.state.lastCreatedCams?
              <div>
                <table className="table table-striped stiky">
                  <thead>
                    <tr>
                      <th>Estatus</th>
                      <th>Numero de camara</th>
                      <th>Dirección</th>
                      <th>Fecha Instalación</th>
                    </tr>
                  </thead>
                  <tbody>
                  {this.state.lastCreatedCams.map?this.state.lastCreatedCams.map((value,index)=>
                    <tr key={index} >
                      <td><div className={'state'+value.flag_streaming}>&nbsp;</div></td>
                      <td >{value.num_cam}</td>
                      <td >{value.street} {value.number}, {value.town}, {value.township}, {value.state}</td>
                      <td >{new Date(value.date_creation).toLocaleString()}</td>
                    </tr>
                  ):<tr><td colSpan='4' align='center'>Sin datos que mostrar</td></tr>}
                  </tbody>
                </table>                                
              </div>
              :null}

            </div>
            <div className='col chart' align='center'>
              <h3>Estatus de camaras</h3>
            {
              this.state.loadingCams?
                <ClassicSpinner 
                  loading={true}
                  size={40}
                  color="#686769"
                />:
                <ResponsiveContainer>
                  <PieChart>
                    <Legend />
                    <Pie  data={this.state.dataCams} dataKey="value" nameKey="name" label>
                    {
                      this.state.dataCams.map((entry, index) => <Cell key={`cell-${index}`} fill={'#'+COLORS[index%COLORS.length]} />)
                    }
                    </Pie>                
                    <Tooltip/>
                  </PieChart>
                </ResponsiveContainer>
            }
            </div>            
          </div>
          <div className="row">
            <div className='col-6 chart'align='center'>
              <h3>Camara  instaladas por mes</h3>
              {
                this.state.loadingCams?
                  <ClassicSpinner 
                    loading={true}
                    size={40}
                    color="#686769"
                  />:<ResponsiveContainer>
                  <ComposedChart                   
                    data={this.state.installed_by_moth}                    
                    margin={{
                      top: 5, right: 30, left: 20, bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="fecha" />
                    <YAxis allowDecimals={false}/>
                    <Tooltip />      
                    <Legend />              
                    <Bar dataKey="total" fill={'#'+COLORS[2]}/>                  
                  </ComposedChart>
                </ResponsiveContainer>  
              }
              </div>
              <div className='col-6 chart'align='center'>
              <h3>Camara instaladas Ultimo mes</h3>
              {
                this.state.loadingCams?
                  <ClassicSpinner 
                    loading={true}
                    size={40}
                    color="#686769"
                  />:<ResponsiveContainer>
                  <ComposedChart                   
                    data={this.state.installed_last_moth}                    
                    margin={{
                      top: 5, right: 30, left: 20, bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="fecha" />
                    <YAxis allowDecimals={false}/>
                    <Tooltip />      
                    <Legend />              
                    <Bar dataKey="total" fill={'#'+COLORS[0]}/>                  
                  </ComposedChart>
                </ResponsiveContainer>  
              }
              </div>
          </div>
        </div>
    );
  }


  renderTicketsDashboard() {
    return (
        <div className='container-flex'>
          <div className='row'>            
            <div className='col chart' align='center'>
            <h3>Estatus de tickets</h3>
            {
              this.state.loadingTickets?
              <ClassicSpinner 
                loading={true}
                size={40}
                color="#686769"
              />:
                <ResponsiveContainer>
                  <PieChart>
                    <Legend />
                    <Pie  data={this.state.dataTickets} outerRadius={95} dataKey="value" nameKey="name" >
                    {
                      this.state.dataTickets.map((entry, index) => <Cell key={`cell-${index}`} fill={'#'+COLORS[index % COLORS.length]} />)
                    }
                    </Pie> 
                    <Pie data={this.state.dataTotalTickets} dataKey="value" innerRadius={100} outerRadius={110} fill={"#" + COLORS[COLORS.length-1]} label />               
                    <Tooltip/>
                  </PieChart>
                </ResponsiveContainer>
            }
            </div>
          </div>
          <div className='row'>
            <div className='col-6 chart2x' align='center'>
              <h3>Tickets creados por usuario</h3>
            {
              this.state.loadingTickets?
              <ClassicSpinner 
                loading={true}
                size={40}
                color="#686769"
              />:
                <ResponsiveContainer>
                  <ComposedChart                   
                    data={this.state.dataTicketsPerUser.created}
                    layout='vertical'
                    margin={{
                      top: 5, right: 30, left: 20, bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis  type="number"/>
                    <YAxis 
                      dataKey="name" 
                      type="category"
                      hide={true}                      
                    />
                    <Tooltip />                    
                    <Bar barSize={30} dataKey="total" fill="#8884d8" >
                      <LabelList 
                        dataKey="name"  
                        position="right" 
                        fill='#000' 
                        
                        content={customLabel}                         
                      />
                    {
                      this.state.dataTicketsPerUser.created.map((entry, index) => <Cell key={`cell-${index}`} fill={'#'+COLORS[index%COLORS.length]} />)
                    }
                    </Bar>                    
                  </ComposedChart>
                </ResponsiveContainer>
            }
            </div>           
            <div className='col-6 chart2x' align='center'>
              <h3>Tickets atendidos y cerrados por usuario</h3>
            {
              this.state.loadingTickets?
                <ClassicSpinner 
                  loading={true}
                  size={40}
                  color="#686769"
                />:
                <ResponsiveContainer>
                  <ComposedChart                   
                    data={this.state.attendedVSclosed}                    
                    margin={{
                      top: 5, right: 30, left: 20, bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis/>
                    <Tooltip />      
                    <Legend />              
                    <Bar barSize={30} dataKey="Cerrados" fill={'#'+COLORS[0%COLORS.length]} />
                    <Bar  barSize={30} dataKey="Proceso" fill={'#'+COLORS[1%COLORS.length]} />                   
                  </ComposedChart>
                </ResponsiveContainer>
            }
            </div>       
          </div>
        </div>
    );
  }

  renderRecognitionDashboard() {
    return (
      <div className='container-flex'>
        <div className='row'>
          <div className='col-6 chart' align='center'>
            {
              this.state.loadTotalRecognition ?
                <ClassicSpinner
                  loading={true}
                  size={40}
                  color="#686769"
                /> :
                <Card  style={{ width: '45rem', height: '20rem' }}>
                  <CardHeader color="blue">
                <h4 className="pt-2">Personas detectadas</h4>
              </CardHeader>
                <ResponsiveContainer>
                  <PieChart>
                    <Legend />
                    <Pie innerRadius={60} outerRadius={80} paddingAngle={5} fill="#8884d8" data={this.state.genderDetected} dataKey="value" nameKey="name" >
                      {
                        this.state.dataTickets.map((entry, index) => <Cell key={`cell-${index}`} fill={'#' + COLORS[index % COLORS.length]} />)
                      }
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer></Card>}
                  
          </div>
          <div className='col-6 chart' align='center'>
            <Card  style={{ width: '45rem', height: '20rem' }}>
            <CardHeader color="blue">
                <h4 className="pt-2">Estado de Animo</h4><br></br><br></br>
              </CardHeader>
              <CardBody>
                 
            <ul className="cardlist">
              <li>
                <img src={neutralEmoji} width='20%'></img>
                <h4>Neutral</h4>
            {this.state.personsMood[0].total}
              </li>
              <li>
              <img src={surpriseEmoji} width='20%'></img>
            <h4>Sorprendido</h4>
              {this.state.personsMood[1].total}
              </li>
              <li>
              <img src={sadEmoji} width='20%'></img>
            <h4>Triste</h4> 
              {this.state.personsMood[2].total}
              </li>
              <li>
              <img src={happyEmoji} width='20%'></img>
            <h4>Feliz</h4>
              {this.state.personsMood[3].total}
              </li>
              <li>
              <img src={angryEmoji} width='20%'></img>
            <h4>Enojado</h4>
              {this.state.personsMood[4].total}
              </li>
            </ul>
              </CardBody>

</Card>

            {/* {
              this.state.loadingRecognitionMood ?
                <ClassicSpinner
                  loading={true}
                  size={40}
                  color="#686769"
                /> : <ResponsiveContainer>
                  <RadarChart data={this.state.personsMood}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="mood" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="assaEstado de animo" dataKey="total" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />

                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>} */}
          </div>
        </div>
        <div className='row'>
          <div className='col-6 chart' align='center'>
            <h3>Rango de edades</h3>           
            {
              this.state.loadRecognitionAges?
                <ClassicSpinner 
                  loading={true}
                  size={40}
                  color="#686769"
                />:<ResponsiveContainer>
              <ComposedChart                   
                data={this.state.agesDetected}                    
                margin={{
                  top: 5, right: 30, left: 20, bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis/>
                <Tooltip />      
                <Legend />              
                <Bar dataKey="Mujeres" fill={'#'+COLORS[0]} />
                <Bar dataKey="total" fill={'#'+COLORS[1]}  />                
                <Bar dataKey="Hombres" fill={'#'+COLORS[2]} />
              </ComposedChart>
              </ResponsiveContainer>}          
          </div> 
          <div className='col-6 chart' align='center'>
            <h3>Personas por dia</h3>           
            {
              this.state.loadingRecognitionPerDay?
                <ClassicSpinner 
                  loading={true}
                  size={40}
                  color="#686769"
                />:<ResponsiveContainer>
              <ComposedChart                   
                data={this.state.personsperDay}                    
                margin={{
                  top: 5, right: 30, left: 20, bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis/>
                <Tooltip />      
                <Legend />                              
                <Bar dataKey="total" fill={'#'+COLORS[1]}  />                
              </ComposedChart>
              </ResponsiveContainer>  }        
          </div>            
        </div>
      </div>
    )
  }

  render(){
    return(
      <div className={!this.props.showMatches ? "hide-matches" : "show-matches"}>
        <div className={this.props.showMatches ? "hide-matches" : "show-matches"}>

          <button className='btn clear pull-right' onClick={this.loadData}><i className={'fa fa-repeat'}></i>Actualizar</button>
        </div>
        <Tab menu={{ secondary: true, pointing: true }} panes={this.state.panes} />
      </div>
    )
  }

  componentWillUnmount(){    
    if (this.state.io) {
      if (this.state.io.socket.isConnected()) {
        this.state.io.socket.disconnect(); 
      }      
    }
  }

  loadData = () => {
    this.setState({
      loadingCams:true,
      loadingTickets:true,
      loadTotalRecognition:true,
      loadRecognitionAges:true,
      loadingRecognitionPerDay:true,
      loadingRecognitionMood:true,
      loadingCamsGrid:true
    })
    conections.dashboardCams().then(response => {
      const data = response.data; 
      console.log('datilla: ', data)     
      this.setState({
        loadingCams:false,
        dataCams:[
          {name:'Activas',value:data.active},
          {name:'Inactivas',value:data.deactive},
          {name:'Desconectadas',value:data.disconnected}
        ],
        installed_by_moth:data.installed_by_moth.map(v=>{v.fecha =moment(v.fecha).format('MMM-YYYY'); return v}),
        installed_last_moth:data.installed_last_moth.map(v=>{v.fecha =moment(v.fecha).format('DD-MM-YYYY'); return v})
      })
    })
    conections.dashboardTickets().then(this.processTicketsData)
    conections.dashboardTotalRecognition().then(this.processDetected)
    conections.dashboardRecognitionAges().then(this.processAges)
    conections.dashboardRecognitionPerDay('?enddate='+moment().format('YYYY-MM-DD')+'&startdate='+moment().add(-15,'days').format('YYYY-MM-DD')).then(this.processPerDay)
    conections.dashboardRecognitionMood().then(this.processMood)
    conections.loadCams().then(this.lastCreatedCams).catch(err=>{
      console.log('Cargando camaras',err)
    })
    /*let io;
    if (socketIOClient.sails) {
      io = socketIOClient;
      if(!io.socket.isConnected()&&!io.socket.isConnecting()) {
        io.socket.reconnect()
      }
    } else {
      io = sailsIOClient(socketIOClient);
    }
    this.setState({io:io})    
    io.sails.url = constants.base_url+':1337';
    io.socket.get('/cams?sort=num_cam asc&active=1&limit=10000', this.lastCreatedCams) */
  }

  processMood = (response) => {
    let data =  []
    let indexes =  []
    response.data.data.map(v=>{
      v.mood = MOODS[v.mood] ? MOODS[v.mood] : v.mood
      if (indexes.indexOf(v.mood)>-1) {
        data[indexes.indexOf(v.mood)].percentage = (v.percentage + data[indexes.indexOf(v.mood)].percentage) / 2
      } else {
        data.push(v)
        indexes.push(v.mood)
      }
      return v;
    })    
    console.log('mood data',data)
    this.setState({personsMood:data,loadingRecognitionMood:false})
  }
  
  processPerDay = (response) => {
    const data = response.data.data    
    this.setState({personsperDay:data,loadingRecognitionPerDay:false})
  }

  processDetected = (response) => {
    const data = response.data.data
    this.setState({
      genderDetected:[
        {
          name:'Mujer',
          value:data.women_detected
        },{
          name:'Hombre',
          value:data.men_detected
        }
      ],
      loadTotalRecognition:false
    })    
  } 

  processAges = (response) => {
    const data = response.data.data
    this.setState({
      agesDetected:[
        {
          name:'-18',
          total:data.total_under_18,
          Hombres:data.men_under_18,
          Mujeres:data.women_under_18
        },{
          name:'18-30',
          total:data.total_between_18_30,
          Hombres:data.men_between_18_30,
          Mujeres:data.women_between_18_30
        },{
          name:'31-50',
          total:data.total_between_31_50,
          Hombres:data.men_between_31_50,
          Mujeres:data.women_between_31_50
        },{
          name:'50+',
          total:data.total_over_50,
          Hombres:data.men_over_50,
          Mujeres:data.women_over_50
        }
      ],
      loadRecognitionAges:false
    })
  }

  componentDidMount() {    
    this.loadData()           
  }

  lastCreatedCams = (response) => {    
    const data = response.data    
    this.setState({lastCreatedCams:data,loadingCamsGrid:false})
  }


  processTicketsData = (response) => {
    const dataTickets = response.data;     
    const ticketStatus = [{
      name:'Abiertos', value:dataTickets.open
    },{
      name:'En proceso', value:dataTickets.process
    },{
      name:'Cerrados', value:dataTickets.closed
    }]
    const totaltickets = [{
      name:'Total', value:dataTickets.total
    }]
    

    let attendedVSclosed = dataTickets.total_closed_tickets_by_user.map(v=>{
      let found = false
      v.Cerrados = parseInt(v.total.toString());
      for (let index = 0; index <  dataTickets.total_attended_tickets_by_user.length; index++) {
        const element =  dataTickets.total_attended_tickets_by_user[index];
        if (element.name === v.name) {
          found = true;
          v.Proceso = element.total;
          break;
        }
      }
      if (!found) {
        v.Proceso = 0;
      }
      delete v.total
      return v;
    })
    dataTickets.total_attended_tickets_by_user.map(v=>{
      let found = false        
      for (let index = 0; index <  attendedVSclosed.length; index++) {
        const element =  attendedVSclosed[index];
        if (element.name === v.name) {
          found = true;      
          break;      
        }
      }
      if (!found) {
        attendedVSclosed.push({name:v.name,Cerrados:0,Proceso:v.total})
      }
      return v;
    })    
    this.setState({
      loadingTickets:false, 
      dataTickets:ticketStatus,
      dataTotalTickets:totaltickets,
      dataTicketsPerUser:{
        created:dataTickets.total_created_tickets_by_user,
        attended:dataTickets.total_attended_tickets_by_user,
        closed:dataTickets.total_closed_tickets_by_user
      },
      attendedVSclosed:attendedVSclosed
    });
  }

}

function customLabel(p){      
    return(      
        <Text 
          fontSizeAdjust='true'           
          verticalAnchor='middle'
          width={300}
          height={p.height}                              
          x={p.x+5}
          y={p.y+10}
        >
            {p.value}
        </Text>      
    )
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

export default Dashboard;
