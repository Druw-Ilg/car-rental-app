/* eslint-disable react/prop-types */
import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ScrollView
} from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { SettingsStyle } from '../Styles';

const OtherSettings = ({ navigation }) => {
	return (
		<ScrollView style={styles.container}>
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Contenu</Text>
				<View style={styles.option}>
					<Text style={styles.optionText}>Langue</Text>
					<Text style={styles.optionValue}>Français</Text>
				</View>
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Notifications</Text>
				<TouchableOpacity style={styles.option}>
					<Text style={styles.optionText}>Push Notifications</Text>
					<AntIcon name="arrowright" size={30} color="#000" />
				</TouchableOpacity>
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>À propos</Text>

				<TouchableOpacity
					style={styles.option}
					onPress={() => navigation.navigate('Policies')}
				>
					<Text style={styles.optionText}>Politique de confidentialité</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.option}
					onPress={() => navigation.navigate('Ts&Cs')}
				>
					<Text style={styles.optionText}>Termes & conditions</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.option}
					onPress={() => navigation.navigate('Contact')}
				>
					<Text style={styles.optionText}>Contact/Service client</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create(SettingsStyle);

export default OtherSettings;
