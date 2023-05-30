import { CAT_ADDRESS, CAMERA_FILTER, ALL_BRAND, ALL_USERS, GET_API_URL, GET_STREAM_URL, GET_STORAGE_URL, GET_CARRIER } from '../../graphql/queries';
import { useQuery } from '@apollo/client'

export const allQueries = {
    getAllCamerasToServers: (clientId, token) => {
        let { data, loading } = useQuery(CAMERA_FILTER, {
            variables: {
                userId: 1,
                id_camara: 0,
                clientId: parseInt(clientId),
            },
            context: {
                headers: {
                    "Authorization": token ? token : "",
                }
            }
        })

        if (!loading && data) {
            return data.getCamaraFilter.response
        }
    },

    getCatAddress: (token) => {
        let { data, loading } = useQuery(CAT_ADDRESS, {
            variables: {
                userId: 1,
            },
            context: {
                headers: {
                    "Authorization": token ? token : "",
                }
            }
        })

        if (!loading && data) {
            return data.getCatAddress.response
        }
    },

    getAllUsers: (clientId, token) => {
        let { data, loading } = useQuery(ALL_USERS, {
            variables: {
                userId: 1,
                clientId: clientId,
            },
            context: {
                headers: {
                    "Authorization": token ? token : "",
                }
            }
        })

        if (!loading && data) {
            return data.getAllListUsers.response
        }
    },

  getAllBrand: (token) => {
    let { data, loading } = useQuery(ALL_BRAND, {
      context: {
        headers: {
          "Authorization": token ? token : "",
        }
      }
    })

    if (!loading && data) {

      return data.getAllBrand.response.filter((el) => el.device_type.name === "Cámara")
    }
  },

  getApiUrl: (token) => {
    let { data, loading } = useQuery(GET_API_URL, {
      variables: { userId: 1 },
      context: {
        headers: {
          "Authorization": token ? token : "",
        }
      }
    })
    if (!loading && data) {
      return data.getCatUrlApi.response
    }
  },
  getStreamUrl: (token) => {
    let { data, loading } = useQuery(GET_STREAM_URL, {
      variables: { userId: 1 },
      context: {
        headers: {
          "Authorization": token ? token : "",
        }
      }
    })
    if (!loading && data) {
      return data.getCatUrlStream.response
    }
  },
  getStorageUrl: (token) => {
    let { data, loading } = useQuery(GET_STORAGE_URL, {
      variables: { userId: 1 },
      context: {
        headers: {
          "Authorization": token ? token : "",
        }
      }
    })
    if (!loading && data) {
      return data.getCatUrlStorage.response
    }
  },
  getCarrier: (token) => {
    let { data, loading } = useQuery(GET_CARRIER, {
      variables: { userId: 1 },
      context: {
        headers: {
          "Authorization": token ? token : "",
        }
      }
    })
    if (!loading && data) {
      return data.getCatCarrier.response
    }
  }
}