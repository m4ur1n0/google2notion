"use client"

import { Button } from "@/components/ui/button";

export default function Home() {

    // const code = await params;

    const notion_auth = process.env.NOTION_AUTH_URL;

    if (!notion_auth) return null;



    return (
        <main className="flex flex-row justify-center items-center w-full h-full">
            <Button variant="outline" asChild>
                <a className="" href={notion_auth} target="_blank">
                    N  Notion
                </a>
            </Button>
        </main>
    );
}
