import axios from "axios";


function handleErr(err : string) {
    return new Response(
        JSON.stringify({
            body : err,
            status : 500
        })

    );
}

export async function get_notion_access_token(code : string) {

    const redirect_uri = "http://localhost:3000"

    try {

        const resp = axios.post(
            "https://api.notion.com/v1/oauth/token",
            {
                grant_type : "authorization_code",
                code : code,
                redirect_uri : redirect_uri,
            },
            {
                headers : {
                    "Authorization" : `Basic ${process.env.NOTION_CLIENT_SECRET_B64}`,
                    "Content-Type" : "application/json",
                    "Notion-Version" : "2022-09-03"
                }
            }

        );

        console.log(resp);
        console.log(JSON.stringify(resp));

        return 200;

    } catch (err : any) {
        return handleErr(err.toString() || "An error occurred.");
    }

}