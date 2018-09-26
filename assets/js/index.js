
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
var ref = database.ref("messages/")
var yourname = ""
var nameSet = false
var focused = true
var original = "MattChatt"

function changeName (name){
    yourname = name
}

function notify (bericht){
    window.document.title = "berichtje!!!"


    if (!Notification.permission==="granted"){
        Notification.requestPermission()
    }
   
    var not = new Notification("berichtje", {
        body: "Je hebt een bericht gekregen op MattChatt"
    });


    
}

function cleanChat(data){
    var removed = 0
    while((Object.keys(data)).length-removed >250){
    ref.child(Object.keys(data)[0]).remove()
    removed += 1 
    

    
    }


}

function getMessage(data) {
    var messages = Object.values(data.val());

    document.getElementById("chatWindow").innerHTML = ""
   messages.forEach((bericht)=>{

        message = document.createElement("div");
        if(Object.keys(bericht)[0] === localStorage.getItem("username")){
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

if(!focused){notify(messages[messages.length-1])}

cleanChat(data.val())

}



function sendMessage(message) {
    var d = new Date
   var timeString = d.getHours()
   var min = d.getMinutes()
    if (d.getMinutes()<10){
         min = "0"+min  
    }
    timeString = timeString + ":" + min
    database.ref("messages/").push(JSON.parse('{"'+yourname+'":"'+message+'", "timestamp":"'+  timeString +'"}'));
}
function sendFromPage(e){
    e.preventDefault();
    if(nameSet){
    message = document.getElementById("mess").value;
    document.getElementById("mess").value = "";
    sendMessage(message)}
    else{
        alert("please choose a name")
    }
}

function changeNameFromPage(e){
    e.preventDefault();
    const name = document.getElementById("changeName").value;
    localStorage.setItem("username", name);
    changeName(name);
    document.getElementById("nameForm").remove();
    nameSet = true;

}
$(document).ready(function () {
    document.getElementById("send").addEventListener("click", sendFromPage);
    document.getElementById("changeNameButton").addEventListener("click", changeNameFromPage);

    const name = localStorage.getItem("username");
    if(name !== null){
        changeName(name);
        nameSet = true;
        $("#nameForm").remove();
    }


    database.ref("messages/").on("value", getMessage);
});


function updateScroll(){
    var element = document.getElementById("chatWindow");
    element.scrollTop = element.scrollHeight;

}

window.onfocus = function(){

focused = true
window.document.title = original

}
window.onblur = function(){
    original = window.document.title
    focused = false

}