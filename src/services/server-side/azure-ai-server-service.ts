import axios from "axios";

const speechKey = process.env.AZURE_SPEECH_SUBSCRIPTION_KEY;
const speechRegion = process.env.AZURE_SPEECH_REGION;

export class AzureAIServerService {
    async getAuthSession() {
        const headers = {
            headers: {
                'Ocp-Apim-Subscription-Key': speechKey,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        try {
            const tokenResponse = await axios.post(`https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`, null, headers);
            return { token: tokenResponse.data, region: speechRegion };
        } catch (err) {
            console.error("Error while retrieving azure token", err)
            throw new Error("Error while retrieving azure token");
        }
    }

}