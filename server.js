import mongoose from "mongoose";
import dotenv from "dotenv";

// eslint-disable-next-line import/extensions
import app from "./app.js";

process.on("uncaughtException", (err) => {
	console.log("UNCAUGHT EXCEPTION! Shutting down...");
	console.log(err.name, err.message);
	// eslint-disable-next-line no-process-exit
	process.exit(1);
});

dotenv.config();

mongoose
	.connect(process.env.LOCAL_DB)
	// eslint-disable-next-line no-unused-vars
	.then((con) => {
		console.log("DB Connection Successful");
	})
	.catch((err) => {
		console.log(`DB Connection Failed With Error ${err}`);
	});

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
	console.log(`Server is Listening on port ${port}`);
});

process.on("unhandledRejection", (err) => {
	console.log("UNHANDLED REJECTION! Shutting down...");
	console.log(err.name, err.message);
	server.close(() => {
		// eslint-disable-next-line no-process-exit
		process.exit(1);
	});
});
