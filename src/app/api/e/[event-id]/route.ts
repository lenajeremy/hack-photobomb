import { NextRequest, NextResponse } from "next/server";
import { pinata } from "@/lib/pinata";

export async function POST(request: NextRequest) {
    const form = await request.formData()
    const files = Array.from(form.values())

    if (files.length > 50) {
        return NextResponse.json({ error: "limit of 50 images per request" }, { status: 400 })
    } else {
        const res = await Promise.allSettled(files.filter(f => typeof f !== 'string').map(f => pinata.upload.file(f)))
        console.log(res)
    }
    
    return NextResponse.json({ imagesCount: Array.from(files.entries()).length, images: Array.from(files.values()) }, { status: 200 })
}