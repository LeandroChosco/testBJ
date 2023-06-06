import React from 'react';
import { HiOutlineUserGroup } from 'react-icons/hi2'

export default function ActionsCuadrantes(props) {

    const [row, setCurrentData, setShowModalManagmentCuadrantes] = props.data;

    return (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
            <HiOutlineUserGroup data-toggle="tooltip" data-placement="top" title="Gestión de usuarios" className="actionBtn" onClick={() => {
                setCurrentData(row)
                setShowModalManagmentCuadrantes(true)
            }} />
        </div>
    )
}