import React, { Component } from 'react';
import './style.css'
import { Input } from 'semantic-ui-react'
import  ModalAddCams  from '../../components/ModalAddCams'

class Cuadrantes extends Component{
    state = {
        auxCuadrantes:['Cuadrante 1','Cuadrante 2'],
        index: 2,
        showInput: false,
        valueNew: '',
        showModal: false,
        camSelection: 0
    }

    render(){
        return(
            <div>
                <div className="containerCuadrantes">
                    {this.state.auxCuadrantes.map((value,index) =>
                            <div key = {`cuadrante${index}`} className="ui left labeled button buttonCuadrantes" >
                                <a className="ui right pointing basic label" onClick={()=>this._camsCuadrante(index)}>{value}</a>
                                <button className="ui icon button">
                                    <i aria-hidden="true" className="plus icon" onClick={() => this._addCams(value)} ></i>
                                </button>
                            </div>
                        )
                    }
                    <button className="ui button buttonCuadrantes" onClick={()=>this._newCuadrante(true)}>Nuevo Cuadrante</button> 
                    {this.state.showInput ?
                        <div className="ui action input">
                            <Input focus className="formatInput" onChange={(e,{value})=>this.setState({valueNew:value})} value={this.state.valueNew} placeholder='Nombre Cuadrante' />
                            <button className="ui button" onClick={()=>this._newCuadrante(false)} disabled={this.state.valueNew === ''}>Agregar</button>
                        </div>
                    :null}   
                    {this.state.showModal ?
                        <ModalAddCams modal={this.state.showModal} hide={()=>this.setState({showModal:false})} name_cuadrante={this.state.camSelection} />
                    :null}  
                </div>
                
            </div>
        )
    }

    _newCuadrante = (action) => {
        console.log(action)
        let aux = this.state.auxCuadrantes
        if(action)
            this.setState({showInput:true})
        else{
            this.setState({showInput:false})
            console.log(this.state.valueNew)
            aux.push(this.state.valueNew)
            this.setState({auxCuadrantes:aux, valueNew:''})
        }
        
    }

    _addCams = (cam) =>{
        this.setState({showModal:true,camSelection:cam})
    }

    _camsCuadrante = (cuadrante) => {
        console.log(this.state.auxCuadrantes[cuadrante])
    }
}

export default Cuadrantes;