import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';
import SelectBox from 'react-native-multi-selectbox'
import { xorBy } from 'lodash'
import { useState } from 'react';
import { CustomMarker } from './components/custom_marker';
import MultiSelect from 'react-native-multiple-select';
import { useEffect } from 'react';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import { SelectList } from 'react-native-dropdown-select-list'
import AppLoading  from "expo-app-loading";
import {
  useFonts,
  Roboto_400Regular,
  Bangers_400Regular,
  OpenSans_400Regular,
  Poppins_400Regular
} from "@expo-google-fonts/dev";

const markers = require('./map_data/hospital_maps_scores.json')

const K_OPTIONS = [
  {
    value: "All",
    id: "charge"
  },
  {
    value: "Diseases and Disorders of the Nervous System",
    id: "1"
  },
  {
    value: "Diseases and Disorders of the Eye",
    id: "2"
  },
  {
    value: "Ear, Nose, Mouth, Throat, and Craniofacial Diseases and Disorders",
    id: "3"
  },
  {
    value: "Diseases and Disorders of the Respiratory System",
    id: "4"
  },
  {
    value: "Diseases and Disorders of the Circulatory System",
    id: "5"
  },
  {
    value: "Diseases and Disorders of the Digestive System",
    id: "6"
  },
  {
    value: "Diseases and Disorders of the Hepatobiliary System and Pancreas",
    id: "7"
  },
  {
    value: "Diseases and Disorders of the Musculoskeletal System and Connective Tissue",
    id: "8"
  },
  {
    value: "Diseases and Disorders of the Skin, Subcutaneous Tissue and Breast",
    id: "9"
  },
  {
    value: "Endocrine, Nutritional and Metabolic Diseases and Disorders",
    id: "10"
  },
  {
    value: "Diseases and Disorders of the Kidney and Urinary Tract",
    id: "11"
  },
  {
    value: "Diseases and Disorders of the Male Reproductive System",
    id: "12"
  },
  {
    value: "Diseases and Disorders of the Female Reproductive System",
    id: "13"
  },
  {
    value: "Pregnancy, Childbirth and the Puerperium",
    id: "14"
  },
  {
    value: "Newborns and Other Neonates with Conditions Originating in the Perinatal Period",
    id: "15"
  },
  {
    value: "Diseases and Disorders of Blood, Blood Forming Organs and Immunological Disorders",
    id: "16"
  },
  {
    value: "Lymphatic, Hematopoietic, Other Malignancies, Chemotherapy and Radiotherapy",
    id: "17"
  },
  {
    value: "Infectious and Parasitic Diseases, Systemic or Unspecified Sites",
    id: "18"
  },
  {
    value: "Mental Diseases and Disorders",
    id: "19"
  },
  {
    value: "Alcohol/Drug Use and Alcohol/Drug Induced Organic Mental Disorders",
    id: "20"
  },
  {
    value: "Poisonings, Toxic Effects, Other Injuries and Other Complications of Treatment",
    id: "21"
  },
  {
    value: "Burns",
    id: "22"
  },
  {
    value: "Rehabilitation, Aftercare, Other Factors Influencing Health Status and",
    id: "23"
  },
  {
    value: "Health Service Contacts",
    id: "Other"
  },
  {
    value: "Human Immunodeficiency Virus (HIV) Infections",
    id: "24"
  },
  {
    value: "Multiple Significant Trauma",
    id: "25"
  },
  
]

const AGG_OPTIONS = [
  {
    value: "charge",
    id: "charge"
  },
  {
    value: "safety",
    id: "safety"
  },
  {
    value: "patient satisfaction",
    id: "patient satisfaction"
  }
]



