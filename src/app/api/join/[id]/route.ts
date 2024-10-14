import { auth } from "@/auth";
import prisma from "@/lib/db";
import { respondError, respondSuccess } from "@/lib/utils";
import { NextRequest } from "next/server";

export async function POST(_: NextRequest, { params }: { params: { id: string } }) {
    const session = await auth()
    const eventSlug = params.id

    if (session === null) {
        return respondError(new Error("User not authenticated"), undefined, 401)
    }

    const event = await prisma.event.findUnique({
        where: {
            slug: eventSlug
        }
    })

    if (!event) {
        return respondError(new Error("Event not found"), undefined, 404)
    }

    try {
        const shareLink = await prisma.shareLink.create({
            data: {
                eventId: event.id,
            }
        })

        return respondSuccess(shareLink, "Link created", 201)
    } catch (error) {
        return respondError(error instanceof Error ? error : new Error(String(error)), "Failed to create share link", 500);
    }
}


export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await auth()
    const linkId = params.id

    if (!session || !session.user) {
        return respondError(new Error("Unauthorized"), "Unauthorized", 401)
    }

    try {
        const shareLink = await prisma.shareLink.findUnique({
            where: {
                link: linkId
            }
        })

        const event = await prisma.event.findUnique({
            where: {
                id: shareLink?.eventId
            }
        })

        if (event?.ownerId === session.user.id) {
            return respondError(new Error("You cannot join your own event"), "You cannot join your own event", 400)
        }

        if (!shareLink) {
            return respondError(new Error("Invalid link"), undefined, 404)
        }

        let participant: unknown;

        participant = await prisma.eventParticipant.findFirst({
            where: {
                userId: session.user.id ?? "",
                eventId: event?.id ?? "",
            }
        })

        if (participant) {
            return respondError(new Error("Already joined event"), "Already joined event", 400)
        }

        participant = await prisma.eventParticipant.create({
            data: {
                userId: session.user.id ?? "",
                eventId: event?.id ?? "",
            },
        });

        if (participant) {
            return respondSuccess(participant, "Joined event successfully", 201)
        } else {
            return respondError(new Error("Failed to join event"), undefined, 500)
        }
    } catch (error) {
        return respondError(error instanceof Error ? error : new Error(String(error)), "Failed to join event", 500)
    }
}

