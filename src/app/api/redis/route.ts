import { kv } from "@vercel/kv";
import { NextRequest } from "next/server";
import { handleErr } from "../notion_auth/route";

// post to kv
export async function POST(req : NextRequest) {
    try {

        // request body NEEDS KEY, VAL, wants ttl
        const {key, val, ttl} = await req.json();

        let resp;
        if (ttl) {
            resp = await kv.set(key, val, {ex : ttl}); // expire in 1 hour
        } else {
            resp = await kv.set(key, val);
        }

        if (resp !== "OK") {
            throw new Error("Redis store failed. Likely hit 10k request/day limit.");
        }

        return new Response(
            JSON.stringify({
                body : "OK"
            }),
            {
                status : 200,
                headers : {
                    "Content-Type" : "application/json"
                }
            }
        )

    } catch (e : any) {

        console.error(e.toString() || "Error encountered in Redis KV store operation.")
        return handleErr(e || "Error encountered in Redis KV store operation.");

    }
}

export async function GET(req : NextRequest) {
    try {

        // no req body, use searchparams
        const {searchParams} = new URL(req.url);
        const key = searchParams.get("key");
        if (!key) throw new Error("GET request made to KV API without a key parameter.");

        const resp = await kv.get(key); // either returns null or the value

        if (resp) {
            return new Response(
                JSON.stringify({
                    body : resp
                }),
                {
                    status : 200,
                    headers : {
                        "Content-Type" : "application/json"
                    }
                }
            );
        }

        // otherwise we got the null
        throw new Error("KV get returned null.");

    } catch (e : any) {
        console.error(e.toString() || "Error encountered in Redis KV get operation.");
        return handleErr(e || "Error encountered in Redis KV get operation.");
    }
}