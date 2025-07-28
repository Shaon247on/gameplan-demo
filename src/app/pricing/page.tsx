"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import Image from "next/image";

export default function PricingPage() {
  const router = useRouter();

  const handleFreeTrial = () => {
    // TODO: Implement free trial logic here
    console.log("Free trial accepted");
    router.push("/dashboard");
  };

  const handleChoosePlan = (plan: "monthly" | "yearly") => {
    // TODO: Implement plan selection logic here
    console.log(`${plan} plan selected`);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-8">
      {/* Logo */}
      <div className="text-center mb-8">
        <Image src={"/logo.png"} alt="logo image" width={225} height={63} className="md:max-w-[225px] md:max-h-[63px]"/>
      </div>

      {/* Features List */}
      <div className="max-w-md mx-auto mb-8">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Check className="w-5 h-5 text-blue-700 flex-shrink-0" />
            <span className="text-gray-800">Unlimited Ai plan</span>
          </div>
          <div className="flex items-center space-x-3">
            <Check className="w-5 h-5 text-blue-700 flex-shrink-0" />
            <span className="text-gray-800">Unlimited Calendar use</span>
          </div>
          <div className="flex items-center space-x-3">
            <Check className="w-5 h-5 text-blue-700 flex-shrink-0" />
            <span className="text-gray-800">24/7 Customer support</span>
          </div>
          <div className="flex items-center space-x-3">
            <Check className="w-5 h-5 text-blue-700 flex-shrink-0" />
            <span className="text-gray-800">Cancel Anytime</span>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="flex flex-col sm:flex-row gap-10 mb-7">
        {/* Monthly Plan */}
        <Card className="flex-1 bg-gradient-to-l from-[#051960] to-[#591DA9] text-white border-0 mb-8 pt-6 pb-12 px-9">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-4">Monthly</h3>
            <div className="text-3xl font-bold mb-2">$10.50</div>
            <div className="text-sm opacity-90 mb-6">$0.7/week</div>
            <Button
              onClick={() => handleChoosePlan("monthly")}
              variant="outline"
              className="w-full bg-white text-blue-800 border-blue-800 hover:bg-gray-50 rounded-full"
            >
              Choose
            </Button>
          </CardContent>
        </Card>

        {/* Yearly Plan */}
        <Card className="flex-1 bg-gradient-to-l from-[#051960] to-[#591DA9] text-white border-0 mb-8 pt-6 pb-12 px-9">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-4">Yearly</h3>
            <div className="text-3xl font-bold mb-2">$40.50</div>
            <div className="text-sm opacity-90 mb-6">$0.7/week</div>
            <Button
              onClick={() => handleChoosePlan("yearly")}
              variant="outline"
              className="w-full bg-white text-blue-800 border-blue-800 hover:bg-gray-50 rounded-full"
            >
              Choose
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Free Trial Button */}
      <div className="text-center">
        <Button
          onClick={handleFreeTrial}
          variant={"primary"}
          className="rounded-full md:w-[370px] h-[54px]"
        >
          Accept Free Trial
        </Button>
        <p className="text-sm text-gray-500 mt-2">Free Trial For 7 Days</p>
      </div>
    </div>
  );
} 