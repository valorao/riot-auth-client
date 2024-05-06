import axios from 'axios';

export class GetClientVersion {
    ClientVersion = async () => {

    let response  = await axios.get('https://valorant-api.com/v1/version').then(res => {
        return res
    }).catch(err => {
        return err.response
    });
    return response;
    }
}
