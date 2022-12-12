import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';
import { useState } from 'react';

export function HospitalSummary({item, isOpen, setIsOpen}) {
    const dmc_data = item.dcm_data

    return (
        <Modal visible={isOpen}>

        </Modal>
    )
}