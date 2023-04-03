const PROD_BACKEND_API_URL = "https://museumapi.azurewebsites.net/api"; // production
const DEV_BACKEND_API_URL = "http://localhost:5133/api";                 // development

export const BACKEND_API_URL =
	process.env.NODE_ENV === "development" ? DEV_BACKEND_API_URL : PROD_BACKEND_API_URL;