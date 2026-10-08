import axios from "axios";

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

const api = axios.create({
  baseURL: configuredApiUrl || (import.meta.env.DEV ? "http://localhost:8000" : ""),
});


/* ADD JWT TOKEN AUTOMATICALLY */

api.interceptors.request.use(

(config)=>{

if (import.meta.env.PROD && !configuredApiUrl) {
  return Promise.reject(
    new Error("VITE_API_URL must be set to the deployed backend URL.")
  );
}

const token=

localStorage.getItem(

"token"

);

if(token){

config.headers.Authorization=

`Bearer ${token}`;

}

return config;

},

(error)=>{

return Promise.reject(

error

);

}

);


/* HANDLE TOKEN EXPIRY */

api.interceptors.response.use(

(response)=>response,

(error)=>{

if(

error.response &&

error.response.status===401

){

localStorage.removeItem(

"token"

);

localStorage.removeItem("user");

window.location.href=

"/login";

}

return Promise.reject(

error

);

}

);

export default api;
