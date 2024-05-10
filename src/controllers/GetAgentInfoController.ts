import { Request, Response } from 'express';
import GetAgentInfo from '../services/GetAgentInfo';
const getAgentInfo = new GetAgentInfo();

export const AgentInfo = async (req: Request, res: Response) => {
    const agentId = req.params.agentId;
    console.log(agentId)
    if(!req.params.agentId) {
        return res.status(400).json({
            "status": 400,
            "error": "Bad Request",
            "message": "missing header parameters"
        });
    }
    const response = await getAgentInfo.handle(agentId);
    if(response.status === 400) {
        return res.status(401).json({
            "status": 401,
            "message": "Please relogin or reauth cookies."
        })
    }
    res.status(200).json(response)
}
