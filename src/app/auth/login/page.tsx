"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = React.useState("");

  const resendAction: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    const res = await signIn("resend", {
      email,
      redirect: false,
      redirectTo: "/",
    });
    if (res?.error) {
      toast.error("Failed to send email");
    } else {
      toast.success("Check your mail", {
        description: "email has been sent succesfully",
      });
    }
    console.log(res);
  };

  return (
    <div className="p-4 my-32">
      <div className="flex flex-col text-center gap-1 w-4/5 mx-auto">
        <h1 className="text-2xl font-semibold">Login</h1>
        <p className="text-muted-foreground text-sm">
          Start creating your special image repository for events.
        </p>
      </div>

      <form className="space-y-2" onSubmit={resendAction}>
        <div>
          <Label>Email:</Label>
          <Input
            placeholder="Enter your email"
            name="email"
            type="email"
            value={email}
            onChange={(x) => setEmail(x.currentTarget.value)}
          />
        </div>
        <Button className="w-full">Login With Email</Button>
      </form>

      <div className="divide-x my-4" />
      <p className="text-center">OR</p>
      <Button
        variant="outline"
        className="flex gap-4 w-full"
        onClick={() => signIn("google", { redirect: true, redirectTo: "/" })}
        type="button"
      >
        {" "}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_245_2677)">
            <path
              d="M23.714 12.2244C23.714 11.2412 23.6342 10.5236 23.4616 9.77954H12.2336V14.2175H18.8242C18.6913 15.3204 17.9738 16.9814 16.3793 18.0975L16.3569 18.246L19.907 20.9962L20.1529 21.0208C22.4118 18.9346 23.714 15.8652 23.714 12.2244Z"
              fill="#4285F4"
            />
            <path
              d="M12.2336 23.9176C15.4624 23.9176 18.173 22.8545 20.153 21.0209L16.3793 18.0976C15.3694 18.8018 14.0141 19.2934 12.2336 19.2934C9.07118 19.2934 6.38712 17.2074 5.43032 14.324L5.29008 14.3359L1.59866 17.1927L1.55038 17.3269C3.51692 21.2334 7.55634 23.9176 12.2336 23.9176Z"
              fill="#34A853"
            />
            <path
              d="M5.43032 14.3239C5.17786 13.5798 5.03176 12.7825 5.03176 11.9587C5.03176 11.1349 5.17786 10.3376 5.41704 9.59354L5.41035 9.43507L1.67267 6.53235L1.55038 6.59052C0.73988 8.21162 0.274811 10.032 0.274811 11.9587C0.274811 13.8854 0.73988 15.7058 1.55038 17.3269L5.43032 14.3239Z"
              fill="#FBBC05"
            />
            <path
              d="M12.2336 4.62403C14.4791 4.62403 15.9939 5.59402 16.8576 6.40461L20.2326 3.10928C18.1598 1.1826 15.4624 0 12.2336 0C7.55634 0 3.51692 2.68406 1.55038 6.59056L5.41704 9.59359C6.38712 6.7102 9.07118 4.62403 12.2336 4.62403Z"
              fill="#EB4335"
            />
          </g>
          <defs>
            <clipPath id="clip0_245_2677">
              <rect
                width="23.4504"
                height="24"
                fill="white"
                transform="translate(0.274811)"
              />
            </clipPath>
          </defs>
        </svg>
        <span>Login with Google</span>
      </Button>
    </div>
  );
}
