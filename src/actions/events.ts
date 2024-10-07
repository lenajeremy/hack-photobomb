import prisma from '@/lib/db'

export async function createEvent(formData: FormData) {
    "use server"
    try {
        const event = await prisma.event.create({
            data: {
                name: formData.get("name") as string,
                slug: formData.get("slug") as string,
                description: formData.get("description") as string,
                eventDate: new Date(formData.get("eventDate") as string)
            }
        })
        console.log(event)

    } catch (error) {
        console.error(error)
        throw new Error("Failed to create event")
    }
}