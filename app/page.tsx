"use client";

import { useState, useCallback } from "react";
import { Header } from "@/components/emi/header";
import { LoanInputForm } from "@/components/emi/loan-input-form";
import { ResultCards } from "@/components/emi/result-cards";
import { EMICharts } from "@/components/emi/emi-charts";
import { AmortizationTable } from "@/components/emi/amortization-table";
import { LoanComparison } from "@/components/emi/loan-comparison";
import { WhatIfSimulator } from "@/components/emi/what-if-simulator";
import { PartPaymentCalculator } from "@/components/emi/part-payment-calculator";
import { AdvancedEMIFeatures } from "@/components/emi/advanced-emi-features";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Scale, Sliders, Banknote, Settings2 } from "lucide-react";
import {
  calculateEMIResult,
  generateAmortizationSchedule,
  type LoanDetails,
  type EMIResult,
  type AmortizationEntry,
} from "@/lib/emi-calculator";

export default function EMICalculator() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EMIResult | null>(null);
  const [schedule, setSchedule] = useState<AmortizationEntry[]>([]);
  const [loanDetails, setLoanDetails] = useState<LoanDetails>({
    loanAmount: 1000000,
    interestRate: 8.5,
    tenureMonths: 240,
  });

  const handleCalculate = useCallback((details: LoanDetails) => {
    setIsLoading(true);
    setLoanDetails(details);
    
    // Simulate a brief loading state for better UX
    setTimeout(() => {
      const emiResult = calculateEMIResult(details);
      const amortizationSchedule = generateAmortizationSchedule(
        details.loanAmount,
        details.interestRate,
        details.tenureMonths
      );

      setResult(emiResult);
      setSchedule(amortizationSchedule);
      setIsLoading(false);
    }, 300);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Loan Inputs */}
          <div className="lg:col-span-4 xl:col-span-3">
            <LoanInputForm onCalculate={handleCalculate} isLoading={isLoading} />
          </div>

          {/* Right Panel - Results Dashboard */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            {/* Result Cards */}
            <ResultCards result={result} isLoading={isLoading} />

            {/* Charts */}
            {result && (
              <EMICharts
                principal={loanDetails.loanAmount}
                totalInterest={result.totalInterest}
                schedule={schedule}
                isLoading={isLoading}
              />
            )}

            {/* Amortization Table */}
            <AmortizationTable schedule={schedule} isLoading={isLoading} />

            {/* Advanced Tools */}
            <Tabs defaultValue="comparison" className="w-full">
              <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
                <TabsTrigger value="comparison" className="gap-2">
                  <Scale className="h-4 w-4" />
                  <span className="hidden sm:inline">Compare Loans</span>
                  <span className="sm:hidden">Compare</span>
                </TabsTrigger>
                <TabsTrigger value="whatif" className="gap-2">
                  <Sliders className="h-4 w-4" />
                  <span className="hidden sm:inline">What-if</span>
                  <span className="sm:hidden">What-if</span>
                </TabsTrigger>
                <TabsTrigger value="partpayment" className="gap-2">
                  <Banknote className="h-4 w-4" />
                  <span className="hidden sm:inline">Part Payment</span>
                  <span className="sm:hidden">Part Pay</span>
                </TabsTrigger>
                <TabsTrigger value="advanced" className="gap-2">
                  <Settings2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Advanced</span>
                  <span className="sm:hidden">Adv</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="comparison" className="mt-4">
                <LoanComparison />
              </TabsContent>
              
              <TabsContent value="whatif" className="mt-4">
                <WhatIfSimulator
                  basePrincipal={loanDetails.loanAmount}
                  baseRate={loanDetails.interestRate}
                  baseTenure={loanDetails.tenureMonths}
                />
              </TabsContent>
              
              <TabsContent value="partpayment" className="mt-4">
                <PartPaymentCalculator
                  principal={loanDetails.loanAmount}
                  interestRate={loanDetails.interestRate}
                  tenure={loanDetails.tenureMonths}
                  currentEMI={result?.emi || 0}
                />
              </TabsContent>
              
              <TabsContent value="advanced" className="mt-4">
                <AdvancedEMIFeatures
                  principal={loanDetails.loanAmount}
                  interestRate={loanDetails.interestRate}
                  tenureMonths={loanDetails.tenureMonths}
                  currentEMI={result?.emi || 0}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 py-6 border-t text-center text-sm text-muted-foreground">
          <p>
            Advanced EMI Calculator — Built with precision for your financial planning needs
          </p>
          <p className="mt-1">
            <Calculator className="inline h-3 w-3 mr-1" />
            EMI = P × r × (1+r)^n / ((1+r)^n - 1)
          </p>
        </footer>
      </main>
    </div>
  );
}
