import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-[100dvh] items-center justify-center">
      <LoaderCircle size={60} className="animate-spin" />
    </div>
  );
}
