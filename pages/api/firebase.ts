import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyCWV1mtd8rNWATwqQGvuA2rnf8oxNlKNc8',
  authDomain: 'onesim-e83f3.firebaseapp.com',
  projectId: 'onesim-e83f3',
  storageBucket: 'onesim-e83f3.appspot.com',
  messagingSenderId: '730419349170',
  appId: '1:730419349170:web:2a5fc0d71f838b01a46bab'
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export default app