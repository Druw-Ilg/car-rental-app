import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';


export const Sedan = () =>{
    <View style={styles.carCards}>
        <Text><Image>Sedan Cars</Image></Text>
    </View>
}

export const SUV = () =>{
    <View style={styles.carCards}>
        <Text>
            <Image>SUV Cars</Image>
        </Text>
    </View>
}

export const Auth = () =>{
    <View>
        <Text>Se connecter/S&apos;inscrire</Text>
    </View>
}


const styles = StyleSheet.create({

})