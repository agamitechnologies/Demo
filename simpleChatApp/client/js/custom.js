const SOCKET_BASE_PATH = 'http://localhost:3090/'

let loginForm = document.getElementById('loginForm');
let loggedIn = false;

let username = document.getElementById('username');
let loginButton = document.getElementById('setNameBtn');
loginButton.onclick = login

let disconnectBtn = document.getElementById('disconnectBtn');
disconnectBtn.onclick = logout

let charArea = document.getElementById('charArea');

let msgBox = document.getElementById('msgBox')
msgBox.onkeydown = (keyObj)=>{
    if (keyObj.key=="Enter"){
        msgBox.blur();
        sendBtn.click()
    }
}
let sendBtn = document.getElementById('sendBtn')
sendBtn.onclick = sendMsg

function login(){
    if (!username.value || loggedIn) return;

    loggedIn = true;
    loginForm.setAttribute('hidden', true)
    disconnectBtn.removeAttribute('hidden')
    charArea.removeAttribute('hidden')
    msgBox.removeAttribute('hidden')
    sendBtn.removeAttribute('hidden')
    createConnection()

}

function logout(){
    if (loggedIn){
        loginForm.removeAttribute('hidden');
        charArea.setAttribute('hidden', true)
        charArea.innerHTML=""
        disconnectBtn.setAttribute('hidden', true)
        msgBox.setAttribute('hidden', true)
        sendBtn.setAttribute('hidden', true)
        loggedIn = false
        destroyConnection()
    }
}

async function createConnection(){
    socket = io( SOCKET_BASE_PATH, { query: { name: "QuErY" } } )
    socket.on( 'get-message', async (msgData)=>{
        await appendMsg(msgData)
    })
}

function destroyConnection(){
    socket.disconnect()
}

function sendMsg(){
    if (!msgBox.value) return
    let msgData = {
        socketId: socket.id,
        username: username.value,
        message: msgBox.value
    }
    socket.emit( 'send-message', msgData )
    msgBox.value = ''
}

async function appendMsg(msgData){
    let newMsgElement = document.createElement('p')
    let nameElement = document.createElement('b')
    nameElement.innerHTML = msgData.username + " : "
    let messageElement = document.createElement('span')
    messageElement.innerHTML = msgData.message
    newMsgElement.appendChild(nameElement)
    newMsgElement.appendChild(messageElement)
    charArea.appendChild(newMsgElement)

}