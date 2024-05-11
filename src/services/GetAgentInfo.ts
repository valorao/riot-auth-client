import axios from 'axios';

export default class GetAgentInfo {
    handle = async (agentId: string) => {
        try {
            const url = `https://valorant-api.com/v1/agents/${agentId}`
            const response  = await axios.get(url)
            if (!response || !response.data || response.status !== 200) {
                throw response.data;
            }
            const agentUuid = agentId;
            const agentName = response.data.data.displayName;
            const displayIcon = response.data.data.displayIcon;
            const agentBackground = response.data.data.background;
            const agentColors = response.data.data.backgroundGradientColors;
            const agentRoleUuid = response.data.data.role.uuid;
            let fullPortrait;
            if (response.data.fullPortraitV2) {
                fullPortrait = response.data.data.fullPortraitV2;
            }
            else {
                fullPortrait = response.data.data.fullPortrait;
            }
            let agentname
            if (agentName === 'Harbor') {
                agentname = 'Luiz';
            }
            else {
                agentname = agentName;
            }
    
            return {
                agentUuid: agentUuid,
                agentName: agentname,
                displayIcon: displayIcon,
                agentBackground: agentBackground,
                agentRoleUuid: agentRoleUuid,
                agentColors: agentColors,
            };
        }
        catch (error) {
            console.log(error)
            return {status: 500, message: 'Internal Server Error',};
        }
    }
}
