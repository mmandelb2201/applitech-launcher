const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', function () {

    // FIREBASE CONFIG
    var firebaseConfig = {
        apiKey: "AIzaSyDyxifVyDaiMnlM2Q6lhBoBtd5K6BG_M1s",
        authDomain: "indiehub.firebaseapp.com",
        databaseURL: "https://indiehub.firebaseio.com",
        projectId: "indiehub",
        storageBucket: "indiehub.appspot.com",
        messagingSenderId: "295378606335",
        appId: "1:295378606335:web:29b00fa7fe1e3bc4a194ca",
        measurementId: "G-MQR7SYH598",

    };


    var defaultProject = firebase.initializeApp(firebaseConfig);
    console.log(defaultProject.name);

});
