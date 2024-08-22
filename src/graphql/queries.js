import { gql } from '@apollo/client'

export const CAMERAS_TO_SERVERS = gql`
query
LISTTOCAMERAS($userId: Int!)
{
  getCamarasToServers(
  userId: $userId
){
  success
  response{
    id
    ip_camara
    dns_api_name
    dns_api
    dns_api_type_mbox
  }
  error
}
}
`

export const CAT_ADDRESS = gql`
query
CATADDRESS($userId: Int!)
{
  getCatAddress(
  userId: $userId
){
  success
  response{
    id
    d_codigo
    d_asenta
    d_tipo_asenta
    d_mnpio
    d_estado
    d_ciudad
    d_cp
    c_estado
    c_oficina
    c_cp
    c_tipo_asenta
    c_mnpio
    id_asenta_cpcons
    d_zona
    c_cve_ciudad
  }
  error
}
}
`

export const CAMERA_FILTER = gql`
query
CAMERAFILTER($userId: Int! $id_camara: Int! $clientId: Int!)
{
  getCamaraFilter(
  userId: $userId
  id_camara: $id_camara
  clientId: $clientId
){
  success
  response{
    id
    num_cam
    google_cordenate
    camera_ip
    cam_user
    cam_pass
    street
    number
    town
    township
    state
    entrecalles
    dns
    active
    flag_streaming
    cam_user
    cam_pass
    cat_carrier_id
    ssid_name
    password
    is_amazon_stream
    amazon_arn_channel
    amazon_region
    type_camare_id
    is_lpr
    is_mic

    User{
      id
      id_radar
      user_login
      user_nicename
    }
    Url{
      id
      name_instance
      dns_ip
      port
      protocol
      tipombox
    }
    UrlStreamMediaServer{
      id
      ip_url_ms
      output_port
      protocol
      name
    }
    UrlAPIStorage{
      id
      ip_url
      port
      is_bold_storage
      dns_bold
      region_bold
      bucket_bold
      client_bucket_bold
    }
    Address{
      id
      d_codigo
      d_asenta
      d_tipo_asenta
      d_mnpio
      d_estado
      d_ciudad
      d_cp
      c_estado
      c_oficina
      c_cp
      c_tipo_asenta
      c_mnpio
      id_asenta_cpcons
      d_zona
      c_cve_ciudad
    }
  }
  error
}
}
`

export const ALL_USERS = gql`
query
  AllUSERS(
    $userId: Int!
    $clientId: Int!
    ){
     getAllListUsers(
      userId: $userId
      clientId: $clientId
      ) {
           success
            response{
              id
              radar_id
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
  						error
	}
}
`

export const ALL_BRAND = gql`
query{
    getAllBrand
    {
    success
    response{
      id
      name
      device_type{
        id
        name
        type
      }
      endpoint
      brand
      model
      string_complement_url
    }
    error
  }
  }
`

export const TYPES_ROL = gql`
query{
    getUserTypes{
      id
      name
    }
  }
`

export const GET_API_URL = gql`
query
GETAPIURL($userId: Int!)
{
  getCatUrlApi(
    userId: $userId
  ){
    success
    response{
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
    error
  }
}
`

export const GET_STREAM_URL = gql`
query
GETSTREAMURL($userId: Int!)
{
  getCatUrlStream(
    userId: $userId
  ){
    success
    response{
      id
    	ip_url_ms
    	output_port
    	name
    	autenticacion
    	secretkey
    	activo
    	protocol
    }
    error
  }
}
`

export const GET_STORAGE_URL = gql`
query
GETSTORAGEURL($userId: Int!)
{
  getCatUrlStorage(
    userId: $userId
  ){
    success
    response{
      id
    	ip_url
    	port
    	secretkey
    	is_bold_storage
    	dns_bold
    	region_bold
    	bucket_bold
    	client_bucket_bold
    	activo
    }
    error
  }
}
`

export const GET_CARRIER = gql`
query
GETCARRIER($userId: Int!)
  {
  getCatCarrier(
    userId: $userId
  ){
    success
    response{
      id
    	carrier
    	description
    	active
    }
    error
  }
}
`

// export const LOGIN_STORAGE = gql`
// query
// SignIn(
//   $email: String!,
//   $password: String!
// ){
//   userSignIn(
//     email: $email,
//     password: $password
//   ){
//   	token
//   	userData{
//     	id
//     	username
//   	}
// 	}
// }
// `

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