import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, push } from "firebase/database";
import { getAuth, onAuthStateChanged, signInWithRedirect, GoogleAuthProvider } from "firebase/auth";
const firebaseApp = initializeApp({
    apiKey: "AIzaSyDTnaPjiQ50YYEmNUFEdA4gUytZSdyhvqc",
    authDomain: "chatroom-e7bb9.firebaseapp.com",
    databaseURL: "https://chatroom-e7bb9-default-rtdb.firebaseio.com",
    projectId: "chatroom-e7bb9",
    storageBucket: "chatroom-e7bb9.appspot.com",
    messagingSenderId: "1022352950442",
    appId: "1:1022352950442:web:013394d96451343adabcd3"
})
const auth = getAuth();
onAuthStateChanged(auth, user => {
    if (user == null) {
        return
    } else {
        console.log(user);
    }
})
const btn = document.querySelector("#check");
btn.addEventListener("click", () => {
    signInWithRedirect(auth, new GoogleAuthProvider())
})

const db = getDatabase(firebaseApp);
console.log(db);
const userRef = ref(db, "chatroom");
const messageRef = ref(db, "chatroom/message")
onValue(userRef, (snapshot) => {
    const data = snapshot.val();
    console.log(data);
})
function writeUserData(userId, name, email) {
    set(ref(db, 'user/' + userId), {
        username: name,
        email: email
    })
}

writeUserData(4, "張三", "k12345@gmail.com");
writeUserData(5, "李四", "k12345@gmail.com");

// vue部分
const app = Vue.createApp({
    data() {
        return {
            message: " ",
            chatroom: [],
            username: " ",

        }
    },
    methods: {
        addMessage() {
            const date = new Date().getTime();
            const newMessage = push(messageRef);
            set(newMessage, {
                username: this.username,
                message: this.message,
                time: new Date(date).toLocaleString()
            })
            this.message = ''
        },

    },
    mounted() {
        onValue(messageRef, (snapshot) => {
            const data = snapshot.val();
            console.log(data)
            this.chatroom = data
        })
    }
}
)
app.mount("#app");
