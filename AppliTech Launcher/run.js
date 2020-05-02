// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase = require("firebase/app");

// Add the Firebase products that you want to use

require("firebase/auth");
require("firebase/firestore");
//get electron remote for ipc sends
const remote = require("electron").remote;
var child = require('child_process').execFile;
const { dialog } = require('electron').remote;
//child modules
const { spawn } = require('child_process');
//file open error dialog box
const fileError = {
    type: 'question',
    buttons: ['Ok'],
    defaultId: 2,
    title: 'AppliTech Launcher: Error',
    message: 'There was an issue running the program',
    detail: 'Please make sure the file path is correct or the program might already be running',
};
//file error if no path has been saved
const noPath = {
    type: 'question',
    buttons: ['Cancel', 'OK'],
    okID: 1,
    cancelID: 0,
    defaultId: 3,
    title: 'AppliTech Launcher: Error',
    message: 'No Path For The Program Has Been Saved',
    detail: 'Please Select The Path',
}
//ask user if they're sure they want to change file location
const changeFileLoc = {
    type: 'question',
    buttons: ['No', 'Yes'],
    noID: 1,
    yesID: 0,
    defaultId: 4,
    title: 'File Location Change',
    message: 'You are about to change the file location for one of your softwares',
    detail: 'Are you sure you want to do this?'
}
//user does not own software
const doesntOwn = {
    type: 'question',
    buttons: ['OK'],
    defaultId: 5,
    title: 'IndieHub Launcher: Alert',
    message: 'You currently do not own the software you are trying to open',
    detail: 'Please purchase this software from our site, indiehub.com, if you want to have access to it'
}
class software {
    constructor(nam, fileLoc, ico, auth, promoTxt, pID) {
        this.name = nam;
        this.fileLocation = fileLoc;
        this.icon = ico;
        this.author = auth;
        this.promoText = promoTxt;
        this.programID = pID;
        console.log("software information: "+this.name + this.icon + this.fileLocation + this.author + "this is the program id: " +this.programID);
        
    }

    addToHTML(ffb, fpath, pIDD) {
        //create div
        var dv = document.createElement("div");
        dv.setAttribute("class", "softwarepreview");
        //create software-preview
        var sp = document.createElement("ul");
        sp.setAttribute("id", "software-preview");
        //create icon
        var liOne = document.createElement("li")
        var ic = document.createElement("img");
        ic.setAttribute("src", this.icon);
        ic.setAttribute("height", "80px");
        ic.setAttribute("width", "80px");
        liOne.appendChild(ic);
        //create title tag
        var liTwo = document.createElement("li");
        var title = document.createElement("p");
        title.innerHTML = this.name;
        liTwo.appendChild(title);
        //create publisher tag
        var liThree = document.createElement("li");
        var pb = document.createElement("p");
        pb.innerHTML = "Publisher: " + this.author;
        liThree.appendChild(pb);
        var liSeven = document.createElement("li");
        liSeven.setAttribute("class", "promoText");
        liSeven.setAttribute("id", "productPromoDescrip")
        var pt = document.createElement("d");
        pt.setAttribute("id", "productPromoText");
        pt.innerHTML = this.promoText;
        liSeven.appendChild(pt);
        //create launch button
        var liFour = document.createElement("li");
        var lb = document.createElement("input");
        lb.setAttribute("type", "button");
        lb.setAttribute("value", "Launch");
        lb.setAttribute("id", "launchButton");
        liFour.appendChild(lb);
        //create error label
        var liFive = document.createElement("li");
        var er = document.createElement("p");
        er.setAttribute("id", "errorLabel");
        liFive.appendChild(er);
        //create file find button
        var liSix = document.createElement("li");
        liSix.appendChild(ffb);
        //add things to the ul
        sp.appendChild(liOne);
        sp.appendChild(liTwo);
        sp.appendChild(liThree);
        sp.appendChild(liSeven);
        sp.appendChild(liFour);
        sp.appendChild(liFive);
        sp.appendChild(liSix);
        //add to the div
        dv.appendChild(sp);
        //add functionality to launch button
        lb.onclick = function () {
            openFile(fpath, pIDD, lb);
        }
        //add everything to the HTML file
        document.body.appendChild(dv);
    }

    get location() {
        return this.fileLocation;
    }

