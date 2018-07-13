const APP_ID = "d93ca6ab";
const APP_KEY = "25ec525dac1aa1a66f16bd8edf551ea0"; 

const JWT_SECRET = "Azkrul";
const JWT_EXPIRY = '7d';

const TEST_DATABASE_URL = "mongodb://server:Joedanger02@ds133621.mlab.com:33621/test-flowstate"
const DATABASE_URL = "mongodb://server:Joedanger02@ds127771.mlab.com:27771/flow-state";
const PORT = process.env.PORT || 3000;

module.exports = {
	APP_ID, APP_KEY, 
	PORT, JWT_SECRET, 
	JWT_EXPIRY, DATABASE_URL,
	TEST_DATABASE_URL, 
};