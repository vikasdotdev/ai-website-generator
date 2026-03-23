"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserDetailContext } from "@/context/UserDetailContext";
import { CheckCircle, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const { refetchCredits, UserDetail } = useContext(UserDetailContext);
  const [hasRefetched, setHasRefetched] = useState(false);

  useEffect(() => {
    // Refetch credits after a short delay to ensure webhook has processed
    const timer = setTimeout(async () => {
      await refetchCredits();
      setHasRefetched(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [refetchCredits]);

  // Auto-redirect after 5 seconds
  useEffect(() => {
    if (hasRefetched) {
      const redirect = setTimeout(() => {
        router.push("/workspace");
      }, 4000);
      return () => clearTimeout(redirect);
    }
  }, [hasRefetched, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="text-center space-y-6 p-10 max-w-md mx-auto">
        {/* Animated Check Icon */}
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 bg-green-400/20 rounded-full animate-ping" />
          <div className="relative flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full shadow-lg shadow-green-200">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
        </div>

        {/* Success Message */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Payment Successful!
          </h1>
          <p className="text-gray-500 text-lg">
            10 credits have been added to your account
          </p>
        </div>

        {/* Credits Display */}
        <div className="bg-white/80 backdrop-blur border border-green-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-1">
            <Sparkles className="h-4 w-4 text-emerald-500" />
            <span>Your current balance</span>
          </div>
          <p className="text-4xl font-bold text-emerald-600">
            {hasRefetched
              ? `${UserDetail?.credits ?? "..."} credits`
              : "Updating..."}
          </p>
        </div>

        {/* Redirect notice + manual button */}
        <div className="space-y-3">
          <p className="text-sm text-gray-400">
            Redirecting to workspace automatically...
          </p>
          <Button
            onClick={() => router.push("/workspace")}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700"
          >
            Go to Workspace <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
