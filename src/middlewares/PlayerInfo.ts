import axios from 'axios';

export class GetPlayerInfo {
    PlayerInfo = async (token: string) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
    
        let response  = await axios.get('https://auth.riotgames.com/userinfo', config).then(res => {
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
