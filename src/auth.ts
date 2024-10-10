import NextAuth, { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"
import Email from 'next-auth/providers/resend'
import { Resend } from "resend"
import RaycastMagicLinkEmail from "@/components/emails/login"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/db"

const resend = new Resend(process.env.AUTH_RESEND_KEY || "")

export const authOptions: NextAuthConfig = {
    providers: [
        Google,
        Email({
            async sendVerificationRequest(params) {
                const res = await resend.emails.send({
                    from: 'Jeremiah <test@craftmycv.xyz>',
                    to: params.identifier,
                    subject: "Sign in to Picshaw",
                    react: RaycastMagicLinkEmail({ magicLink: params.url })
                });
                console.log(res)
            }
        })
    ],
    adapter: PrismaAdapter(prisma),
    callbacks: {
        async signIn(params) {
            console.log(params, 'signin')
            return true
        },
        session(params) {
            console.log(params, 'session')
            return params.session
        }
    },
}

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions)