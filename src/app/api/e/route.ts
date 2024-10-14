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
                },
                include: {
                    _count: {
                        select: {
                            participants: true,
                        },
                    },
                },
            }).then(events => events.map(event => ({ ...event, attendees: event._count.participants })))

            return respondSuccess(userEvents, "Events retrieved successfully", 200)
        } catch (error) {
            console.log(error)
            respondError(error instanceof Error ? error : new Error(String(error)), "Failed to get user events", 500);
        }
    }
}