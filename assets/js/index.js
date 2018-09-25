
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
var yourname = "Matthias"

function changeName (name){
    yourname = name
}

function getMessage(data) {
    var messages = data.val();
    console.log(Object.values(messages));
    document.getElementById("chatWindow").innerHTML = ""
    Object.values(messages).forEach((bericht)=>{

        message = document.createElement("div")
        var name = document.createElement("span")
        var text = document.createElement("span")
        name.innerText = Object.keys(bericht)[0];
        text.innerText = Object.values(bericht)[0];
        name.setAttribute("id", "name")
        text.setAttribute("id", "message")
        message.appendChild(name);
        message.appendChild(text);
        document.getElementById("chatWindow").appendChild(message)
    })


}

function sendMessage(message) {
    database.ref("messages/").push(JSON.parse('{"'+yourname+'":"'+message+'"}'));
}
function sendFromPage(e){
    e.preventDefault();
    message = document.getElementById("mess").value;
    document.getElementById("mess").value = "";
    sendMessage(message)
}

function changeNameFromPage(e){
    e.preventDefault()

    changeName(document.getElementById("changeName").value)
    document.getElementById("changeName").value = ""
}
document.getElementById("send").addEventListener("click", sendFromPage);
document.getElementById("changeNameButton").addEventListener("click", changeNameFromPage)


database.ref("messages/").on("value", getMessage)
