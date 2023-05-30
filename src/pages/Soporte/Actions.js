import React from 'react';
import { BsFillXCircleFill, BsArrowRepeat } from "react-icons/bs";


export default function Actions(props) {

    const { row, setCurrentData, setShowModalCatAddress, setShowModalCatCarrier, setShowModalUrlApi, setShowModalUrlStorage, setShowModalUrlStream } = props

    return (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
            <BsArrowRepeat data-toggle="tooltip" data-placement="top" title="Actualizar" className="actionBtn" style={{ color: "rgba(82,167,226,1)" }} onClick={() => {
                setCurrentData(row)
                switch (row.__typename) {
                    case "CatAddress":
                        setShowModalCatAddress("Actualizar Cat Address")
                        break;
                    case "CatCarrier":
                        setShowModalCatCarrier("Actualizar Cat Carrier")
                        break;
                    case "CatUrlApi":
                        setShowModalUrlApi("Actualizar Url Api")
                        break;
                    case "CatUrlStream":
                        setShowModalUrlStream("Actualizar Url Stream")
                        break;
                    case "CatUrlStorage":
                        setShowModalUrlStorage("Actualizar Url Storage")
                        break;
                    default:
                        break;
                }

            }} />
            <BsFillXCircleFill data-toggle="tooltip" data-placement="top" title="Eliminar" className="actionBtn" style={{ color: "red" }} onClick={() => {
                setCurrentData(row)
                switch (row.__typename) {
                    case "CatAddress":
                        setShowModalCatAddress("Eliminar Cat Address")
                        break;
                    case "CatCarrier":
                        setShowModalCatCarrier("Eliminar Cat Carrier")
                        break;
                    case "CatUrlApi":
                        setShowModalUrlApi("Eliminar Url Api")
                        break;
                    case "CatUrlStream":
                        setShowModalUrlStream("Eliminar Url Stream")
                        break;
                    case "CatUrlStorage":
                        setShowModalUrlStorage("Eliminar Url Storage")
                        break;
                    default:
                        break;
                }
            }} />
        </div>
    )
}