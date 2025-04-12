import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { login, signup } from "./actions";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
export default function LoginPage() {
  return (
    <div className="h-dvh bg-cover  flex justify-center items-center bg-[url(/loginBG.png)]">
      <form className="flex flex-col p-5 gap-y-2 rounded-md justify-center bg-[#fefefe40] h-fit align-middle max-w-[400rem] drop-shadow-md">
        <div className="flex justify-center mb-5">
          <Image src={"/logo.png"} alt="Logo" width={200} height={200} />
        </div>
        <div className="flex flex-col gap-y-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="flex flex-col gap-y-1">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required />
        </div>
        <div className="flex flex-col gap-y-1">
          <Button formAction={login}>Log in</Button>
          <Separator />
          <Button formAction={signup}>Sign up</Button>
        </div>
      </form>
    </div>
  );
}
