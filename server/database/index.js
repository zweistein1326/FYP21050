const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, onValue, update, } = require('firebase/database');

const firebaseConfig = {
    apiKey: "AIzaSyAsppKDbMex2tMI1DRGas1KTUNV29NjHzU",
    authDomain: "final-yp-673d5.firebaseapp.com",
    databaseURL: "https://final-yp-673d5-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "final-yp-673d5",
    storageBucket: "final-yp-673d5.appspot.com",
    messagingSenderId: "751109794015",
    appId: "1:751109794015:web:fc667fc7704d2d0d44616a",
    measurementId: "G-B4EY8E4L7Q"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

var users = []

try {
    onValue(ref(db, '/users'), (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            users = Object.values(data);
            console.log('users updated')
        }
        else {
            console.log('No data available');
        }
    });
} catch (err) {
    console.log(err);
}

async function writeUserData(user) {
    try {
        set(ref(db, 'users/' + user.id), { id: user.id, email: user.email, username: user.username, password: user.password });
    } catch (err) {
        console.log(err);
    }
}

async function updateUserData(userId, updates) {
    try {
        update(ref(db, 'users/' + userId), updates).then(() => {
            console.log('successfully updated')
        })
    }
    catch (err) {
        console.error(err);
    }
}

function getUserByEmail(email) {
    console.log(users);
    return users.find((user) => user.email === email);
}

function getUserById(userId) {
    return users.find(({ id }) => userId == id)
}

function getAllUsers() {
    return users;
}


module.exports = {
    getAllUsers,
    getUserByEmail,
    getUserById,
    writeUserData,
    updateUserData,
    db
};
