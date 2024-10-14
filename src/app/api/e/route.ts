import prisma from "@/lib/db";
import { auth } from "@/auth";
import { respondError, respondSuccess } from "@/lib/utils";

export async function GET() {
    const session = await auth()

    if (session === null) {
        return respondError(new Error("User not authenticated"), undefined, 401)
    } else {
        try {
            const userEvents = await prisma.event.findMany({
                where: {
                    participants: {
                        some: {
                            userId: session.user?.id
                        },
                    }
                }
            })

            const userEventsWithAttendees = await Promise.all(userEvents.map(async e => ({
                ...e, attendees: await prisma.eventParticipant.count({
                    where: {
                        eventId: e.id
                    }
                })
            })))

            return respondSuccess(userEventsWithAttendees, "Events retrieved successfully", 200)
        } catch (error) {
            console.log(error)
            respondError(error instanceof Error ? error : new Error(String(error)), "Failed to get user events", 500);
        }
    }
}