import React, { useState, useEffect, useContext } from 'react';
import {
	View,
	Text,
	TextInput,
	Image,
	StyleSheet,
	ScrollView,
	ActivityIndicator,
	TouchableOpacity
} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

const UserProfile = () => {
    const [name, setName] = useState( '');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [isVendor, setIsVendor] = useState(true || false);

  return (<ScrollView contentContainerStyle={styles.container}>
    <View style={styles.avatar}>
     
            <Image
                source={require('..//..//../assets/user-profile.jpg')}
                style={styles.avatarImage}
            />
    
        <TouchableOpacity >
            <Text>
                Modifier votre avatar
                <EvilIcons name="pencil" size={30} color="#000" />
            </Text>
        </TouchableOpacity>
    </View>

    {/* ******* Alert Messages ******* */}
    <View>
       
    </View>

    {/* ******* Alert Messages ******* */}

    <TextInput
        style={styles.input}
        value="name"
       
        placeholder="Name/Company Name"
    />
    <TextInput
        style={styles.input}
        value="Phone"
       
        placeholder="Phone Number"
        keyboardType="phone-pad"
    />
    <TextInput
        style={styles.input}
        value="Email"
       
        placeholder="Email"
        keyboardType="email-address"
        editable={false} // email is not editable
    />
  
        <TouchableOpacity  style={styles.formBtn}>
            <Text style={styles.txtFormBtn}>Mettre à jour</Text>
        </TouchableOpacity>
</ScrollView>
);
};

const styles = StyleSheet.create({
container: {
flexGrow: 1,
padding: 20,
backgroundColor: '#fff'
},
avatar: {
alignItems: 'center',
marginBottom: 50
},
avatarImage: {
width: 150,
height: 150,
borderRadius: 100
},
title: {
fontSize: 24,
fontWeight: 'bold',
marginBottom: 20,
textAlign: 'center'
},
input: {
borderWidth: 1,
borderColor: '#ccc',
padding: 10,
borderRadius: 12,
marginBottom: 10,
fontSize: 18
},
alertMsg: {
textAlign: 'center',
fontSize: 18
},
errorMessage: {
color: 'red'
},
successMessage: {
color: 'green'
},
formBtn: {
backgroundColor: 'rgb(40 52 74)',
width: '100%',
paddingVertical: 10,
paddingHorizontal: 20,
borderRadius: 12,
marginTop: 20,
fontWeight: 'bold'
},
txtFormBtn: {
color: '#fff',
fontSize: 18,
textAlign: 'center'
}
});
export default UserProfile