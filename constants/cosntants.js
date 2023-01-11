const HOST = "localhost";
const PORT = 8000;
const DB_PORT = 27017;
const DB_NAME = "quizup";
const DB_USERNAME = "quizup-user";
const DB_PASS = "quizup-pwd";
const UPLOAD_FILES_DIR = "./uploads/";
const UPLOAD_FILES_BASE_URL = `http://${HOST}:${PORT}/uploads/`;

const DB_CONN_STRING = `mongodb://${DB_USERNAME}:${DB_PASS}@${HOST}:${DB_PORT}/${DB_NAME}`;
const DB_LOCAL_CONN_STRING = `mongodb://${HOST}:${DB_PORT}/${DB_NAME}`;
const DB_MONGO_DB = 'mongodb+srv://demo-app:pVpTwAZYPUHmUWvI@demoapps.n6vswdd.mongodb.net/?retryWrites=true&w=majority';


//Socket Settings
const ALLOWED_DOMAINS = "*";

module.exports = {
  DB_CONN_STRING,
  DB_LOCAL_CONN_STRING,
  UPLOAD_FILES_DIR,
  PORT,
  UPLOAD_FILES_BASE_URL,
  ALLOWED_DOMAINS,
  DB_MONGO_DB
};
