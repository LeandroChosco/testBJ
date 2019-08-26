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
      genderDetected:[{
        name:'Mujer',
        value:125
      },{
        name:'Hombre',
        value:242
      }],
      agesDetected:[{
        name:'-18',
        total:25,
        Hombres:15,
        Mujeres:10
      },{
        name:'18-30',
        total:135,
        Hombres:75,
        Mujeres:60
      },{
        name:'31-50',
        total:95,
        Hombres:40,
        Mujeres:55
      },{
        name:'50+',
        total:112,
        Hombres:60,
        Mujeres:52
      }],
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
          <div className='col chart overflow table-responsive'>
          {
              this.state.loadingCams?
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
                  {this.state.lastCreatedCams.map((value,index)=>
                    <tr key={index} >
                      <td><div className={'state'+value.flag_streaming}>&nbsp;</div></td>
                      <td >{value.num_cam}</td>
                      <td >{value.street} {value.number}, {value.town}, {value.township}, {value.state}</td>
                      <td >{new Date(value.date_creation).toLocaleString()}</td>
                    </tr>
                  )}
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
                    <YAxis/>
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

  renderRecognitionDashboard(){
    return (
      <div className='container-flex'>
        <div className='row'>                      
          <div className='col-6 chart' align='center'>
            <h3>Personas detectadas</h3>    
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
                <Pie  data={this.state.genderDetected} dataKey="value" nameKey="name" >
                {
                  this.state.dataTickets.map((entry, index) => <Cell key={`cell-${index}`} fill={'#'+COLORS[index % COLORS.length]} />)
                }
                </Pie>                     
                <Tooltip/>
              </PieChart>
              </ResponsiveContainer>}            
          </div>
          <div className='col-6 chart' align='center'>
            <h3>Estato de animo</h3>
            {
              this.state.loadingCams?
                <ClassicSpinner 
                  loading={true}
                  size={40}
                  color="#686769"
                />:<ResponsiveContainer>
              <RadarChart data={this.state.personsMood}>
                <PolarGrid />
                <PolarAngleAxis dataKey="mood" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Estado de animo" dataKey="total" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />                
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>}
          </div>
        </div>
        <div className='row'>
          <div className='col-6 chart' align='center'>
            <h3>Rango de edades</h3>           
            {
              this.state.loadingCams?
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
              this.state.loadingCams?
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
                <XAxis dataKey="fecha" />
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
      <div className='holder'>
        <div>
          <button className='btn clear pull-right' onClick={this.loadData}><i className={'fa fa-repeat'}></i>Actualizar</button>
        </div>
        <Tab menu={{ secondary: true, pointing: true }} panes={this.state.panes} />
      </div>
    )
  }

  componentWillUnmount(){
    if (this.state.io) {
      this.state.io.socket.disconnect();
    }
  }

  loadData = () => {
    this.setState({loadingCams:true,loadingTickets:true})
    conections.dashboardCams().then(response => {
      const data = response.data;
      console.log(data)
      this.setState({
        loadingCams:false,
        dataCams:[
          {name:'Activas',value:data.active},
          {name:'Inactivas',value:data.deactive},
        ],
        installed_by_moth:data.installed_by_moth.map(v=>{v.fecha =moment(v.fecha).format('MMM-YYYY'); return v}),
        installed_last_moth:data.installed_last_moth.map(v=>{v.fecha =moment(v.fecha).format('DD-MM-YYYY'); return v})
      })
    })
    conections.dashboardTickets().then(this.processTicketsData)
  }

  componentDidMount() {    
    
    conections.dashboardCams().then(response => {
      const data = response.data;
      console.log(data)
      this.setState({
        loadingCams:false,
        dataCams:[
          {name:'Activas',value:data.active},
          {name:'Inactivas',value:data.deactive},
        ],
        installed_by_moth:data.installed_by_moth.map(v=>{v.fecha =moment(v.fecha).format('MMM-YYYY'); return v}),
        installed_last_moth:data.installed_last_moth.map(v=>{v.fecha =moment(v.fecha).format('DD-MM-YYYY'); return v})
      })
    })

    conections.dashboardTickets().then(this.processTicketsData)

    let io;
    if (socketIOClient.sails) {
      io = socketIOClient;
      io.socket.reconnect()
    } else {
      io = sailsIOClient(socketIOClient);
    }
    io.sails.url = constants.base_url+':1337';
    io.socket.get('/cams?sort=num_cam asc&active=1&limit=10000', this.lastCreatedCams)    
    this.setState({io:io})
    let p = []
    for (let index = 15; index >= 0; index--) {
      p.push({
        fecha: moment().locale('es').add(-index,'day').format('DD MMMM'),
        total:Math.floor((Math.random()*Math.random()*100)+20)
      })
    }
    this.setState({personsperDay:p})
  }

  lastCreatedCams = (data) => {
    console.log('lastCreatedCams',data)
    this.setState({lastCreatedCams:data})
  }

  lastUpdatedCams = (data) => {
    console.log('lastUpdatedCams',data)
    this.setState({lastUpdatedCams:data})
  }


  processTicketsData = (response) => {
    const dataTickets = response.data;
    console.log(dataTickets)     
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
    console.log(attendedVSclosed)
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