    set fileLocationString(newLoc) {
        this.fileLocation = newLoc;
    }
    get programaticID() {
        return this.programID;
    }

}
//setup all elements of the page once the page loads
document.addEventListener('DOMContentLoaded', function () {

    firebase.firestore().settings({
        cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
    });

    let db = firebase.firestore();

    let user = firebase.auth().currentUser;

    firebase.auth().onAuthStateChanged(function (user) {

        if (user) {
            let uid = user.uid;
            db.collection("users").doc(uid).get().then(function (doc) {

                if (doc.exists) {
                    var data = doc.data();
                    var username = data.username;
                    //document.getElementById("welcomeLabel").innerHTML = "Welcome " + username + ",";
                    document.getElementById("afterWelcomeLabel").innerHTML = username;
                    //get the users software IDs 
                    userOS = data.purchasedSoftware //productID of products user owns 
                    //set profile picture
                    console.log("image url: " + data.profilePicURL);
                    document.getElementById("profilePic").src = data.profilePicURL;
                    //run through each part of array
                    var i = 0;
                    while (i < userOS.length) {
                        console.log("i: " + i + " userOS.length: " + userOS.length);
                        console.log(userOS[i]);
                        var tempArray = [];
                        tempArray = doc.get(userOS[i]);
                        console.log(tempArray.length);
                        // create temp software
                        var tempSofty = new software(tempArray[0], tempArray[5], tempArray[2], tempArray[1], tempArray[3], tempArray[4]);
                        console.log("name: " + tempArray[0]);
                        var tempFileFind = document.createElement("input");
                        tempFileFind.setAttribute("type", "button");
                        tempFileFind.setAttribute("value", "");
                        tempFileFind.setAttribute("class", "fileFindButton");
                        tempFileFind.setAttribute("id", "fileFind"+tempArray[0]);
                        //add software to the HTML for user to see
                         tempSofty.addToHTML(tempFileFind, tempArray[5], tempArray[4]);
                         document.getElementById("fileFind" + tempArray[0]).onclick = function () {
                             changeLoc(tempArray[5], tempArray[4]);
                         };
                         i = i + 1;
                    };
                    return
                } else {
                    console.log("nobody's here");
                }

            });
        }
    });
});
//add functionality to logout button
document.getElementById("signOutButton").onclick = function () {
    firebase.auth().signOut().then(function () {
        setTimeout(() => {
            ipcRenderer.send("signout-success");
            console.log("signout successfulllllyyyyyyy8");
            var window = remote.getCurrentWindow();
            window.close();
        }, 500);
    });
};
//funciton to allow user to change .exe file location
function changeLoc(path, progID) {
    dialog.showMessageBox(null, changeFileLoc).then(result => {
        if (result.response == 1) {
            console.log("yes");
            var loc = dialog.showOpenDialogSync({ properties: ["openFile"], filters: [{ name: 'All Files', extensions: ['exe'] }] });
            console.log("file loc" + loc);
            if (loc.length != 0) {
                openFile(loc + "", progID);
                //update user data to save file location
                let user = firebase.auth().currentUser;
                let uid = user.uid;
                console.log("user id in open file path: " + uid + "program id: " + progID);
                console.log("updating location: " + loc);
                firebase.firestore().collection("users").doc(uid).update({
                    [progID]: firebase.firestore.FieldValue.arrayRemove(path + "")
                }).then(function () {
                    console.log("done removing");
                }).catch(function (err) {
                    console.log("error updating: " + err);
                });
                firebase.firestore().collection("users").doc(uid).update({
                    [progID]: firebase.firestore.FieldValue.arrayUnion("" + loc)
                }).then(function () {
                    console.log("done adding");
                }).catch(function (err) {
                    console.log("error updating: " + err);
                });
            }
        else {
            return
        }
        } else {
            console.log("no");
            return
        }
    })
}
//function to run .exe file first checks to see if firebase hasn't saved location data yet
function openFile(path, progID, launchBtn) {

    let user = firebase.auth().currentUser;
    let uid = user.uid;
    //check to see user owns the software
    if (doesOwn(progID, uid) == true) {
        if (path == "nullRN") {
            const response = dialog.showMessageBox(null, noPath).then(result => {
                if (result.response == 1) {
                    var loc = dialog.showOpenDialogSync({ properties: ["openFile"], filters: [{ name: 'All Files', extensions: ['exe'] }] });
                    console.log("file loc" + loc);
                    if (loc.length != 0) {
                        openFile(loc + "", progID, launchBtn);
                        //update user data to save file location
                        let user = firebase.auth().currentUser;
                        let uid = user.uid;
                        console.log("user id in open file path: " + uid + "program id: " + progID);
                        console.log("updating location: " + loc);
                        firebase.firestore().collection("users").doc(uid).update({
                            [progID]: firebase.firestore.FieldValue.arrayRemove(path + "")
                        }).then(function () {
                            console.log("done removing");
                        }).catch(function (err) {
                            console.log("error updating: " + err);
                        });
                        firebase.firestore().collection("users").doc(uid).update({
                            [progID]: firebase.firestore.FieldValue.arrayUnion("" + loc)
                        }).then(function () {
                            console.log("done adding");
                        }).catch(function (err) {
                            console.log("error updating: " + err);
                        });
                    }
                } else {
                    return
                }
            });
        } else {
            let process = child(path, function (err, data) {
                if (err) {
                    console.log(err);
                    const response = dialog.showMessageBox(null, fileError, (response) => {
                        console.log(response);
                    });

                    return;
                } else {
                    while (process.exists) {
                        console.log("afasd");
                        launchBtn.innerHTML = "dasfasf";
                    }  
                }


                console.log(data.toString());
            });
        }
    } else {
        //display dialog that user does not own the software they're trying to open
        dialog.showMessageBox(null, doesntOwn);
    }

}
//check if user owns software
function doesOwn(progID, uid) {
    if (progID == "eclipse") {
        return false;
    } else {
        return true;
    }
};

