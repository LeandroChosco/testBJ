import React, { useEffect, useState } from 'react'
// import PaginationNumber from './PaginationNumber'
import MediaContainer from '../MediaContainer'
import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from 'reactstrap';
import { Col, Row } from 'react-bootstrap';
import { LANG } from '../../constants/token';

export default function PaginationList(props) {
    const { awsApiStreamsCams, videoList, reloadData, download, isDownloadSearch, dnsArray, protocolDownload, hasDns, dnsContainer, portContainer, servidorMultimedia, noButtons, isRecord, typeMBOX, selectedCamera, historyServerDns, historyServerPort, historyServerProtocol, numberVideos, renderLoading, isQnap, isAxxonSearch, withAccordion, getHistoricsByHour, historicCurrentDay } = props;
    // const [videos, setVideos] = useState(videoList)
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const totalVideos = numberVideos
    // if(videoList.length !== videos.length){
    //     setVideos(videoList)
    // }

    const [showCams, setShowCams] = useState(null);
    const toggle = (id) => {
        if (showCams === id) {
            setShowCams();
        } else {
            setShowCams(id);
        }
    };

    const indexOfLastPost = currentPage * totalVideos;
    const indexOfFirstPost = indexOfLastPost - totalVideos;
    const currentPost = videoList.slice(indexOfFirstPost, indexOfLastPost);

    // function paginate(pageNumber) {
    //     setLoading(true);
    //     setCurrentPage(pageNumber);
    //     setTimeout(() => {
    //         setLoading(false);
    //     }, 1000);
    // }

    useEffect(() => {
        if (!videoList[0].format) {
            if ((videoList[0] && videoList[0].length > 0) || videoList[0] && !videoList[0].hour) {
                getHistoricsByHour(historicCurrentDay);
            };
        };
    }, []);

    return (
        <>
            {/* <PaginationNumber videos={totalVideos} allVideos={videoList} totalVideos={videoList.length} paginate={paginate} currentPage={currentPage} />
            <br /> */}
            {loading ? renderLoading() :
                videoList[0] ?
                    videoList[0].relative_url ?
                        <div className="row">
                            {videoList.map((video, idx) => {
                                return (
                                    <div className="col-6">
                                        <MediaContainer
                                            key={idx}
                                            value={video}
                                            isQnap={selectedCamera.dataCamValue.qnap_server_id ? true : false}
                                            dns_ip={hasDns && `http://${hasDns}`}
                                            exists_video={true}
                                            cam={selectedCamera}
                                            dnsContainer={dnsContainer}
                                            port={portContainer}
                                            src={video.relative_url ? video.relative_url : video.relative_path_video}
                                            real_hour={video.real_hour}
                                            reloadData={reloadData}
                                            servidorMultimedia={servidorMultimedia}
                                            awsApiStreamsCams={awsApiStreamsCams}
                                            noButtons={noButtons}
                                            isRecord={isRecord}
                                            typeMBOX={typeMBOX}
                                            exists_image_historic={video.exists_image}
                                            historyServerDns={historyServerDns}
                                            historyServerPort={historyServerPort}
                                            historyServerProtocol={historyServerProtocol}
                                            coverImage={video.relative_path_image}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                        :
                        videoList[0].hour && withAccordion ?
                            <div>
                                <Accordion open={showCams} toggle={toggle}>
                                    {
                                        videoList.map((el, i) => {
                                            return (
                                                <AccordionItem>
                                                    <AccordionHeader targetId={i} className="accordionBorders navBarStyle" >
                                                        <h4 className='date-toggle'>
                                                            {el.fecha} - {el.hour}
                                                        </h4>
                                                    </AccordionHeader>
                                                    <AccordionBody accordionId={i}>
                                                        <Col>
                                                            <Row>
                                                                {el.videos.slice(0, 2).map((video, idx) => (
                                                                    !isDownloadSearch ?
                                                                        <MediaContainer
                                                                            key={idx}
                                                                            value={video}
                                                                            isQnap={selectedCamera.dataCamValue.qnap_server_id ? true : false}
                                                                            dns_ip={hasDns && `http://${hasDns}`}
                                                                            exists_video={true}
                                                                            cam={selectedCamera}
                                                                            dnsContainer={dnsContainer}
                                                                            port={portContainer}
                                                                            src={video.relative_url ? video.relative_url : video.relative_path_video}
                                                                            real_hour={video.real_hour}
                                                                            reloadData={reloadData}
                                                                            servidorMultimedia={servidorMultimedia}
                                                                            awsApiStreamsCams={awsApiStreamsCams}
                                                                            noButtons={noButtons}
                                                                            isRecord={isRecord}
                                                                            typeMBOX={typeMBOX}
                                                                            exists_image_historic={video.exists_image}
                                                                            historyServerDns={historyServerDns}
                                                                            historyServerPort={historyServerPort}
                                                                            historyServerProtocol={historyServerProtocol}
                                                                            coverImage={video.relative_path_image}
                                                                        />
                                                                        :
                                                                        (<button key={idx} className="btn btn-outline-primary ml-auto mr-auto mb-2" onClick={() => download(video, dnsArray, protocolDownload)}>{`${dnsArray !== null ? video.fecha : video.fecha} - ${video.real_hour ? video.real_hour : null}`}</button>)
                                                                ))}
                                                            </Row>
                                                            <Row>
                                                                {el.videos.slice(2, 4).map((video, idx) => (
                                                                    !isDownloadSearch ?
                                                                        <MediaContainer
                                                                            key={idx}
                                                                            value={video}
                                                                            isQnap={selectedCamera.dataCamValue.qnap_server_id ? true : false}
                                                                            dns_ip={hasDns && `http://${hasDns}`}
                                                                            exists_video={true}
                                                                            cam={selectedCamera}
                                                                            dnsContainer={dnsContainer}
                                                                            port={portContainer}
                                                                            src={video.relative_url ? video.relative_url : video.relative_path_video}
                                                                            real_hour={video.real_hour}
                                                                            reloadData={reloadData}
                                                                            servidorMultimedia={servidorMultimedia}
                                                                            awsApiStreamsCams={awsApiStreamsCams}
                                                                            noButtons={noButtons}
                                                                            isRecord={isRecord}
                                                                            typeMBOX={typeMBOX}
                                                                            exists_image_historic={video.exists_image}
                                                                            historyServerDns={historyServerDns}
                                                                            historyServerPort={historyServerPort}
                                                                            historyServerProtocol={historyServerProtocol}
                                                                            coverImage={video.relative_path_image}
                                                                        />
                                                                        :
                                                                        (<button key={idx} className="btn btn-outline-primary ml-auto mr-auto mb-2" onClick={() => download(video, dnsArray, protocolDownload)}>{`${dnsArray !== null ? video.fecha : video.fecha} - ${video.real_hour ? video.real_hour : null}`}</button>)
                                                                ))}
                                                            </Row>
                                                        </Col>
                                                    </AccordionBody>
                                                </AccordionItem>
                                            )
                                        })
                                    }
                                </Accordion>
                            </div>
                            :
                            awsApiStreamsCams && currentPost[0].videos ?
                                <div>
                                    {currentPost.map((list, idx) => (
                                        <div key={idx} className="row">
                                            {(!isRecord && dnsArray) || (list.fecha && list.hour) ? (
                                                <div className="col-12">
                                                    {!isDownloadSearch ?
                                                        <>
                                                            {!isQnap ?
                                                                <h4 className="title-date">{`${dnsArray !== null || videoList.length > 0 ? list.videos[0].fecha : list.fecha} - ${dnsArray !== null || videoList.length > 0 ? list.videos[0].hour : list.hour}`}</h4>
                                                                :
                                                                <h4>{"Date no available"}</h4>}
                                                        </>
                                                        :
                                                        null
                                                    }
                                                </div>
                                            ) : null}
                                            {list.videos.map((video, idx) => (

                                                !isDownloadSearch ?
                                                    <MediaContainer
                                                        key={idx}
                                                        value={video}
                                                        isQnap={selectedCamera.dataCamValue.qnap_server_id ? true : false}
                                                        dns_ip={hasDns && `http://${hasDns}`}
                                                        exists_video={true}
                                                        cam={selectedCamera}
                                                        dnsContainer={dnsContainer}
                                                        port={portContainer}
                                                        src={video.relative_url ? video.relative_url : video.relative_path_video}
                                                        real_hour={video.real_hour}
                                                        reloadData={reloadData}
                                                        servidorMultimedia={servidorMultimedia}
                                                        awsApiStreamsCams={awsApiStreamsCams}
                                                        noButtons={noButtons}
                                                        isRecord={isRecord}
                                                        typeMBOX={typeMBOX}
                                                        exists_image_historic={video.exists_image}
                                                        historyServerDns={historyServerDns}
                                                        historyServerPort={historyServerPort}
                                                        historyServerProtocol={historyServerProtocol}
                                                        coverImage={video.relative_path_image}
                                                    />
                                                    :
                                                    (<button key={idx} className="btn btn-outline-primary ml-auto mr-auto mb-2" onClick={() => download(video, dnsArray, protocolDownload)}>{`${dnsArray !== null ? video.fecha : video.fecha} - ${video.real_hour ? video.real_hour : null}`}</button>)
                                            ))}
                                        </div>
                                    ))
                                    }
                                </div >
                                :
                                currentPost[0] && currentPost[0].archive ?
                                    (<button className="btn btn-outline-primary ml-auto mr-auto mb-2" onClick={() => download(currentPost[0], dnsArray, protocolDownload)}>{`${currentPost[0].search_start_time} - ${currentPost[0].search_end_time} (Format ${currentPost[0].format})`}</button>)
                                    :
                                    currentPost[0] && currentPost[0].fecha ?
                                        <div className="row">
                                            {currentPost.map((list, idx) => (
                                                (!isDownloadSearch ? (
                                                    <>
                                                        {idx % 2 === 0 ?
                                                            <div className="col-12">
                                                                {!isRecord && !isDownloadSearch ?
                                                                    <>
                                                                        {!isQnap ?
                                                                            <h4>{`${dnsArray !== null || videoList.length > 0 ? list.fecha : null} - ${dnsArray !== null || videoList.length > 0 ? list.hour : null}`}</h4>
                                                                            :
                                                                            <h4>{"Date no available"}</h4>}
                                                                    </>
                                                                    // <h4>{`${dnsArray !== null ? list.datetime_start : null} - ${dnsArray !== null ? list.datetime_start : null}`}</h4>
                                                                    :
                                                                    null
                                                                }
                                                            </div> : null}
                                                        <MediaContainer
                                                            key={idx}
                                                            value={list}
                                                            isQnap={selectedCamera.dataCamValue.qnap_server_id ? true : false}
                                                            dns_ip={hasDns && `http://${hasDns}`}
                                                            exists_video={true}
                                                            cam={selectedCamera}
                                                            dnsContainer={dnsContainer}
                                                            port={portContainer}
                                                            src={list.relative_url ? list.relative_url : list.relative_path_video}
                                                            real_hour={list.real_hour}
                                                            reloadData={reloadData}
                                                            servidorMultimedia={servidorMultimedia}
                                                            awsApiStreamsCams={awsApiStreamsCams}
                                                            noButtons={noButtons}
                                                            isRecord={isRecord}
                                                            typeMBOX={typeMBOX}
                                                            exists_image_historic={list.exists_image}
                                                            historyServerDns={historyServerDns}
                                                            historyServerPort={historyServerPort}
                                                            historyServerProtocol={historyServerProtocol}
                                                            coverImage={list.relative_path_image}
                                                        />
                                                    </>
                                                ) :
                                                    <>
                                                        {
                                                            isAxxonSearch ?
                                                                <button key={idx} className="btn btn-outline-primary ml-auto mr-auto mb-2" onClick={() => download(list, dnsArray, protocolDownload)}>{`Opción ${idx + 1}(${list.format}) :${list.search_start_time} - ${list.search_end_time}`}</button>
                                                                :
                                                                <button key={idx} className="btn btn-outline-primary ml-auto mr-auto mb-2" onClick={() => download(list, dnsArray, protocolDownload)}>{`${dnsArray !== null ? list.fecha : list.fecha} - ${list.real_hour ? list.real_hour : null}`}</button>

                                                        }
                                                    </>

                                                )

                                            ))}

                                        </div>
                                        :
                                        <div align="center">
                                            <p className="big-letter">{localStorage.getItem(LANG) === "english" ? "No files to show" : "No hay archivos que mostrar"}</p>
                                            <i className="fa fa-image fa-5x" />
                                        </div>
                    :
                    <div align="center">
                        <p className="big-letter">{localStorage.getItem(LANG) === "english" ? "No files to show" : "No hay archivos que mostrar"}</p>
                        <i className="fa fa-image fa-5x" />
                    </div>
            }

        </>
    )
}
