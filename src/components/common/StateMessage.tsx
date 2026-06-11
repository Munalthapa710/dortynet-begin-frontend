import { AlertCircle, LoaderCircle } from "lucide-react";

export function LoadingState() {
  return (
    <div className="flex min-h-52 items-center justify-center gap-3 text-slate-500">
      <LoaderCircle className="animate-spin" size={22} />
      Loading...
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex min-h-52 flex-col items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
      <AlertCircle size={26} />
      <p className="font-medium">{message}</p>
    </div>
  );
}
