import { db, storage } from '../../firebase/firebaseConfig';
import {
	addDoc,
	collection,
	getDocs,
	query,
	updateDoc,
	where
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

export async function getVendorPhoneNumber(id) {
	return;
}

export const getCars = async () => {
	try {
		const querySnapshot = await getDocs(collection(db, 'vehicles'));
		if (querySnapshot.docs.length > 0) {
			try {
				const fetchedVehicles = querySnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data()
				}));

				return fetchedVehicles;
			} catch (error) {
				console.error(console.error());
				return null;
			}
		}
	} catch (error) {
		console.error(error);
	}
};
