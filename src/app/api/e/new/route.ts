

import { CreateEventFormData } from "@/types";
import { NextRequest } from "next/server";
import { respondError, respondSuccess } from "@/lib/utils";
import prisma from "@/lib/db";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
    const session = await auth()

    if (session === null) {
        return respondError(new Error("User not authenticated"), undefined, 401)
    }

    try {
        const body = await request.json() as CreateEventFormData;
        if (body.name && body.slug && body.description && body.eventDate && body.isPrivate !== undefined) {
            const event = await prisma.event.create({
                data: {
                    name: body.name,
                    slug: body.slug,
                    description: body.description,
                    eventDate: new Date(body.eventDate),
                    ownerId: session.user?.id ?? "",
                    isPrivate: body.isPrivate ?? false,
                }
            })

            const ownerasParticipant = await prisma.eventParticipant.create({
                data: {
                    userId: session.user?.id ?? "",
                    eventId: event.id ?? "",
                }
            })

            if (event && ownerasParticipant) {
                return respondSuccess(event, "Event created successfully", 200);
            } else {
                return respondError(new Error("Failed to create event"), undefined, 500);
            }
        } else {
            return respondError(new Error("Invalid request body"), undefined, 400);
        }
    } catch (error) {
        return respondError(error instanceof Error ? error : new Error(String(error)), "Failed to create event", 500);
    }
}