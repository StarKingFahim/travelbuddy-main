//  Importing JWT as a secret key generating library, that is used as our auth solution
const jwt = require("jsonwebtoken");

// Defining JWT secret from .env file
const JWT_SECRET = process.env.JWT_SECRET;

// Function for generating token for the user, based on his id and configuration for expiring
const generateJWTToken = (userId) => {
	const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "24h" });

	return token;
};

// Getting back user ID
const getIdFromToken = (token) => {
	// Verifying that the token is correct according to JWT_SECRET key
	const decodedToken = jwt.verify(token, JWT_SECRET);

	// Getting user id from decoded token
	return decodedToken.userId;
};

module.exports = {
	generateJWTToken,
	getIdFromToken,
};
