import { LoginForm } from "@/components/admin/LoginForm";
import { Monogram } from "@/components/ui/Monogram";

export const metadata = { title: "Admin Login", robots: { index: false, follow: false } };

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-dark text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <Monogram />
          <div className="font-display text-lg">Admin Console</div>
        </div>
        <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur p-8">
          <h1 className="font-display text-2xl">Sign in</h1>
          <p className="text-white/60 text-sm mt-1">
            Access your personal brand CMS.
          </p>
          <div className="mt-6">
            <LoginForm />
          </div>
        </div>
        <p className="text-xs text-white/40 mt-6 text-center">
          Two-factor authentication via email is required.
        </p>
      </div>
    </div>
  );
}
