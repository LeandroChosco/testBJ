import React, {useState, } from 'react'
import PaginationNumber from './PaginationNumber'
import MediaContainer from '../MediaContainer'
export default function PaginationList(props) {
const {awsApiStreamsCams, videoList, reloadData, download, isDownloadSearch, dnsArray, protocolDownload, hasDns, camURL, dnsContainer, portContainer, servidorMultimedia, apiStorageKey, noButtons, isRecord, typeMBOX, selectedCamera, historyServerDns, historyServerPort, historyServerProtocol} = props;
const [videos, setVideos] = useState(videoList)
const [currentPage, setCurrentPage] = useState(1)
const totalVideos = 40
if(videoList.length !== videos.length){
    setVideos(videoList)
}
const indexOfLastPost = currentPage * totalVideos
const indexOfFirstPost = indexOfLastPost - totalVideos
const currentPost = videos.slice(indexOfFirstPost, indexOfLastPost)
function paginate(pageNumber) {
    setCurrentPage(pageNumber)
}
    return (
        <>
        <PaginationNumber videos={totalVideos} totalVideos={videos.length} paginate={paginate} /> ,
        {awsApiStreamsCams ?
            
            
        <div className="row">
            
            {currentPost.map((list, idx) => (
                (!isDownloadSearch ? (
                    <>
                    
                    {idx % 2 ===0 ?
                    <div className="col-12">
                            {!isDownloadSearch ?
                                <h4>{`${dnsArray !== null ? list.fecha : null} - ${dnsArray !== null ? list.hour : null}`}</h4>
                                :
                                null
                            }
                    </div>:null }
                <MediaContainer
                    key={idx}
                    value={list}
                    isQnap={false}
                    dns_ip={hasDns && `http://${hasDns}`}
                    exists_video={true}
                    cam={camURL}
                    dnsContainer={dnsContainer}
                    port={portContainer}
                    src={list.relative_path_video}
                    real_hour={list.real_hour}
                    reloadData={reloadData}
                    servidorMultimedia={servidorMultimedia}
                    apiStorageKey={apiStorageKey}
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
                    ): (<button className="btn btn-outline-primary ml-auto mr-auto mb-2" onClick={()=>download(list,dnsArray, protocolDownload)}>{`${dnsArray !== null ? list.fecha : list.fecha} - ${list.real_hour ? list.real_hour : null}`}</button>))
                
            ))
            
            
            }
            </div>

            :
            <div className="row">
            
            {currentPost.map((list, idx) => (
                (!isDownloadSearch ? (
                <>
                {idx % 2 ===0 ?
                    <div className="col-12">
                            {!isDownloadSearch ?
                                <h4>{`${dnsArray !== null ? list.fecha : null} - ${dnsArray !== null ? list.hour : null}`}</h4>
                                :
                                null
                            }
                    </div>:null }
                <MediaContainer
                    key={idx}
                    value={list}
                    isQnap={false}
                    dns_ip={hasDns && `http://${hasDns}`}
                    exists_video={true}
                    cam={selectedCamera}
                    dnsContainer={dnsContainer}
                    port={portContainer}
                    src={list.relative_path_video}
                    real_hour={list.real_hour}
                    reloadData={reloadData}
                    servidorMultimedia={servidorMultimedia}
                    awsApiStreamsCams={awsApiStreamsCams}
                    noButtons={noButtons}
                    isRecord={isRecord}
                    typeMBOX={typeMBOX}
                    />
                    </>
                    ): (<button className="btn btn-outline-primary ml-auto mr-auto mb-2" onClick={()=>download(list,dnsArray, protocolDownload)}>{`${dnsArray !== null ? list.fecha : list.fecha} - ${list.real_hour ? list.real_hour : null}`}</button>))
                
            ))}

            </div>
        
     }
            </>
  )
}
