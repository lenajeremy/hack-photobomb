import prisma from "@/lib/db";
import { respondError, respondSuccess } from "@/lib/utils";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
    const { slug } = params
    if (slug) {
        const event = await prisma.event.findUnique({
            where: {
                slug: slug
            }
        })
        if (event) {
            return respondError(new Error("Slug already exists"), undefined, 400)
        } else return respondSuccess(true, "Slug available", 200);
    } else {
        return respondError(new Error("Invalid request body"), undefined, 400);
    }
}

// async function sleep(ms: number) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }