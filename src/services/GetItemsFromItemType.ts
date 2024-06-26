import axios from 'axios';

export async function GetItemsFromItemTypeId(itemTypeId: string, itemId: string, language?: string) {
    if (!language) language = 'pt-BR';
    let response;
    // Gunbuddy
    if (itemTypeId === 'dd3bf334-87f3-40bd-b043-682a57a8dc3a') {
        response = await axios.get(`https://valorant-api.com/v1/buddies/levels/${itemId}?language=${language}`);
    }
    // Weapon Skin
    if (itemTypeId === 'bcef87d6-209b-46c6-8b19-fbe40bd95abc') {
        response = await axios.get(`https://valorant-api.com/v1/weapons/skins/${itemId}?language=${language}`);
    }
    // Weapon Skin chroma
    if (itemTypeId === '3ad1b2b2-acdb-4524-852f-954a76ddae0a') {
        response = await axios.get(`https://valorant-api.com/v1/weapons/skinchromas/${itemId}?language=${language}`);
    }
    // Weapon Skin Level
    if (itemTypeId === 'e7c63390-eda7-46e0-bb7a-a6abdacd2433') {
        response = await axios.get(`https://valorant-api.com/v1/weapons/skinlevels/${itemId}?language=${language}`);
    }
    // Player Cards
    if (itemTypeId === '3f296c07-64c3-494c-923b-fe692a4fa1bd') {
        response = await axios.get(`https://valorant-api.com/v1/playercards/${itemId}?language=${language}`);
    }
    // Sprays
    if (itemTypeId === 'd5f120f8-ff8c-4aac-92ea-f2b5acbe9475') {
        response = await axios.get(`https://valorant-api.com/v1/sprays/${itemId}?language=${language}`);
    }
    // Player Titles
    if (itemTypeId === 'de7caa6b-adf7-4588-bbd1-143831e786c6') {
        response = await axios.get(`https://valorant-api.com/v1/playertitles/${itemId}?language${language}`);
    }
    console.log(response?.data);
    return response?.data.data;
}
