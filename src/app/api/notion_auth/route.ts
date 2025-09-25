import { encrypt } from "@/lib/enc";
import { get_notion_access_token } from "@/notion/auth";
import { kv } from "@vercel/kv";
import { NextRequest } from "next/server";



export function handleErr(err : string) {
    console.error(err);
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
        } // else we succeeded

        // dissect the response
        const notion_data = notion_auth[1];
        // gonna be hardcoding token_type as 'bearer' anyway
        const {access_token, refresh_token, workspace_name, workspace_icon, workspace_id, owner } = notion_data;

        // do something devilishly clever with the refresh token
        const accessKey = `notion_access:${workspace_id}`;
        const refreshKey = `notion_refresh:${workspace_id}`;

        const encdRefresh = encrypt(refresh_token);
        // let accessSetP = fetch("/api/redis", {
        //     method : "POST",
        //     body : JSON.stringify({
        //         key : accessKey,
        //         val : access_token,
        //         ttl : 3600
        //     })
        // });
        // let refreshSetP = fetch("/api/redis", {
        //     method : "POST",
        //     body : JSON.stringify({
        //         key : refreshKey,
        //         val : encdRefresh
        //     })
        // });
        // no need to http. just set the key

        // let accessSetP = kv.set(accessKey, access_token, {ex : 3600}); // expire after 1 hour
        // let refreshSetP = kv.set(refreshKey, encdRefresh);

        // let [aSet, rSet] = await Promise.all([accessSetP, refreshSetP]);
        // if (aSet !== "OK" || rSet !== "OK") {
        //     console.warn("Access key or refresh key were unable to be stored. User will have to login again on next visit.")
        // }

        // fuck it. saving code above but since we plan to get keys from redis, this session won't work if they can't be stored. may as well let it err on failure
        try {
            await Promise.all([
                kv.set(accessKey, access_token, {ex : 3600}),
                kv.set(refreshKey, encdRefresh)
            ]);
        } catch (e : any) {
            throw new Error("The auth failed because the access and refresh tokens could not be stored properly.");
        }
        

        // i'm about 60% sure application/json is accurate here, but i'm 80% sure it doesn't matter
        return new Response(
            JSON.stringify({
                access_token,
                workspace : {
                    workspace_name,
                    workspace_icon,
                    workspace_id
                },
                owner
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