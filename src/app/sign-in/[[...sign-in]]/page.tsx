import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex h-[100dvh] items-center justify-center">
      <SignIn />
    </div>
  );
}
