import express from "express";
import hpp from "hpp";

// eslint-disable-next-line import/extensions
import userRouter from "./routes/userRoutes.js";

const app = express();

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(hpp({ whitelist: [] }));

app.use("/api/v1/user", userRouter);

app.use("*", (req, res) => {
	res.status(400).json({
		status: "Failed",
		message: "Did Not Find Any Matching Route",
	});
});

export default app;
