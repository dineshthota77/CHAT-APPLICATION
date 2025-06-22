const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const users = new Map();

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
    socket.on("user_joined", (username) => {
        users.set(socket.id, username);
        socket.broadcast.emit("system_message", `${username} joined the chat.`);
    });

    socket.on("chat_message", ({ message }) => {
        const name = users.get(socket.id);
        socket.broadcast.emit("chat_message", { username: name, message });
    });

    socket.on("disconnect", () => {
        const name = users.get(socket.id);
        if (name) {
            io.emit("system_message", `${name} left the chat.`);
            users.delete(socket.id);
        }
    });
});

server.listen(3000, () => {
    console.log("✅ Chat server running on http://localhost:3000");
});