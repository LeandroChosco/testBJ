import { gql } from '@apollo/client'

export const REGISTER_USER = gql`
mutation
  Registration(
        $email: String!
        $password: String!
        $clientId: Int
        $phone: BigInteger
        $country_code: String
        $cca2: String
        $location: String!
        $firstname: String
        $lastname: String
        $rol_id: Int
        $is_web: Boolean
        $isCustomRegistration: Boolean
    $pin: String
    $legal_age: Boolean
    )
  {
		registration(
			email: $email
			password: $password
			clientId:  $clientId
			phone: $phone
			country_code: $country_code
			cca2: $cca2
			location: $location
			firstname:  $firstname
			lastname: $lastname
      rol_id: $rol_id
      is_web: $is_web
			isCustomRegistration: $isCustomRegistration
      pin:  $pin
      legal_age: $legal_age
    ) {
            token
            user {
                location {
                    latitude
                    longitude
                }
                id
                username
                firstname
                lastname
                email
                password
                phone
                country_code
                cca2
                is_active
                c5_userId
                profile {
                    id
                }
            }
        }
    }
`

export const CAMERA_USER = gql`
mutation
REGISTERUSERCAMERA(
  $google_cordenate: String
  $num_cam: Int!
  $dns_ip: String
  $cam_user: String
  $cam_pass: String
  $street: String
  $number: String
  $township: String
  $town: String
  $state: String
  $cat_carrier_id: Int
  $ssid_name: String
  $password: String
  $between_streets: String
  $model_id: Int
  $zip: String
  $userId: Int
  $url_id: Int
  $stream_id: Int
  $storage_id: Int
  $amazon_stream: Int
  $amazon_arn_channel: String
  $amazon_region: String
  $update_data: Int
  $id_camara: Int
  $is_lpr: Int
  $is_mic: Int
)
{
  registerUserCameraWeb(
    google_cordenate: $google_cordenate
    num_cam: $num_cam
    dns_ip: $dns_ip
    cam_user: $cam_user
    cam_pass: $cam_pass
    street: $street
    number: $number
    township: $township
    town: $town
    state: $state
    cat_carrier_id: $cat_carrier_id
    ssid_name: $ssid_name
    password: $password
    between_streets: $between_streets
    model_id: $model_id
    zip: $zip
    userId: $userId
    url_id: $url_id
    stream_id: $stream_id
    storage_id: $storage_id
    amazon_stream: $amazon_stream
    amazon_arn_channel: $amazon_arn_channel
    amazon_region: $amazon_region
    update_data: $update_data
    id_camara: $id_camara
    is_lpr: $is_lpr
    is_mic: $is_mic
  ){
    success
    error
  }
}
`

export const CREATE_POLICE = gql`
mutation
createPolice(
  $usernumber: String!
  $firstname: String!
  $lastname: String!
  $email: String!
  $password: String!
  $phone: BigInteger!
  $cca2: String!
  $country_code: String!
  $clientId: Int!
  $usertypeId: Int!
)
{
  createPolice(
  usernumber: $usernumber
  firstname: $firstname
  lastname: $lastname
  email: $email
  password: $password
  phone: $phone
  cca2: $cca2
  country_code: $country_code
  clientId: $clientId
  usertypeId: $usertypeId
 ){
 user{
   id
   username
 }
 token
}
}
`

export const RESET_PASSWORD = gql`
mutation
  RECOVERY(
    $updateAuth: Int!
    $clientId: Int!
    $emailorcellphone: String!
    $password: String!
  )
  {
    recoveryPass(
      updateAuth: $updateAuth
      clientId: $clientId
      emailorcellphone: $emailorcellphone
      password: $password
      ){
        success
        msg
        error
      }
  }
`

export const DISABLE_USER = gql`
mutation
disableUser(
  $userId: Int! 
  $rootUserId: Int 
  $is_web: Boolean 
  $clientId: Int
  )
  {
    disableUser(
      userId: $userId
      rootUserId: $rootUserId
      is_web: $is_web
      clientId: $clientId
    ){
      success
      error
      message
    }
  }
`

export const UPDATE_USER = gql`
mutation
UPDATEUSERDATA(
  $rootUserId:Int
  $userId: Int!
  $firstname: String
  $lastname: String
  $email:String
  $phone: BigInteger
  $country_code: String
  $cca2: String!
  $profile_picture:String
){
  updateUserData(
    rootUserId: $rootUserId
    userId: $userId
    firstname: $firstname
    lastname: $lastname
    email:$email
    phone: $phone
    country_code: $country_code
    cca2: $cca2
    profile_picture:$profile_picture
  )
  {
    __typename
  }
    
  }
`

export const URL_API = gql`
mutation
CREATEURLAPI(
  $userId: Int
  $name_instance: String!
  $dns_ip: String!
  $port: Int!
  $protocol: String!
  $secretkey: String
  $tipombox: String!
  $update_data: Int
  $url_id: Int
){
  CreateUpdateUrlApi(
    userId: $userId
    name_instance: $name_instance
    dns_ip: $dns_ip
    port: $port
    protocol: $protocol
    secretkey: $secretkey
    tipombox: $tipombox
    update_data: $update_data
    url_id: $url_id
  ){
    success
    msg
    error
  }
}
`

