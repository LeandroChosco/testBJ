import React from 'react';
import { BsFillXCircleFill, BsArrowRepeat, BsFillUnlockFill } from "react-icons/bs";
import { FaObjectUngroup } from "react-icons/fa";


export default function Actions(props) {

    const [row, setCurrentData, setShowModalUserDetail, setShowModalUserUpdate, setShowModalUserDelete] = props.data;

    return (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
            <BsFillUnlockFill data-toggle="tooltip" data-placement="top" title="Reestablecer contraseña" className="actionBtn" style={{ color: "black" }} onClick={() => {
                setCurrentData(row)
                setShowModalUserDetail(true)

            }} />
            <BsArrowRepeat data-toggle="tooltip" data-placement="top" title="Actualizar usuario" className="actionBtn" style={{ color: "rgba(82,167,226,1)" }} onClick={() => {
                setCurrentData(row)
                if (row.user_nicename) {
                    setShowModalUserUpdate(true)
                }
            }} />
            <BsFillXCircleFill data-toggle="tooltip" data-placement="top" title="Eliminar usuario" className="actionBtn" style={{ color: "red" }} onClick={() => {
                setCurrentData(row)
                if (row.user_nicename) {
                    setShowModalUserDelete(true)
                }
            }} />
        </div>
    )
}