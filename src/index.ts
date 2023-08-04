import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { Server } from "socket.io";
import http from "http";
import authRouter from "./routers/auth";

const PORT = process.env.PORT;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: { origin: "*" },
});

io.on("connection", (socket) => {
	console.log(socket.id);
	socket.on("join-a-room", (id, message) => {
		socket.join(id);
	});
	socket.on("user-message", (roomId, message) => {
		console.log(roomId);
		console.log(message);
		io.to(roomId).emit("broadcast-message", roomId, message);
	});
});

app.use("/auth", authRouter);

app.listen(PORT, () => {
	console.log(`Listening on ${PORT}`);
});

server.listen(9000, () => {
	console.log("socket Listening");
});
