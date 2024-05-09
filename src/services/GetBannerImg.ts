import axios from 'axios';

export default class GetBannerImg {
    handle = async (bannerid: string) => {
        const url = `https://valorant-api.com/v1/playercards/${bannerid}?language=en-US`
        const getbannerimg  = await axios.get(url)
        if (!getbannerimg || !getbannerimg.data || getbannerimg.status !== 200) {
            throw getbannerimg.data;
        }
        const bannerwideimg = getbannerimg.data.data.wideArt;

        return {
            bannerimg: bannerwideimg,
        };
    }
}
