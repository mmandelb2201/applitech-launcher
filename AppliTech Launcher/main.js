//--------------THINGS TO REMOVE BEFORE DISPLAYING PROTOTYPE-----------
// window.webContents.OpenDevTools
 

// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");

//node modules
const electron = require("electron");
const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");
const remote = require("electron").remote;
const { ipcMain } = require("electron");

//windows
let login;
let main;

function start() {

    var firebaseConfig = {
        apiKey: "AIzaSyDyxifVyDaiMnlM2Q6lhBoBtd5K6BG_M1s",
        authDomain: "indiehub.firebaseapp.com",
        databaseURL: "https://indiehub.firebaseio.com",
        projectId: "indiehub",
        storageBucket: "indiehub.appspot.com",
        messagingSenderId: "295378606335",
        appId: "1:295378606335:web:29b00fa7fe1e3bc4a194ca",
        measurementId: "G-MQR7SYH598"
    };

    firebase.initializeApp(firebaseConfig);

    createWindows();
}

function createWindows() {
 
    //create all windows
    login = new BrowserWindow(
        {
            width: 350,
            height: 500, 
            title: "AppliTech Launcher Login",
            icon: __dirname + "/images/indieHubIcon.png",
            show: false,
            resizable: false,
            webPreferences: {
                nodeIntegration: true
            }
        });

    main = new BrowserWindow({
        width: 1100,
        height: 900,
        title: "AppliTech Launcher",
        resizable: false,
        show: false,
        icon: __dirname + "/images/indieHubIcon.png",
        webPreferences: {
        nodeIntegration: true
            }
    });

    //check to see if user is signed in, then transition to corresponding screen
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            openMain();
        } else {
            openLogin();
        }

    });




    main.on("closed", () => {
        main = null;
    });

    login.on("closed", () => {
        login = null;
    });
}
//run create window
app.on("ready", start);

//quit when all windows closed
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }

    var prefsWindow = new BrowserWindow({
        width: 800,
        height: 1000,
        show: false
    });
    prefsWindow.loadURL("file://" + __dirname + "prefs.html");
});

//open first window user sees depending on if they're already signed in or not
function openMain() {

    main.webContents.openDevTools();

    main.loadURL(url.format({
        pathname: path.join(__dirname, 'run.html'),
        protocol: "file:",
        slashes: true
    }));

    main.show();
}
function openLogin() {

    //login.webContents.openDevTools();

    login.loadURL(url.format({
        pathname: path.join(__dirname, 'login.html'),
        protocol: "file:",
        slashes: true
    }));

    login.show();
}
//create new instances of each window
function transisionToLoginAfterLogout() {

    var temp = new BrowserWindow(
        {
            width: 350,
            height: 500,
            title: "AppliTech Launcher Login",
            icon: __dirname + "/images/indieHubIcon.png",
            show: false,
            resizable: false,
            webPreferences: {
                nodeIntegration: true
            }
        });
    temp.loadURL(url.format({
        pathname: path.join(__dirname, 'login.html'),
        protocol: "file:",
        slashes: true
    }));

    //temp.webContents.openDevTools();

    temp.show();
}
function transitionToMain() {

    var temp = new BrowserWindow({
        width: 1100,
        height: 900,
        title: "AppliTech Launcher",
        resizable: false,
        show: false,
        icon: __dirname + "/images/indieHubIcon.png",
        webPreferences: {
            nodeIntegration: true
        }
    });
    temp.loadURL(url.format({
        pathname: path.join(__dirname, 'run.html'),
        protocol: "file:",
        slashes: true
    }));

   temp.webContents.openDevTools();

    temp.show();
}
//handle ipc sends
ipcMain.on("login-success", function() {
    transitionToMain();
});
ipcMain.on("signout-success", function () {
    transisionToLoginAfterLogout();
});