export const DELETE_API = gql`
mutation
DELETEAPI(
  $userId: Int
  $url_id: Int
){
  DeleteUrlApi(
    userId: $userId
    url_id: $url_id
  ){
    success
    msg
    error
  }
}
`


export const URL_STREAM = gql`
mutation
CREATEURLSTREAM(
  $userId: Int
  $ip_url_ms: String!
  $output_port: Int!
  $name: String!
  $autenticacion: Int
  $secretkey: String
  $protocol: String!
  $update_data: Int
  $stream_id: Int
){
  CreateUpdateUrlStream(
    userId: $userId
    ip_url_ms: $ip_url_ms
    output_port: $output_port
    name: $name
    autenticacion: $autenticacion
    secretkey: $secretkey
    protocol: $protocol
    update_data: $update_data
    stream_id: $stream_id
  ){
    success
    msg
    error
  }
}
`

export const DELETE_STREAM = gql`
mutation
DELETESTREAM(
  $userId: Int
  $stream_id: Int
){
  DeleteUrlStream(
    userId: $userId
    stream_id: $stream_id
  ){
    success
    msg
    error
  }
}
`

export const URL_STORAGE = gql`
mutation
CREATEURLSTORAGE(
  $userId: Int
  $type_mbox: String
  $ip_url: String
  $port: Int
  $secretkey: String
  $is_bold_storage: Int
  $dns_bold: String
  $region_bold: String
  $bucket_bold: String
  $client_bucket_bold: String
  $update_data: Int
  $storage_id: Int
){
  CreateUpdateUrlStorage(
    userId: $userId
    type_mbox: $type_mbox
    ip_url: $ip_url
    port: $port
    secretkey: $secretkey
    is_bold_storage: $is_bold_storage
    dns_bold: $dns_bold
    region_bold: $region_bold
    bucket_bold: $bucket_bold
    client_bucket_bold: $client_bucket_bold
    update_data: $update_data
    storage_id: $storage_id
  ){
    success
    msg
    error
  }
}
`

export const DELETE_STORAGE = gql`
mutation
DELETESTORAGE(
  $userId: Int
  $storage_id: Int
){
  DeleteUrlStorage(
    userId: $userId
    storage_id: $storage_id
  ){
    success
    msg
    error
  }
}
`

export const CAT_CARRIER = gql`
mutation
CREATECATCARRIER(
  $userId: Int
  $carrier: String!
  $update_data: Int
  $carrier_id: Int
){
  CreateUpdateCatCarrier(
    userId: $userId
    carrier: $carrier
    update_data: $update_data
    carrier_id: $carrier_id
  ){
    success
    msg
    error
  }
}
`

export const DELETE_CARRIER = gql`
mutation
DELETECARRIER(
  $userId: Int
  $carrier_id: Int
){
  DeleteCatCarrier(
    userId: $userId
    carrier_id: $carrier_id
  ){
    success
    msg
    error
  }
}
`

export const CAT_ADDRESS = gql`
mutation
CREATECATADDRESS(
  $userId: Int
  $codigoPostal: String!
  $asenta: String!
  $tipoAsenta: String!
  $municipio: String!
  $estado: String!
  $ciudad: String!
  $codigoEstado: String!
  $codigoTipoAsenta: String
  $codigoMunicipio: String
  $idAsenta: String!
  $zona: String!
  $codigoCVECiudad: String!
  $update_data: Int
  $address_id: Int
){
  CreateUpdateCatAddress(
    userId: $userId
    codigoPostal: $codigoPostal
    asenta: $asenta
    tipoAsenta: $tipoAsenta
    municipio: $municipio
    estado: $estado
    ciudad: $ciudad
    codigoEstado: $codigoEstado
    codigoTipoAsenta: $codigoTipoAsenta
    codigoMunicipio: $codigoMunicipio
    idAsenta: $idAsenta
    zona: $zona
    codigoCVECiudad: $codigoCVECiudad
    update_data: $update_data
    address_id: $address_id
  ){
    success
    msg
    error
  }
}
`

export const DELETE_ADDRESS = gql`
mutation
DELETEADDRESS(
  $userId: Int
  $address_id: Int
){
  DeleteCatAddress(
    userId: $userId
    address_id: $address_id
  ){
    success
    msg
    error
  }
}
`

export const CHANGE_PASSWORD = gql`
mutation
  RECOVERYPASSWORDWEB(
        $clientId: Int!
        $email: String!
        $password: String!
        $flag_recovery: Int!
        $old_password: String
    )
    {
	recoveryPassWeb(
        clientId: $clientId
		    email: $email
        password: $password
        flag_recovery: $flag_recovery
        old_password: $old_password
    ){
        msg
        error
        success
        }
    }
`
