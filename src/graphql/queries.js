import { gql } from '@apollo/client'

export const GET_USER_INFO = gql`
query
SEARCHINFO($userIdC5: Int $clientId: Int)
{
  searchInformationUserDataAdminC5(
  userIdC5: $userIdC5
  clientId: $clientId
){
  success
  responseuserc5{
    id
    user_login
    user_pass
    cellphone
    user_nicename
    display_name
    user_email
    user_register
    user_status
    active
    user_create
    date_creation
    user_update
    date_update
  }
  responseuserradar {
    count_firebase_camera
          firebase_update_date
  }
  error
}
}
`

export const GET_CAMERA_INFO = gql`
query
UPDATEINFO($email: String! $clientId: Int!)
{
  updateInformationFirebaseCamera(
  email: $email
  clientId: $clientId
){
  success
  response{
    id
    num_cam
    path_photo
    google_cordenate
    street
    number
    township
    entrecalles
    town
    state
    dns
    camera_ip
    cam_user
    cam_pass
    cat_carrier_id
    ssid_name
    password
    personal_name
    phone
    cell_phone
    comment
    active
    port_output_streaming
    flag_streaming
    flag_record_movie
    keep_video_days
    date_creation
    date_update
    sniffer_fail_count
    channel
    rel_msid
    rel_apist
    order
    flag_color
    tipo_camara
    control
    qnap_channel
    is_amazon_stream
    amazon_arn_channel
    amazon_region
    termic_type
    user_update
    show_cam
    internal
    is_mic
    is_lpr
    qnap_server_id
    user_creation
    type_camare_id
    UrlStreamMediaServer {
      id
      ip_url_ms
      output_port
      name
      autenticacion
      secretKey
      activo
      protocol
    }
    UrlStreamToCameras {
        id
        date_creation
        date_update
        user_update
        user_creation
        activate
        cam_id
        url_id
    }
    UrlAPIStorage {
        id
      secretkey
      ip_url
      port
      is_bold_storage
      dns_bold
      region_bold
      bucket_bold
      client_bucket_bold
      activo
      }
      UrlHistorical {
          id
      name_instance
      dns_ip
      port
      type
      active
      protocol
      secretkey
      tipombox
        }
  }
  error
}
}
`