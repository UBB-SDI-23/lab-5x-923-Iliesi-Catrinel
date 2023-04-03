export const BACKEND_URL = "https://museumapi.azurewebsites.net/api"; // production
export const BASE_URL = "https://localhost:7210/api";                 // development

export const BACKEND_API_URL =
	process.env.NODE_ENV === "development" ? BASE_URL : BACKEND_URL;