import React from 'react';
import { Button } from "semantic-ui-react";

export default function Actions(props) {

    const [setDataForm, setUpdateCarrier, setIsAmazonStream, setDataToShow, setShowModal, setTypeModal] = props.setters
    const [row, dataForm, dataToShow] = props.data

    return (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
            <Button onClick={() => {
                console.log(row)
                if (row.__typename) {
                    switch (row.__typename) {
                        case "CatAddress":
                            setDataForm({
                                ...dataForm,
                                zip: row.d_cp
                            })

                            setDataToShow({
                                ...dataToShow,
                                cat_address_name: `${row.d_cp} - ${row.d_estado} - ${row.d_ciudad}`
                            })
                            break;
                        case "ListUsers":
                            setDataForm({
                                ...dataForm,
                                userId: row.radar_id
                            })
                            setDataToShow({
                                ...dataToShow,
                                user_name: `${row.radar_id} - ${row.user_nicename} - ${row.user_login}`
                            })
                            break;
                        case "CatUrlApi":
                            setDataForm({
                                ...dataForm,
                                url_id: row.id
                            })

                            setDataToShow({
                                ...dataToShow,
                                url_name: row.name_instance
                            })
                            break;
                        case "CatUrlStream":
                            setDataForm({
                                ...dataForm,
                                stream_id: row.id
                            })

                            setDataToShow({
                                ...dataToShow,
                                stream_name: row.name ? row.name : "NOMBRE NO DISPONIBLE"
                            })
                            break;
                        case "CatUrlStorage":
                            setDataForm({
                                ...dataForm,
                                storage_id: row.id
                            })

                            setDataToShow({
                                ...dataToShow,
                                storage_name: row.client_bucket_bold ? row.client_bucket_bold : "NOMBRE NO DISPONIBLE"
                            })
                            break;
                        default:
                            break;
                    }
                } else {
                    if (row.cat_carrier_id) {
                        setDataForm({
                            ...dataForm,
                            cat_carrier_id: row.cat_carrier_id
                        })
                        setUpdateCarrier(1)
                    }

                    if (row.is_amazon_stream) {
                        setIsAmazonStream(1)
                        setDataForm({
                            ...dataForm,
                            amazon_arn_channel: row.amazon_arn_channel,
                            amazon_region: row.amazon_region
                        })
                    }

                    if (row.cam_user && row.cam_pass) {
                        setDataForm({
                            ...dataForm,
                            cam_user: row.cam_user,
                            cam_pass: row.cam_pass
                        })
                    }

                    if (row.ssid_name && row.password) {
                        setDataForm({
                            ...dataForm,
                            ssid_name: row.ssid_name,
                            password: row.password
                        })
                    }
                    setDataForm({
                        ...dataForm,
                        google_cordenate: row.google_cordenate,
                        num_cam: row.num_cam,
                        dns_ip: row.dns,
                        street: row.street,
                        number: row.number,
                        town: row.town,
                        township: row.township,
                        state: row.state,
                        is_amazon_stream: row.is_amazon_stream,
                        amazon_arn_channel: row.amazon_arn_channel ? row.amazon_arn_channel : null,
                        amazon_region: row.amazon_region ? row.amazon_region : null,
                        between_streets: row.entrecalles,
                        id_camara: row.id,
                        model_id: parseInt(row.type_camare_id + 2),
                        zip: "-",
                        userId: "-",
                        url_id: "-",
                        stream_id: row.UrlStreamMediaServer.id,
                        storage_id: row.UrlAPIStorage.id,
                        is_lpr: row.is_lpr ? row.is_lpr : 0,
                        is_mic: row.is_mic ? row.is_mic : 0,
                    })
                    setDataToShow({
                        ...dataToShow,
                        url_name: "-",
                        stream_name: row.UrlStreamMediaServer.name ? row.UrlStreamMediaServer.name : "NOMBRE NO DISPONIBLE",
                        storage_name: row.UrlAPIStorage.client_bucket_bold ? row.UrlAPIStorage.client_bucket_bold : "NOMBRE NO DISPONIBLE",
                        user_name: "-",
                        cat_address_name: "-",
                    })
                }
                setShowModal(false)
                setTypeModal(0)
            }}>✔️</Button>
        </div>
    )
}