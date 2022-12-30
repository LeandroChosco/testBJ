import { gql } from '@apollo/client'

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
