import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyBXJSrRgAw1jOHA9bz7_2S1LUjlzm9xeMk',
  authDomain: 'onesim-co.firebaseapp.com',
  projectId: 'onesim-co',
  storageBucket: 'onesim-co.appspot.com',
  messagingSenderId: '687444188661',
  appId: '1:687444188661:web:258641b306f2f64b6094bc'
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export default app