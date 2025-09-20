"use client"

import React from 'react'
import { useSearchParams } from 'next/navigation'
import { get_notion_access_token } from '@/notion/auth'

type Props = {}

const page = () => {

    const searchParams = useSearchParams();
    const code = searchParams.get("code");


    if (code) {
        get_notion_access_token(code);
    }


  return (
    <div>Authorizing...</div>
  )
}

export default page