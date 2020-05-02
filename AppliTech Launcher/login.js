
const electron = require("electron");
const remote = require("electron").remote;

//check to see if user is already signed in then change page if user is signed in
window.onload = function () {
    firebase.auth().onAuthStateChanged(function (user) {

        if (user) {
            ipcRenderer.send("login-success");
            console.log("signed in successfully");
            var window = remote.getCurrentWindow();
            window.close();
        } else {
            console.log("nobody's here");
        }

    });
};

//look for submit button
document.getElementById("loginButton").onclick = function () {

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    console.log(email, password);


    //attempt sign in
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(function () {

         return firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
            //transition to run program screen on successful login
            ipcRenderer.send("login-success");
            console.log("signed in successfully");
            var window = remote.getCurrentWindow();
            window.close();
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorMessage != "") {
                console.log(errorMessage);
                document.getElementById("errorLabel").textContent = errorMessage;
            };
            // ...
        });

    });

};



