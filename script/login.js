import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-analytics.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js"
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";
const firebaseConfig = {
    apiKey: "AIzaSyC5616FooIAGd1evh7Hl09eQYT8iUs5UJY",
    authDomain: "authentication-9e325.firebaseapp.com",
    projectId: "authentication-9e325",
    storageBucket: "authentication-9e325.appspot.com",
    messagingSenderId: "609048115020",
    appId: "1:609048115020:web:a971e409c5264beb2141e9",
    measurementId: "G-EHRPDJKLWY"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
console.log("hii")
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

document.getElementById("btnSubmit").addEventListener("click", function () {
    event.preventDefault();
    var email = document.getElementById("registerEmail").value;
    var password = document.getElementById("registerPassword").value;
    var FullName = document.getElementById("fullName").value;
    var confirmPassword = document.getElementById("confirm-password").value;
    if (password !== confirmPassword) {
        console.error("Passwords do not match.");
        alert("Passwords don't match");
        return;
    }
    createUserWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
        const user = userCredential.user;
        const authToken = await userCredential.user.getIdToken();
        const userId = user.uid;
        const fullName = FullName;
        const email = user.email;
        const photourl = user?.photoURL;

        await setDoc(doc(db, "users", userId), {
            fullName: fullName,
            userId: userId,
            email: email,
            photourl: photourl,
        }).catch((error) => {
            const errorCode = error.code;
            console.log(error.message)
        })
        alert("Registration successful");
        window.location.href = 'index.html?authToken=' + authToken;
    }).catch((err) => {
        const errorCode = err.code;
        const errorMessage = err.message;
        console.log(errorMessage);
        alert(errorMessage);
    });
});

document.getElementById("btnLogIn").addEventListener("click", function () {
    event.preventDefault();
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
        const user = userCredential.user;
        // console.log(user);
        const authToken = await userCredential.user.getIdToken(); // Get the authentication token
        localStorage.setItem('authToken', authToken);
        alert(user.email + " Login Successfully");
        window.location.href = 'index.html?authToken=' + authToken;
    }).catch((err) => {
        const errorCode = err.code;
        const errorMessage = err.message;
        console.log(errorMessage);
        alert(errorMessage);
    });
});


document.getElementById("btnGoogleLogin").addEventListener("click", async () => {
    signInWithPopup(auth, provider)
        .then(async (result) => {
            const user = result.user;
            const authToken = await user.getIdToken();
            // Decode the JWT token to get the payload
            const tokenParts = authToken.split('.');
            const encodedPayload = tokenParts[1];
            const decodedPayload = atob(encodedPayload);
            const payload = JSON.parse(decodedPayload);

            // Check if the payload includes an 'exp' claim (expiration time)
            if (payload.exp) {
                const expirationTimestamp = payload.exp; // This is the expiration time in seconds since the Unix epoch
                const expirationDate = new Date(expirationTimestamp * 1000); // Convert to a JavaScript Date object (in milliseconds)
                document.cookie = `authToken=${authToken}; expires=${expirationDate.toUTCString()}; path=/; secure; HttpOnly`;
            } else {
                console.log("Token does not contain an 'exp' claim.");
            }


            localStorage.setItem('authToken', authToken);
            const userId = user.uid;
            const fullName = user.displayName;
            const email = user.email;
            const photourl = user.photoURL;
            console.log(user);

            await setDoc(doc(db, "users", userId), {
                fullName: fullName,
                userId: userId,
                email: email,
                photourl: photourl,
            }).catch((error) => {
                const errorCode = error.code;
                console.log(error.message)
            })
            alert(`${fullName} Login Successfully`)

            // Redirect to the next page with the authToken as a query parameter
            window.location.href = 'index.html?authToken=' + authToken;


        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage)
        })
})

document.getElementById("logout").addEventListener("click", function () {
    signOut(auth).then(() => {
        localStorage.removeItem('authToken');
        console.log("sign out successfull");
        alert("Sign out successfull")
    }).catch((err) => {
        const errorMessage = err.message;
        console.log("err" + errorMessage)
    })
})
