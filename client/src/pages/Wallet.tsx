import { useState } from "react";
import { useLanguage } from "@/_core/hooks/useLanguage";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Plus, Minus, Send } from "lucide-react";
import { useLocation } from "wouter";

export default function Wallet() {
  const { t, language } = useLanguage();
  const [, navigate] = useLocation();
  const [depositAmount, setDepositAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock wallet data - في التطبيق الحقيقي ستأتي من API
  const walletBalance = 154.50;
  const totalDeposited = 500.00;
  const totalSpent = 345.50;

  const transactions = [
    {
      id: 1,
      type: "deposit",
      amount: 100.00,
      description: "إيداع عبر Stripe",
      date: "2026-02-04",
      status: "completed",
    },
    {
      id: 2,
      type: "purchase",
      amount: 50.00,
      description: "شراء خطة Premium",
      date: "2026-02-03",
      status: "completed",
    },
    {
      id: 3,
      type: "bonus",
      amount: 10.00,
      description: "مكافأة ترحيب",
      date: "2026-02-02",
      status: "completed",
    },
  ];

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      alert(t("wallet.invalidAmount") || "الرجاء إدخال مبلغ صحيح");
      return;
    }

    setIsProcessing(true);
    // محاكاة عملية الإيداع
    setTimeout(() => {
      alert(t("wallet.depositSuccess") || "تم الإيداع بنجاح!");
      setDepositAmount("");
      setIsProcessing(false);
    }, 2000);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <Plus className="w-5 h-5 text-green-600" />;
      case "purchase":
        return <Minus className="w-5 h-5 text-red-600" />;
      case "bonus":
        return <Send className="w-5 h-5 text-blue-600" />;
      default:
        return null;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "deposit":
        return "text-green-600";
      case "purchase":
        return "text-red-600";
      case "bonus":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="p-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t("wallet.title") || "محفظتي"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t("wallet.subtitle") || "إدارة رصيدك والمعاملات"}
            </p>
          </div>
        </div>

        {/* Balance Card */}
        <Card className="p-8 mb-8 bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0">
          <div className="mb-6">
            <p className="text-blue-100 text-sm font-medium">
              {t("wallet.currentBalance") || "الرصيد الحالي"}
            </p>
            <h2 className="text-4xl font-bold mt-2">${walletBalance.toFixed(2)}</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-blue-100 text-xs">{t("wallet.totalDeposited") || "إجمالي الإيداعات"}</p>
              <p className="text-xl font-semibold mt-1">${totalDeposited.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-blue-100 text-xs">{t("wallet.totalSpent") || "إجمالي المصروفات"}</p>
              <p className="text-xl font-semibold mt-1">${totalSpent.toFixed(2)}</p>
            </div>
          </div>
        </Card>

        {/* Deposit Section */}
        <Card className="p-6 mb-8 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t("wallet.addFunds") || "إضافة أموال"}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                {t("wallet.amount") || "المبلغ"}
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-3 text-gray-500">$</span>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div className="flex gap-2">
              {[10, 25, 50, 100].map((amount) => (
                <Button
                  key={amount}
                  onClick={() => setDepositAmount(amount.toString())}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  ${amount}
                </Button>
              ))}
            </div>

            <Button
              onClick={handleDeposit}
              disabled={isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {t("wallet.processing") || "جاري المعالجة..."}
                </span>
              ) : (
                `${t("wallet.deposit") || "إيداع"} $${depositAmount || "0.00"}`
              )}
            </Button>
          </div>
        </Card>

        {/* Transactions History */}
        <Card className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t("wallet.transactionHistory") || "سجل المعاملات"}
          </h3>

          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gray-200 dark:bg-slate-600 rounded-lg">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {transaction.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                    {transaction.type === "deposit" || transaction.type === "bonus"
                      ? "+"
                      : "-"}
                    ${transaction.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    {transaction.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
