import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Name Can Not Be Null"],
	},
	phNumber: {
		type: String,
		required: [true, "Phone Number Can Not Be Null"],
		unique: true,
		validate: [validator.isMobilePhone, "Please provide a valid Phone Number"],
	},
	profilePicture: {
		type: String,
		required: [true, "Profile Picture is required"],
	},
	birthDate: {
		type: Date,
		required: [true, "Date of Birth is mandatory"],
		validate: [validator.isDate, "Please provide a valid Date"],
	},
	password: {
		type: String,
		required: [true, "Password can not be null"],
		minlength: 8,
		select: false,
	},
	passwordConfirm: {
		type: String,
		required: [true, "Please confirm your password"],
		validate: {
			// eslint-disable-next-line func-names, object-shorthand
			validator: function (el) {
				return el === this.password;
			},
			message: "Confirmed Password did not match",
		},
	},
});

userSchema.pre("save", async function (next) {
	this.password = await bcrypt.hash(this.password, 12);
	this.passwordConfirm = undefined;
	next();
});

userSchema.methods.checkPassword = async function (inputPassword, storedPassword) {
	// eslint-disable-next-line no-return-await
	return await bcrypt.compare(inputPassword, storedPassword);
};

const userModel = mongoose.model("userModel", userSchema);

export default userModel;
