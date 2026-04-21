import { OtpForm } from "@/components/admin/OtpForm";
import { Monogram } from "@/components/ui/Monogram";

export const metadata = { title: "Verify", robots: { index: false, follow: false } };

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-dark text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <Monogram />
          <div className="font-display text-lg">Admin Console</div>
        </div>
        <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur p-8">
          <h1 className="font-display text-2xl">Enter verification code</h1>
          <p className="text-white/60 text-sm mt-1">
            We sent a 6-digit code to your admin email. It expires in 10 minutes.
          </p>
          <div className="mt-6">
            <OtpForm />
          </div>
        </div>
      </div>
    </div>
  );
}
