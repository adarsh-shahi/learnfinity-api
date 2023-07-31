import express from "express";
import dotenv from "dotenv";
dotenv.config();

import authRouter from "./routers/auth";

const PORT = process.env.PORT;

const app = express();

app.use("/auth", authRouter);

app.listen(PORT, () => {
	console.log(`Listening on ${PORT}`);
});
