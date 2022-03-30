import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'
import 'firebase/compat/storage'

const firebaseConfig = firebase.initializeApp({
    apiKey: "AIzaSyAgDKGRG18XtgyIW7lAQwaYhwXSNEz24WU",
    authDomain: "react-67159.firebaseapp.com",
    projectId: "react-67159",
    storageBucket: "react-67159.appspot.com",
    messagingSenderId: "511107520956",
    appId: "1:511107520956:web:48695d8fe22bd9f68ef3b9"
})

export const firestore = firebaseConfig.firestore()
export const auth = firebase.auth()
export const storage = firebase.storage().ref()
export default firebaseConfig