export default function App() {
  //const [markers, setMarkers] = useState(markers)

  const [aggType, setAggType] = useState("charge")
  const [selected, setSelected] = useState("charge");
  const [selectedAgg, setSelectedAgg] = useState("")

  let [fontsLoaded] = useFonts({
    Poppins_400Regular
  });

  if(!fontsLoaded) {
    return <AppLoading></AppLoading>
  }

  return (
    <SafeAreaView style={styles.container}>
      <MapView style={{width: "100%", height: "100%"}}
          region={{latitude: 40.8447819, longitude: -73.8648268,
                    latitudeDelta: 0.09, longitudeDelta: 0.035}}>
          { markers && markers.map((item) => {
            return (
              <CustomMarker item={item} aggType={selectedAgg == "charge"? selected:selectedAgg}></CustomMarker>
            )
          })

          }

      </MapView>
      <View style={{height: 200, width: "100%", position: "absolute", backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 4, top: 0, justifyContent: "center",
                    flexDirection: "column", paddingHorizontal: 10, paddingTop: "5%"}}>
        <View style={{flexDirection: "row", flex: 1, width: "100%"}}>
        <View style={{flex: 2, height: "100%", zIndex: 2}}>
            <View style={{justifyContent: "center", alignItems: "center", paddingBottom: 15}}>
              <Text style={{color: "white", fontSize: 20, fontFamily: "Poppins_400Regular"}}>Color By</Text>

            </View>
            <SelectList 
            boxStyles={{backgroundColor: "white", height: 50, justifyContent: "center", alignItems: "center"}}
            dropdownStyles={{backgroundColor: "white", height: 150, zIndex: 10}}
            setSelected={(val) => setSelectedAgg(AGG_OPTIONS.find(x => x.value==val).id)} 
            defaultOption={{value: "charge", id: "charge"}}
            data={AGG_OPTIONS} 
            inputStyles={{fontFamily: "Poppins_400Regular"}}
            dropdownTextStyles={{fontFamily: "Poppins_400Regular"}}
            save="id"/>
        </View>
        <View style={{flex: 2, marginLeft: 10, opacity: selectedAgg=="charge"? 1:0}}>
            <View style={{justifyContent: "center", alignItems: "center", paddingBottom: 15}}>
              <Text style={{color: "white", fontSize: 20, fontFamily: "Poppins_400Regular"}}>Health Category</Text>

            </View>
          <SelectList 
              boxStyles={{backgroundColor: "white", height: 50, justifyContent: "center", alignItems: "center"}}
              dropdownStyles={{backgroundColor: "white", height: 300, zIndex: 10}}
              setSelected={(val) => setSelected(K_OPTIONS.find(x => x.value==val).id)} 
              defaultOption={{value: "All", id: "charge"}}
              inputStyles={{fontFamily: "Poppins_400Regular"}}
              dropdownTextStyles={{fontFamily: "Poppins_400Regular"}}
              data={K_OPTIONS} 
              save="id"/>
        </View>
        </View>
        
        <View style={{height: 50, flexDirection: "row", zIndex: -1}}>
            <View style={{flexDirection: "row", flex: 1, alignItems: "center", zIndez: -1}}>
              <View style={{height: "50%", width: undefined, aspectRatio: 1, backgroundColor: selectedAgg=="charge"? "rgb(255, 0, 255)":(selectedAgg=="safety"? "rgb(0, 255, 0)":"rgb(0, 255, 255)")}}>

              </View>
              <Text style={{marginLeft: 10, color: "white", fontFamily: "Poppins_400Regular"}}>{selectedAgg=="charge"? "more costly (avg)":(selectedAgg=="safety"? "more safe":"higher satisfaction")}</Text>
            </View>
            
            <View style={{flexDirection: "row", flex: 1, alignItems: "center"}}>
              <View style={{height: "50%", width: undefined, aspectRatio: 1, backgroundColor: selectedAgg=="charge"? "rgb(0, 0, 255)":(selectedAgg=="safety"? "rgb(255, 255, 0)":"rgb(0, 0, 255)")}}>
              
              </View>
              <Text style={{marginLeft: 10, color: "white", fontFamily: "Poppins_400Regular"}}>{selectedAgg=="charge"? "less costly (avg)":(selectedAgg=="safety"? "less safe":"lower satisfaction")}</Text>
            </View>
        </View>
      </View> 
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
