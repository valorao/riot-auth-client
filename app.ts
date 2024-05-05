import { GetCookies } from "./middlewares";


const getCookies = new GetCookies();

// Call the method
getCookies.postAuthCookies('85.0.1.1382.3124').then(response => {
    console.log(response);
}).catch(error => {
    console.error(error);
});