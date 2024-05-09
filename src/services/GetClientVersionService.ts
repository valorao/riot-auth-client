import axios from 'axios';

export default class GetClientVersion {
    ClientVersion = async () => {
        try {
            let response  = await axios.get('https://valorant-api.com/v1/version').then(res => {
                return res
            }).catch(err => {
                return err.response
            });
            return response;
        }
        catch (error) {
            return {status: 500, message: 'Internal Server Error',};
        }
    }
}
