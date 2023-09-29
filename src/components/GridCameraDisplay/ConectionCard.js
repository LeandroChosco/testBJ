import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrochip } from '@fortawesome/free-solid-svg-icons';
import './style.css'

// ${info.camera.router.active === 1 ? "border-success bg-success" : "border-danger bg-danger"}

const ConectionCard = ({ info, index }) => {
  return (
    <div className='conection-card border rounded p-3 mr-1 mt-4' key={index}>
      <div className='row'>
        <div className='col-xl-4 col-lg-6 col-12'>
          <div className={`row my-2 p-1 col-md-12 border-0 rounded bg-secondary`}>
            <div className='col-xl-6 col-12'>
              <p className='text-light pb-1 mb-0'>
                IP Router
              </p>
              <p className='text-light pb-1 mb-0'>
                {info.camera.router.ip}
              </p>
            </div>
            <div className='col-xl-6 col-12 align-self-center'>
              <FontAwesomeIcon icon={faMicrochip} size="lg" style={{ color: info.camera.ip.active === 1 ? "#26a269" : "#e01b24" }} />
              <p className='text-light pb-1 mb-0'>
                {info.camera.router.active === 1 ? "Online" : "Offline"}
              </p>
            </div>
          </div>
        </div>
        <div className='col-xl-4 col-lg-6 col-12'>
          <div className={`row my-2 p-1 col-md-12 border-0 rounded bg-secondary`}>
            <div className='col-xl-6 col-12'>
              <p className='text-light pb-1 mb-0'>
                IP Cam
              </p>
              <p className='text-light pb-1 mb-0'>
                {info.camera.ip.ip}
              </p>
            </div>
            <div className='col-xl-6 col-12 align-self-center'>
              <FontAwesomeIcon icon={faMicrochip} size="lg" style={{ color: info.camera.ip.active === 1 ? "#26a269" : "#e01b24" }} />
              <p className='text-light pb-1 mb-0'>
                {info.camera.ip.active === 1 ? "Online" : "Offline"}
              </p>
            </div>
          </div>
        </div>
        <div className='col-xl-4 col-12 align-self-center'>
          <div className='my-2 p-1 col-md-12 border-0 rounded'>
            <p className='mb-1'>{info.createdAt}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConectionCard;