// Imports from the libraries
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { generateJWTToken } = require("../config/jwtAuth");

// Function for the registring the user
const registerUser = async (req, res) => {
	// Defining all necessary fields for the user registration
	let { firstName, lastName, email, password, country } = req.body;

	// Double checking if the user already exists or not, usually it's done by checking email
	const existingUser = await User.findOne({ email: email });

	if (existingUser) {
		return res.status(400).json({ message: `User with the followung email already exists: ${email}` });
	}

	// We can't store the password in it's original form, that's why we are using bcrypt package here
	// it's making simple hashing solution for the password
	password = bcrypt.hashSync(password, 8);

	// Creating new user model based on Mongoose User model and saving it to the MongoDB
	const userData = new User({
		firstName,
		lastName,
		email,
		password,
		country
	});
	const user = await userData.save();

	// Now we are generating a token for the user, since he's redirected to the 
	const jwt = generateJWTToken(user._id);

	res.status(200).json({
		token: jwt,
		message: "You are successfuly registered!",
	});
};

// Function for the sign in logic for the existing users
const loginUser = async (req, res) => {
	// Receiving from the body required fields - email and password
	let { email, password } = req.body;

	// Searching for the user with provided email in MongoDB
	let user = await User.findOne({ email: email });

	// If there is no such user, we will return an message that's the user is not found
	if (!user) {
		return res.status(404).json({ message: `User with provided credentials is not found` });
	}

	// Checking validity of the password by comparing them using bcrypt package
	const isValidPassword = bcrypt.compareSync(password, user.password);

	if (!isValidPassword) {
		return res.status(401).json({ message: "Invalid password. Try again!" });
	}
	// Defining user.password as null, since we don't want to return it throw HTTP response
	user.password = null;

	// Finally generating the jwt token for the user and giving him back the token
	const jwt = generateJWTToken(user._id);


	res.status(200).json({
		token: jwt,
		message: "You are successfuly logged in!",
		data: user,
	});
};

module.exports = { registerUser, loginUser };
