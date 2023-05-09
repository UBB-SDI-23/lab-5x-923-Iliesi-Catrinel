const PROD_BACKEND_API_URL = "https://museumapi.azurewebsites.net/api";  // production
const DEV_BACKEND_API_URL = "http://localhost:5133/api";                 // development

export const BACKEND_API_URL =
	process.env.NODE_ENV === "development" ? DEV_BACKEND_API_URL : PROD_BACKEND_API_URL;

export function formatDate(date: Date | string | undefined) {
	return date === null || date === undefined	? "N/A"
		: new Date(date).toLocaleString()
}

export const getEnumValues = (e: any) => {
	return Object.keys(e)
	  .filter((key) => isNaN(Number(key)))
	  .map((key) => e[key]);
  };
