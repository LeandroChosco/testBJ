import React, { useState } from 'react'
import PaginationNumber from './PaginationNumber'
import MediaContainer from '../MediaContainer'
export default function PaginationList(props) {
    const { awsApiStreamsCams, videoList, reloadData, download, isDownloadSearch, dnsArray, protocolDownload, hasDns, dnsContainer, portContainer, servidorMultimedia, noButtons, isRecord, typeMBOX, selectedCamera, historyServerDns, historyServerPort, historyServerProtocol, numberVideos, renderLoading, isQnap } = props;
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const totalVideos = numberVideos;

    const indexOfLastPost = currentPage * totalVideos;
    const indexOfFirstPost = indexOfLastPost - totalVideos;
    const currentPost = videoList.slice(indexOfFirstPost, indexOfLastPost);

    function paginate(pageNumber) {
        setLoading(true);
        setCurrentPage(pageNumber);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }

    return (
        <>
            <PaginationNumber videos={totalVideos} allVideos={videoList} totalVideos={videoList.length} paginate={paginate} currentPage={currentPage} />
            <br />
            {loading ? renderLoading() :
                awsApiStreamsCams && currentPost[0].videos ?
                    <div>
                        {currentPost.map((list, idx) => (
                            <div key={idx} className="row">
                                {!isRecord && dnsArray || (list.fecha && list.hour) ? (
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
                                {list.videos.map((video, vidx) => (

                                    !isDownloadSearch ?
                                        <MediaContainer
                                            key={vidx}
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
                                        (<button key={vidx} className="btn btn-outline-primary ml-auto mr-auto mb-2" onClick={() => download(video, dnsArray, protocolDownload)}>{`${dnsArray !== null ? video.fecha : video.fecha} - ${video.real_hour ? video.real_hour : null}`}</button>)
                                ))}
                            </div>
                        ))
                        }
                    </div >


                    :
                    <div className="row">

                        {currentPost.map((list, idx) => (
                            (!isDownloadSearch ? (
                                <>
                                    {idx % 2 === 0 ?
                                        <div className="col-12">
                                            {!isRecord && !isDownloadSearch ?
                                                <>
                                                    {!isQnap ?
                                                        <h4 className="ESDsddE" id={!isQnap}>{`${dnsArray !== null || videoList.length > 0 ? list.fecha : null} - ${dnsArray !== null || videoList.length > 0 ? list.hour : null}`}</h4>
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
                            ) : (<button key={idx} className="btn btn-outline-primary ml-auto mr-auto mb-2" onClick={() => download(list, dnsArray, protocolDownload)}>{`${dnsArray !== null ? list.fecha : list.fecha} - ${list.real_hour ? list.real_hour : null}`}</button>))

                        ))}

                    </div>
            }
        </>
    )
}
