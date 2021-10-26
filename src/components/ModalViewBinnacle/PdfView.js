import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import logo from '../../assets/images/icons/bjpdf.png'

const Pdfview = ({data}) => {
  console.log('PDFView',data)

  function returnSrc(e) {
    const path = e;
    const pathImage = "http://radarsync.s3.amazonaws.com/";
    const selectedMethod = 'GET';
    return { uri: `${pathImage}${path}`, method: selectedMethod, body: '', headers: '' }; 
  }

  function returnSrcCiu(e) {
    const path = e;
    const pathImage = "https://radarsync.s3.us-east-2.amazonaws.com/";
    const selectedMethod = 'GET';
    return { uri: `${pathImage}${path}`, method: selectedMethod, body: '', headers: '' }; 
  }

  return (
      <Document >
        <Page size="A4" style={styles.page}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Image source={{
                  uri: `${logo}`,
                  method: 'GET',
                  headers: {},
                  body: ''
                }} style={styles.imgHeader} />
              <Text style={styles.headerTitle}>FICHA DE INCIDENCIAS ALCALDIA BENITO JAUREZ</Text>
            </View>
            <View style={styles.descriptionContainer}>
              <View style={styles.boxLeft}>
                <Text style={styles.titleOption}>FECHA DE LOS HECHOS: </Text>
              </View>
              <View style={styles.boxRight}>
                <Text style={styles.textDescription}>{data.date || '-'}</Text>
              </View>
            </View>  
            <View style={styles.descriptionContainer}>
              <View style={styles.boxLeft}>
                <Text style={styles.titleOption}>HORA DE LOS HECHOS: </Text>
              </View>
              <View style={styles.boxRight}>
                <Text style={styles.textDescription}>{data.hour || '-'}</Text>
              </View>
            </View>  
            <View style={styles.descriptionContainer}>
              <View style={styles.boxLeft}>
                 <Text style={styles.titleOption}>NOMBRE DE CIUDADANO ATENDIDO: </Text>
              </View>
              <View style={styles.boxRight}>
                <Text style={styles.textDescription}>{data.name || '-'}</Text>
              </View>
            </View>  
            <View style={styles.descriptionContainer}>
              <View style={styles.boxLeft}>
                <Text style={styles.titleOption}>COORDENADAS DE LOS HECHOS: </Text>
              </View>
              <View style={styles.boxRight}>
                <Text style={styles.textDescriptionCoor}>{data.coords || '-'}</Text>
              </View>
            </View> 
            <View style={styles.descriptionContainer}>
              <View style={styles.boxLeft}>
                <Text style={styles.titleOption}>NOMBRE OFICIAL ALCALDIA: </Text>
              </View>
              <View style={styles.boxRight}>
                <Text style={styles.textDescription}>{data.nameOficial || '-'}</Text>
              </View>
            </View>  
            <View style={styles.descriptionContainer}>
              <View style={styles.boxLeft}>
               <Text style={styles.titleOption}>SECTOR: </Text>
              </View>
              <View style={styles.boxRight}>
                <Text style={styles.textDescription}>{data.sector || '-'}</Text>
              </View>
            </View>  
            <View style={styles.descriptionContainer}>
              <View style={styles.boxLeft}>
                <Text style={styles.titleOption}>TIPO DE INCIDENCIA: </Text>
              </View>
              <View style={styles.boxRight}>
                <Text style={styles.textDescription}>{data.incidentName || '-'}</Text>
              </View>
            </View>  
            <View style={styles.descriptionContainer}>
              <View style={styles.boxLeft}>
                <Text style={styles.titleOption}>OTRO TIPO DE INCIDENCIA: </Text>
              </View>
              <View style={styles.boxRight}>
                <Text style={styles.textDescription}>{data.incidentNameOther || '-'}</Text>
              </View>
            </View>  
            <View style={styles.descriptionContainer}>
              <View style={styles.boxLeft}>
                <Text style={styles.titleOption}>UBICACION DE LOS HECHOS: </Text>
              </View>
              <View style={styles.boxRight}>
                <Text style={styles.textDescription}>{data.locationName || '-'}</Text>
              </View>
            </View>  
            <View style={styles.descriptionContainer}>
              <View style={styles.boxLeft}>
                <Text style={styles.titleOption}>NARRATIVA DE HECHOS: </Text>
              </View>
              <View style={styles.boxRight}>
                <Text style={styles.textDescription}>{data.narrative || '-'}</Text>
              </View>
            </View>  
            <View style={styles.descriptionContainerImg}>
              <Text style={styles.titleOption}>FOTO EVIDENCIA DE HECHOS: </Text>
              {
              data.images.length > 0 && data.images.map(d => (
                <Image key={d.key} src={returnSrc(d.key)} style={styles.imgDetail} />
              ))            
              }
            </View>
            <View style={styles.descriptionContainerImg}>
              <Text style={styles.titleOptionSalto}>FIRMA DEL OFICIAL ALCALDIA: </Text>
              {
                data.sigOficial &&  <Image src={returnSrc(data.sigOficial.key)} style={styles.imgDetail} />
              }
            </View>
            <View style={styles.descriptionContainerImg}>
              <Text style={styles.titleOption}>FIRMA DE CIUDADANO: </Text>
              {
                data.sigCiudadano &&  <Image src={returnSrc(data.sigCiudadano.key)} style={styles.imgDetail} />     
              }
            </View>
          </View>
        </Page>
      </Document>
  );
}

const styles = StyleSheet.create({
  page:{
    flexDirection: 'row',
  },
  container:{
    width:'100%'
  },
  header:{
    flexDirection: 'row',
    margin:'10px',
    justifyContent: 'center',
    alignItems:'center',
  },
  imgHeader:{
    width: '100px',
    height: '100px'
  },
  headerTitle:{
    fontWeight:'bold',
    fontSize: 16,
    marginLeft: 20
  },
  descriptionContainer:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems:'center',
    margin:5
  },
  descriptionContainerImg:{
    justifyContent: 'center',
    alignItems:'center',
    marginBottom:10,
    marginTop: 5
  },
  titleOption:{
    fontWeight:'extrabold',
    fontSize: 13,
    // padding:5,
    // marginLeft:10
    marginHorizontal: 5
  },
  titleOptionSalto:{
    fontWeight:'extrabold',
    fontSize: 13,
    // padding:5,
    marginTop: 20,
    marginHorizontal: 5
  },
  boxLeft:{
    height:30,
    flex:1, 
    justifyContent: 'center', 
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    // paddingLeft:20
  },
  boxRight:{
    height:30, 
    flex:1, 
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexWrap: 'wrap' 
    // paddingLeft:20
    },
  textDescription:{
    fontWeight: 'bold',
    fontSize: 12,
    alignSelf: 'left',
    marginHorizontal: 5
  },
  textDescriptionCoor:{
    fontWeight: 'bold',
    fontSize: 9,
    alignSelf: 'left',
    marginHorizontal: 5
  },
  imageContainer: {
    backgroundColor: "#f6f6f5",
    display: "flex",
    flexDirection: "row",
    padding: 5
  },
  imgDetail:{
    width:'400px',
    height:'280',
    margin: '5px',
    marginBotton: 10,
    resizeMode:'stretch'
  }
})

export default Pdfview;
