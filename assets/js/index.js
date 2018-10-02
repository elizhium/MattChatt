// Initialize Firebase
var config = {
    apiKey: "AIzaSyDMFDDjbk7tOEeqsO_evebul166VQl4CR0",
    authDomain: "first-lesson-a81e0.firebaseapp.com",
    databaseURL: "https://first-lesson-a81e0.firebaseio.com",
    projectId: "first-lesson-a81e0",
    storageBucket: "first-lesson-a81e0.appspot.com",
    messagingSenderId: "213223109314"
};
firebase.initializeApp(config);

var database = firebase.database();
var messageRef = database.ref("messages/")
var onlineRef = database.ref("online/")
let username = null
var nameSet = false
var focused = true
var original = "MattChatt"
let pingSend = false

function pingOnline(){

    pingSend = true
    onlineRef.remove()
    onlineRef.push(JSON.parse('{"online":"'+localStorage.getItem("username")+'"}'))

}

function renderOnline(data){
    if(data === null){
        console.log("Only you are online")
    }else{
        console.log("Nu online:")
        let onlines =(Object.values(data))
        onlines.forEach(onlineObj => {
            console.log((Object.values(onlineObj))[0])
        }

        )
    }
}

function answerOnline(snapchot){
data = snapchot.val()

if(data != null && nameSet && (Object.keys(data)).length == 1){

    if(pingSend){
        pingSend = false
    }else{
        console.log("adding name")
        onlineRef.push(JSON.parse('{"online":"'+localStorage.getItem("username")+'"}'))

    }
}else{
    renderOnline(data)
}



}

function changeName (name){
    yourname = name
    pingOnline()
}

function notify(bericht) {

    window.document.title = "berichtje!!!"

    if (Notification.permission !== "granted")
        Notification.requestPermission();
    else {
        let sender = "";
        let message = "";
        for (var key in bericht) {
            if (bericht.hasOwnProperty(key) && key !== "timestamp") {
                sender = key;
                message = bericht[key];
            }
        }

        var notification = new Notification(sender, {
            icon: 'https://png.icons8.com/cotton/1600/filled-chat.png',
            body:message,
        });

        notification.onclick = function () {
            window.open("https://bruynooghematthias.github.io/MattChatt/");
        };

    }


}

function cleanChat(data) {
    var removed = 0
    while((Object.keys(data)).length-removed >250){
    messageRef.child(Object.keys(data)[0]).remove()
    removed += 1



    }


}

function getMessage(data) {
    var messages = Object.values(data.val());

    document.getElementById("chatWindow").innerHTML = ""
    messages.forEach((bericht) => {

            message = document.createElement("div");
            if (Object.keys(bericht)[0] === localStorage.getItem("username")) {
                message.setAttribute("class", "messageBox me");
            } else {
                message.setAttribute("class", "messageBox");
            }
            var name = document.createElement("span");
            var textAndTime = document.createElement("div");
            var text = document.createElement("span");
            var time = document.createElement("span");
            textAndTime.classList.add("textTime");
            name.innerText = Object.keys(bericht)[0];
            text.innerText = Object.values(bericht)[0];
            time.innerText = Object.values(bericht)[1];
            name.setAttribute("class", "name");
            text.setAttribute("class", "message");
            time.setAttribute("class", "time");
            message.appendChild(name);
            textAndTime.appendChild(text);

            textAndTime.appendChild(time);
            message.appendChild(textAndTime);
            document.getElementById("chatWindow").appendChild(message)


        }
    )

    updateScroll();

    if (!focused) {
        notify(messages[messages.length - 1])
    }

cleanChat(data.val())

if(nameSet){

    pingOnline()
}


}


function sendMessage(message) {
    var d = new Date
    var timeString = d.getHours()
    var min = d.getMinutes()
    if (d.getMinutes() < 10) {
        min = "0" + min
    }
    timeString = timeString + ":" + min

    let send = '{"'+yourname+'":"'+message+'", "timestamp":"'+  timeString +'"}'
    messageRef.push(JSON.parse(send));
}

function sendFromPage(e) {
    e.preventDefault();
    if (nameSet) {
        message = document.getElementById("mess").value;
        document.getElementById("mess").value = "";
        sendMessage(message)
    }
    else {
        alert("please choose a name")
    }
}

function changeNameFromPage(e) {
    e.preventDefault();
    const name = document.getElementById("changeName").value;
    localStorage.setItem("username", name);
    changeName(name);
    document.getElementById("nameForm").remove();
    nameSet = true;

}



function updateScroll(){
    var element = document.getElementById("chatWindow");
    element.scrollTop = element.scrollHeight;

}


function messageBoxColorChange(e){
let color = document.getElementById("messageBoxColor").value
console.log(color)

var html = document.getElementsByTagName('html')[0];
html.style.cssText = ("--chatBox:"+ color);
localStorage.setItem("--chatBox", color);
}

function textColorChange(e){
    let color = document.getElementById("messageTextColor").value
    console.log(color)
    
    var html = document.getElementsByTagName('html')[0];
    html.style.cssText = ("--text-color:"+ color);
    localStorage.setItem("--text-color", color);
    }

window.onfocus = function () {

    focused = true
    window.document.title = original

}
window.onblur = function () {
    original = window.document.title
    focused = false

}

function changeCssVar(vari, val){

    var html = document.getElementsByTagName('html')[0];
    html.style.cssText = (vari+":"+ val);
}

function loadCssVar(vari){
    let val 
    if(!(localStorage.getItem(vari))){
         val = getComputedStyle(document.body).getPropertyValue(vari);

    

    }
    else{
         val = localStorage.getItem(vari)
        
    }
    
    return val
}

function setColorInput(inputId, val){
    console.log(val)
    
    document.getElementById(inputId).value = val


}



function makeOptions(){
    let messageBoxColor = loadCssVar("--chatBox")
    changeCssVar("--chatBox", messageBoxColor)   
    setColorInput("messageBoxColor", messageBoxColor) 
    let messageTextColor = loadCssVar("--text-color")
    changeCssVar("--text-color", messageTextColor)   
    setColorInput("messageTextColor", messageTextColor) 

    
    
}



document.addEventListener('DOMContentLoaded', function () {
    if (!Notification) {
        alert('Desktop notifications not available in your browser. Try Chromium.');
        return;
    }

    if (Notification.permission !== "granted")
        Notification.requestPermission();
});

function start (){

    document.getElementById("send").addEventListener("click", sendFromPage);
    document.getElementById("changeNameButton").addEventListener("click", changeNameFromPage);
    document.getElementById("messageBoxColor").addEventListener("change", messageBoxColorChange);
    document.getElementById("messageTextColor").addEventListener("change",textColorChange)
    makeOptions()


    username = localStorage.getItem("username");
    if(username !== null){
        changeName(username);
        nameSet = true;
        $("#nameForm").remove()
    }


    messageRef.on("value", getMessage);
    onlineRef.on("value", answerOnline);
}

document.addEventListener("DOMContentLoaded", start)
