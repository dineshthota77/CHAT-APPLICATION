const socket = io();

const joinSection = document.getElementById("joinSection");
const chatSection = document.getElementById("chatSection");
const joinBtn = document.getElementById("joinBtn");
const sendBtn = document.getElementById("sendBtn");
const usernameInput = document.getElementById("usernameInput");
const messageInput = document.getElementById("messageInput");
const messages = document.getElementById("messages");

let username = "";

joinBtn.addEventListener("click", () => {
    username = usernameInput.value.trim();
    if (username) {
        socket.emit("user_joined", username);
        joinSection.style.display = "none";
        chatSection.style.display = "block";
    }
});

sendBtn.addEventListener("click", () => {
    const msg = messageInput.value.trim();
    if (msg) {
        appendMessage("You", msg);
        socket.emit("chat_message", { message: msg });
        messageInput.value = "";
    }
});

function appendMessage(sender, msg) {
    const div = document.createElement("div");
    div.textContent = `${sender}: ${msg}`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

socket.on("chat_message", ({ username, message }) => {
    appendMessage(username, message);
});

socket.on("system_message", (msg) => {
    const div = document.createElement("div");
    div.textContent = msg;
    div.style.fontStyle = "italic";
    div.style.textAlign = "center";
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
});