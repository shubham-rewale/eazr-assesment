import axios from "axios";

// eslint-disable-next-line import/extensions
import userModel from "../models/userModel.js";

const millisecondsInAnYear = 31536000000;

// eslint-disable-next-line consistent-return
const signUp = async (req, res) => {
	try {
		const { name, phNumber, dateOfBirth, password, passwordConfirm } = req.body;
		if (!name || !phNumber || !password || !passwordConfirm) {
			return res.status(400).json({
				status: "Fail",
				message: "Please provide valid data",
			});
		}
		if (!dateOfBirth.year || !dateOfBirth.month || !dateOfBirth.day) {
			return res.status(400).json({
				status: "Fail",
				message: "Please provide valid data",
			});
		}
		const { year, day } = dateOfBirth;
		let { month } = dateOfBirth;
		month -= 1;
		const birthDate = new Date(Date.UTC(year, month, day));
		const response = await axios.get(process.env.IMAGE_API);
		const profilePicture = response.data.message;
		const newUser = await userModel.create({
			name,
			phNumber,
			profilePicture,
			birthDate,
			password,
			passwordConfirm,
		});
		res.status(200).json({
			status: "Success",
			message: "SignUp Was Successful",
			user: {
				name: newUser.name,
				phNumber: newUser.phNumber,
				profilePicture: newUser.profilePicture,
			},
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			status: "Fail",
			err,
		});
	}
};

// eslint-disable-next-line consistent-return
const login = async (req, res) => {
	try {
		const { phNumber, password } = req.body;
		if (!phNumber || !password) {
			return res.status(400).json({
				status: "Fail",
				message: "Please provide valid Credentials",
			});
		}
		const User = await userModel.findOne({ phNumber }).select("+password");
		if (!User || !(await User.checkPassword(password, User.password))) {
			return res.status(400).json({
				status: "Fail",
				message: "Please check the credentials",
			});
		}
		const currentDate = new Date();
		const age = Math.floor((currentDate - User.birthDate) / millisecondsInAnYear);
		res.status(200).json({
			status: "Success",
			profilePicture: User.profilePicture,
			name: User.name,
			age,
		});
	} catch (err) {
		console.log(err);
		res.status(400).json({
			status: "Fail",
			err,
		});
	}
};

export { signUp, login };
