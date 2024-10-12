import { NextRequest, NextResponse } from "next/server";
import { pinata } from "@/lib/pinata";
import { respondSuccess } from "@/lib/utils";

export async function POST(request: NextRequest, { params }: { params: { "event-slug": string } }) {
    const form = await request.formData()
    const files = Array.from(form.values())
    console.log(params['event-slug'])

    if (files.length > 50) {
        return NextResponse.json({ error: "limit of 50 images per request" }, { status: 400 })
    } else {
        const res = await Promise.allSettled(files.filter(f => typeof f !== 'string').map(f => pinata.upload.file(f)))
        
    }

    return NextResponse.json({ imagesCount: Array.from(files.entries()).length, images: Array.from(files.values()) }, { status: 201 })
}

export async function GET(request: NextRequest) {
    return respondSuccess({ uploads: [], total: 0 }, "Retrieved uploads", 200)
}