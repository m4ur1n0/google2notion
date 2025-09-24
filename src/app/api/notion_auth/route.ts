import { get_notion_access_token } from "@/notion/auth";
import { NextRequest } from "next/server";



export function handleErr(err : string) {
    return new Response(
        JSON.stringify({
            error : err,
        }),
        {
            status : 500,
            headers : {
                "Content-Type" : "application/json"
            }
        }

    );
}

export async function POST(req : NextRequest) {
    // posting a code to get an access token

    try {

        const body = await req.json();
        const {code} = body; // assuming code is the only thing passed

        const notion_auth = await get_notion_access_token(code);

        if (notion_auth[0] === 500) { // guard failure
            return handleErr(notion_auth[1])
        }


        // i'm about 60% sure application/json is accurate here, but i'm 80% sure it doesn't matter
        return new Response(
            JSON.stringify({
                data : notion_auth[1]
            }),
            {
                status : 200,
                headers : {
                    "Content-Type" : "application/json"
                }
            }
        )



    } catch (err : any) {
        return handleErr(err.toString() || "An error occurred.");
    }
}