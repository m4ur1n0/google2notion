"use client"

import React, { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { get_notion_access_token } from '@/notion/auth'

type Props = {}

const page = () => {

    const searchParams = useSearchParams();
    const code = searchParams.get("code");
    const router = useRouter();


    useEffect(() => {

        const postCode = async (code : string) => {
            const resp = await fetch("/api/notion_auth", {
                method : "POST",
                headers : {"Content-Type" : "application/json"},
                body : JSON.stringify({code})
            });
        
            if (resp.status===200) {
                // do something to store the data
                const data = await resp.json();
                console.log(JSON.stringify(data));

                //then
                router.push("/");
            } else {
                console.log("failure");
            }
        }

        if (code) {
            postCode(code);
        }
    }, [code])


  return (
    <div>Authorizing...</div>
  )
}

export default page