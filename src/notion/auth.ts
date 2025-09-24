import axios from "axios";



export async function get_notion_access_token(code : string) {

    const redirect_uri = "http://localhost:3000/auth/notion/callback"
    const auth = Buffer.from(`${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_CLIENT_SECRET}`).toString('base64');

    try {

        const resp = await axios.post(
            "https://api.notion.com/v1/oauth/token",
            {
                grant_type : "authorization_code",
                code : code,
                redirect_uri : redirect_uri,
            },
            {
                headers : {
                    "Authorization" : `Basic ${auth}`,
                    "Content-Type" : "application/json",
                    "Notion-Version" : "2022-09-03"
                }
            }

        );

        console.log(JSON.stringify(resp.data));

        if (resp.status !== 200) {
            return [500, `Notion authentication failed with error : [ ${resp.status} : ${resp.statusText} ]`];
        }

        return [200, resp.data];

    } catch (err : any) {
        return [500, err.toString() || "An error occurred."]
    }

}