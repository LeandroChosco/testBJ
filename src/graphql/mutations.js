import { gql } from '@apollo/client'

export const CHANGE_PASSWORD = gql`
mutation
  RECOVERYPASSWORDWEB(
        $clientId: Int!
        $email: String!
        $password: String!
    )
    {
	recoveryPassWeb(
        clientId: $clientId
		email: $email
        password: $password
    ){
        msg
        error
        success
        }
    }
`
