import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View, Modal, Dimensions, SafeAreaView, FlatList, Pressable } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';
import { useState } from 'react';
import { HospitalSummary } from './hospital_summary';
import FontIcon from 'react-native-vector-icons/FontAwesome5';

function extractNumber(str) {
    
    let allows = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "."]
    return Number(str.split("").filter(x => allows.includes(x)).join(""))
}

 export function CustomMarker({item, aggType}) {
    const [sumIsOpen, setSumIsOpen] = useState(false)

    const complications_safety_stat = extractNumber(item.complications_safety_stat)
    const patient_satisfaction_stat = extractNumber(String(item.patient_satisfaction_stat))
    const cesarian_stat = extractNumber(String(item.cesarian_stat))
    const vaginal_stat = extractNumber(String(item.vaginal_stat))
    let color = ""
    if(isNaN(item.latitude)) {return}

    if(aggType == "charge") {
        color = `rgb(${(item.charge_dif_rel+1)/2*255}, 0, 255)`
    } else if(aggType == "safety") {
        color = `rgb(${(complications_safety_stat-0.5)*255}, 255, 0)`
    } else if(aggType == "patient satisfaction") {
        color = `rgb(0, ${(patient_satisfaction_stat)/100*255}, 255)`
    } else {
        let charge_dif_rel = item.dcm_data[`${aggType}`]
        charge_dif_rel = charge_dif_rel != undefined? charge_dif_rel[["charge_dif_rel"]]:0
        color = `rgb(${(charge_dif_rel+1)/2*255}, 0, 255)`
    }


    return (
        <Marker coordinate = {{latitude: item.latitude,longitude: item.longitude}}
                pinColor = {`rgb(${(item.charge_dif_rel+1)*255}, ${255-item.charge_dif_rel*255}, 0)`} // any color
                title={item["Facility.Name"]}>

            <View style={{flexDirection: "column"}}>
                <TouchableOpacity style={{backgroundColor: "black",
                            height: 14, width: undefined, aspectRatio: 1, borderRadius: 7, 
                                alignItems: "center", justifyContent: "center"}}
                        >
                        <FontIcon name="hospital-symbol" size={15} 
                        color={color} 
                        style={{zIndex: 10, elevation: 10}}></FontIcon>
                </TouchableOpacity>
                <Modal visible={sumIsOpen} animationType="slide">
                    <SafeAreaView style={{flex: 1, width: "100%"}}>
                        <View style={{flex: 2, justifyContent: "center", alignItems: "center", marginBottom: 10, paddingHorizontal: 10}}>
                            <TouchableOpacity style={{flex: 1, justifyContent: "center", width: "100%", paddingHorizontal: 10}} onPress={() => {setSumIsOpen(false)}}>
                                <FontIcon name="long-arrow-alt-left" size="50%" color="rgba(0, 0, 0, 1)"></FontIcon>
                            </TouchableOpacity>
                            <Text style={{fontFamily: "Poppins_400Regular", fontSize: 20}}>{item["Facility.Name"]}</Text>
                        </View>
                        <View style={{flex: 9 , paddingHorizontal: 20}}>
                            <View style={{flex: 1, borderBottomWidth: 2, borderBottomColor: "gray", borderTopWidth: 2, borderTopColor: "gray"}}>
                                <View style={{flex: 1}}>
                                    <Text style={{fontFamily: "Poppins_400Regular", fontSize: 20}}>Safety</Text>

                                </View>
               
                                <View style={{flexDirection: "row", flex:4}}>
                                    <View style={{justify_content: "center", alignItems: "center", flexDirection: "row", flex: 1}}>
                                        <View style={{padding: 10, flex: 1, justifyContent:"center", alignItems: "center"}}>
                                            <FontIcon name={item["complications_safety_sig"].includes("not")? "circle": (item["complications_safety_sig"].includes("better")? "thumbs-up":"thumbs-down")}
                                            color={item["complications_safety_sig"].includes("not")? "orange": (item["complications_safety_sig"].includes("better")? "green":"red")}
                                            size={50}></FontIcon>
                                        </View>
                                        <View style={{flexDirection: "column", flex:3}}>
                                            <Text style={{fontFamily: "Poppins_400Regular", fontSize: 25}}>{complications_safety_stat}</Text>
                                            <Text style={{fontFamily: "Poppins_400Regular"}}>Safety composite score</Text>
                                        </View>
                                        
                                    </View>
                                </View>
                                
                            </View>
                            <View style={{flex: 1, borderBottomWidth: 2, borderBottomColor: "gray"}}>
                                <View style={{}}>
                                    <Text style={{fontFamily: "Poppins_400Regular", fontSize: 20}}>Patient Satisfaction</Text>

                                </View>
                                <View style={{flex: 1, justifyContent: "center", alignContent: "center", flexDirection: "row"}}>
                                    <View style={{flex: patient_satisfaction_stat == 0? 0:1 , justifyContent: "center", alignItems: "center"}}>
                                        <Text style={{fontSize: 40, fontFamily: "Poppins_400Regular"}}>{patient_satisfaction_stat == 0? "": String(patient_satisfaction_stat)+"%"}</Text>

                                    </View>
                                    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                                        <FontIcon name={patient_satisfaction_stat == 0? "circle": item["patient_satisfaction_sig"].includes("not")? "circle": (item["patient_satisfaction_sig"].includes("better")? "thumbs-up":"thumbs-down")}
                                                color={patient_satisfaction_stat == 0? "gray": item["patient_satisfaction_sig"].includes("not")? "orange": (item["patient_satisfaction_sig"].includes("better")? "green":"red")}
                                                size={50}></FontIcon>
                                        <Text style={{fontFamily: "Poppins_400Regular", marginTop: "3%"}}>{patient_satisfaction_stat == 0? "No Data": item["patient_satisfaction_sig"].includes("not")? "Average": (item["patient_satisfaction_sig"].includes("better")? "Above Average":"Below Average")}</Text>
                                    </View>
                                    
                                </View>

                            </View>
                            <View style={{flex: 1, borderBottomColor: "gray", borderBottomWidth: 2}}>
                                <View style={{flex: 1}}>
                                    <Text style={{fontFamily: "Poppins_400Regular", fontSize: 20}}>Charges</Text>
                                </View>
                                <View style={{flex: 1, flexDirection: "row"}}>
                                    <View style={{flex: 4, justifyContent: "center"}}>
                                        <Text style={{fontFamily: "Poppins_400Regular", fontSize: 15}}>Type of Care</Text>
                                    </View>

                                    <View style={{flex: 5, justifyContent: "center"}}>
                                        <Text style={{fontFamily: "Poppins_400Regular", fontSize: 15}}>% Difference From Mean</Text>

                                    </View>
                                </View>
                                <View style={{flex: 4}}>
                                    <FlatList key={"<Charges>"} keyExtractor={(idx) => "<Charges>"+item.dcm_data[idx].dmc_text} scrollEnabled={true}
                                            data={Object.keys(item.dcm_data)} renderItem={(idx) => {
                                                return (
                                                    <View style={{width: "100%", flexDirection: "row", borderBottomColor: "grey", borderBottomWidth: 2}}>
                                                        <View style={{flex: 1, justifyContent: "center"}}>
                                                            <Text style={{fontFamily: "Poppins_400Regular"}}>{item.dcm_data[idx.item].dmc_text}</Text>

                                                        </View>
                                                        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                                                            <Text style={{fontFamily: "Poppins_400Regular", fontSize: 14}}>{item.dcm_data[idx.item].cost_dif_rel > 0? "+":""}{Math.round(item.dcm_data[idx.item].cost_dif_rel*100)}%</Text>
                                                        </View>

                                                    </View>
                                                )
                                            }}></FlatList>
                                </View>
                                
                            </View>
                            <View style={{flex: 1, borderBottomWidth: 2}}>
                                <View style={{flex: 1}}>
                                    <Text style={{fontFamily: "Poppins_400Regular", fontSize: 20}}>Cesarian vs Vaginal Birth Rates</Text>

                                </View>
                                <View style={{flexDirection: "row", flex: 4}}>
                                    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                                        <Text style={{fontSize: 20, fontFamily: "Poppins_400Regular"}}>{vaginal_stat == 0? "No Data": String(vaginal_stat)+"%"}</Text>
                                        <Text style={{fontFamily: "Poppins_400Regular"}}>Vaginal</Text>
                                    </View>

                                    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                                        <Text style={{fontFamily: "Poppins_400Regular", fontSize: 20}}>{cesarian_stat == 0? "No Data": String(cesarian_stat)+"%"}</Text>
                                        <Text style={{fontFamily: "Poppins_400Regular"}}>Cesarian</Text>
                                    </View>

                                </View>
                                
                            </View>

                           
                            
                        </View>
                        
                    </SafeAreaView>
                    
                </Modal>
            </View>

            <Callout tooltip>
                <Pressable onPress={() => {setSumIsOpen(true)}}>
                <TouchableOpacity style={{width: 300, elevation: 5, height:  100, backgroundColor: "rgba(0, 0, 0, 0.8)", borderRadius: 15, padding: 20, flex: 1, justifyContent: "center",
                                }}
                                onPress={() => {setSumIsOpen(true)}}>
                    <Text style={{color: "white"}}>{item["Facility.Name"]}</Text>
                    <Text style={{color: "white"}}>Patient satisfaction is {item["patient_satisfaction_stat"] != "NA"? item["patient_satisfaction_stat"]: "unavailable"}</Text>
                    <View style={{flexDirection: "row", marginBottom: 5}}>
                        <Text style={{color: "white"}}>Patient safety is </Text>
                        <Text style={{color: item["complications_safety_sig"].includes("not")? "yellow": (item["complications_safety_sig"].includes("better")? "green":"red")}}>{item["complications_safety_sig"].includes("not")? "average": (item["complications_safety_sig"].includes("better")? "above average":"below average")}</Text>

                    </View>
                    <Text style={{color: "white"}}>      {'>'}   Tap for more info</Text>

                </TouchableOpacity>
                </Pressable>
            </Callout>
        </Marker>
    )
 }