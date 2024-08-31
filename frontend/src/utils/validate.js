export const validateSignInCredentials = (email, password) => {
	// Validates email and password formats, returns specific messages if invalid
	const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
	const passwordRegex =
		/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9\s]).{8,}$/;

	if (!emailRegex.test(email)) return "Invalid email format";
	if (!passwordRegex.test(password)) return "Invalid password format";

	return null;
};

export const validateSignUpForm = (firstName, lastName, email, password) => {
	const nameRegex = /\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+/;
	const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

	if (!nameRegex.test(firstName)) return "Invalid first name format";
	if (!nameRegex.test(lastName)) return "Invalid last name format";
	if (!emailRegex.test(email)) return "Invalid email format";

	if (password.length < 8) return "Password must be at least 8 characters";
	if (!/[a-z]/.test(password)) return "Password needs at least one lowercase letter";
	if (!/[A-Z]/.test(password)) return "Password needs at least one uppercase letter";
	if (!/\d/.test(password)) return "Password needs at least one number";
	if (!/[^a-zA-Z0-9\s]/.test(password)) return "Password needs at least one special character";

	return null;
};
