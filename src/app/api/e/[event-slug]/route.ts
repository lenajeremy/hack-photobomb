import { NextRequest, NextResponse } from "next/server";
import { pinata } from "@/lib/pinata";
import { respondError, respondSuccess } from "@/lib/utils";
import prisma from "@/lib/db";
import { auth } from "@/auth";


export async function POST(request: NextRequest, { params }: { params: { "event-slug": string } }) {
    const session = await auth()

    if (!session || !session.user) {
        return respondError(new Error("User not authenticated"), "Failed to authenticate user", 401)
    }

    const form = await request.formData()
    const files = Array.from(form.values())
    const eventSlug = params["event-slug"]


    try {
        const event = await prisma.event.findUnique({ where: { slug: eventSlug } })

        if (!event) {
            return respondError(new Error("Event not found"), undefined, 404)
        }

        if (files.length > 50) {
            return NextResponse.json({ error: "limit of 50 images per request" }, { status: 400 })
        }

        const res = await Promise.allSettled(files.filter(f => typeof f !== 'string').map(f => pinata.upload.file(f)))
        const successfulUploads = res.filter(r => r.status === "fulfilled")

        const uploadsWithPublicURL = await Promise.all(successfulUploads.map(async r => {
            const publicURL = await pinata.gateways.createSignedURL({ cid: r.value.cid, expires: 60 * 60 * 24 * 365 })
            return { ...r.value, publicURL }
        }))

        const dbUpload = await prisma.upload.create({
            data: {
                text: `${session.user.name} uploaded ${files.length} images for ${event?.name}`,
                files: {
                    createMany: {
                        data: uploadsWithPublicURL.map(file => {
                            return {
                                ownerId: session.user?.id ?? "",
                                eventId: event?.id ?? "",
                                cid: file.cid,
                                publicURL: file.publicURL,
                            }
                        })
                    }
                }
            }
        })

        return respondSuccess(dbUpload, "Uploaded successfully", 201)
    } catch (error) {
        return respondError(error instanceof Error ? error : new Error(String(error)), "Failed to get user events", 500);
    }



}

export async function GET() {
    return respondSuccess({ uploads: [], total: 0 }, "Retrieved uploads", 200)
}