import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ScrollView
} from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';
const UserSettings = () => {
	return (
		<ScrollView style={styles.container}>
			<Text style={styles.heading}>Préférences</Text>
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Mon Compte</Text>
				<TouchableOpacity style={styles.option}>
					<Text style={styles.optionText}>Mettre email à jour</Text>
					<AntIcon name="arrowright" size={30} color="#000" />
				</TouchableOpacity>
			</View>

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
				<TouchableOpacity style={styles.option}>
					<Text style={styles.optionText}>Politique de confidentialité</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.option}>
					<Text style={styles.optionText}>Termes & conditions</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.option}>
					<Text style={styles.optionText}>Contact/Service client</Text>
				</TouchableOpacity>
			</View>

			<TouchableOpacity>
				<Text style={styles.deleteText}>Supprimer mon compte</Text>
			</TouchableOpacity>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5F5F5',
		padding: 20
	},
	heading: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 20
	},
	section: {
		marginBottom: 30
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 10
	},
	option: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 15,
		borderBottomWidth: 1,
		borderBottomColor: '#E0E0E0'
	},
	optionText: {
		fontSize: 16
	},
	optionValue: {
		fontSize: 16,
		color: '#666'
	},
	arrow: {
		fontSize: 16,
		color: '#666'
	},

	deleteText: {
		fontSize: 14,
		color: '#666',
		textAlign: 'center'
	}
});

export default UserSettings;
