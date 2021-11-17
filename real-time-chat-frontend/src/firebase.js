import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyBde_RMjwWZ5AajHKJ7d90n5y__7SXPLaA",
    authDomain: "real-time-chat-proj.firebaseapp.com",
    projectId: "real-time-chat-proj",
    storageBucket: "real-time-chat-proj.appspot.com",
    messagingSenderId: "48845551248",
    appId: "1:48845551248:web:d11b9251b8f4e1129e4a15"
};

const firebaseApp = firebase.initializeApp(firebaseConfig)

const db = firebaseApp.firestore()
const auth = firebase.auth()
const provider = new firebase.auth.GoogleAuthProvider()

export { auth, provider }
export default db