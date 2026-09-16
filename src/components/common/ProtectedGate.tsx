import React from "react";
import { Lock, Sparkles, ArrowRight, ShieldCheck, Compass } from "lucide-react";

interface ProtectedGateProps {
  featureName: string;
  description?: string;
  onNavigateLogin: () => void;
  onNavigateRegister: () => void;
  children?: React.ReactNode;
  allowPreview?: boolean;
}

export const ProtectedGate: React.FC<ProtectedGateProps> = ({
  featureName,
  description,
  onNavigateLogin,
  onNavigateRegister,
  children,
  allowPreview = false,
}) => {
  const [showPreview, setShowPreview] = React.useState(false);

  if (allowPreview && showPreview) {
    return (
      <div className="space-y-4">
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4 text-amber-600 dark:text-amber-400 text-xs">
          <span>You are viewing a guest preview of {featureName}. Data will not sync to Firestore.</span>
          <button
            type="button"
            onClick={onNavigateLogin}
            className="px-3 py-1 rounded-lg bg-amber-500 text-white font-medium hover:bg-amber-600 transition shrink-0"
          >
            Sign In to Sync
          </button>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-[50vh] flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md text-center bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-900 flex items-center justify-center mx-auto mb-4 border border-slate-200">
          <Lock className="w-7 h-7" />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Outfit']">
          {featureName} Requires Account
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          {description ||
            `Personal ${featureName.toLowerCase()} and study history are stored securely in your individual Firestore cloud workspace.`}
        </p>

        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={onNavigateLogin}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-black text-white font-medium text-sm shadow-xs transition"
          >
            <span>Sign In to Your Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onNavigateRegister}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-sm transition"
          >
            Create Free Student Account
          </button>

          {allowPreview && (
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="pt-2 text-xs text-slate-500 hover:text-blue-600 transition inline-flex items-center gap-1"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Preview feature with sample data</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
