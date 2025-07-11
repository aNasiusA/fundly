import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  X,
  ArrowLeftRight,
  Wallet,
  DollarSign,
  Calendar,
  AlertCircle,
} from "lucide-react";

interface TransferFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transferData: TransferData) => void;
  accounts: Account[];
}

interface Account {
  id: string;
  name: string;
  type: string;
  provider: string;
  balance: number;
  isActive: boolean;
}

interface TransferData {
  fromAccount: string;
  toAccount: string;
  amount: string;
  date: string;
  description: string;
  transferFee: string;
  reference: string;
}

const TransferFundsModal: React.FC<TransferFundsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  accounts = [],
}) => {
  const [formData, setFormData] = useState<TransferData>({
    fromAccount: "",
    toAccount: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    transferFee: "0.00",
    reference: "",
  });

  const [showFeeBreakdown, setShowFeeBreakdown] = useState(false);

  // Only show active accounts
  const activeAccounts = accounts.filter((account) => account.isActive);

  const getAccountById = (id: string) => {
    return activeAccounts.find((account) => account.id === id);
  };

  const getAvailableToAccounts = () => {
    return activeAccounts.filter(
      (account) => account.id !== formData.fromAccount
    );
  };

  const calculateTransferFee = (
    amount: string,
    fromAccount: string,
    toAccount: string
  ) => {
    const transferAmount = parseFloat(amount);
    if (!transferAmount || transferAmount <= 0) return "0.00";

    const fromAcc = getAccountById(fromAccount);
    const toAcc = getAccountById(toAccount);

    if (!fromAcc || !toAcc) return "0.00";

    // Fee calculation logic based on account types
    let fee = 0;

    // Same provider transfers
    if (fromAcc.provider === toAcc.provider && fromAcc.type === toAcc.type) {
      fee = 0; // No fee for same provider transfers
    }
    // Mobile wallet to mobile wallet (different providers)
    else if (
      fromAcc.type === "Mobile Wallet" &&
      toAcc.type === "Mobile Wallet"
    ) {
      fee = Math.min(transferAmount * 0.01, 5); // 1% capped at GHS 5
    }
    // Bank to bank transfers
    else if (fromAcc.type === "Bank Account" && toAcc.type === "Bank Account") {
      fee = transferAmount <= 1000 ? 2 : 5; // GHS 2 for amounts <= 1000, GHS 5 for larger amounts
    }
    // Mobile wallet to bank or vice versa
    else if (
      (fromAcc.type === "Mobile Wallet" && toAcc.type === "Bank Account") ||
      (fromAcc.type === "Bank Account" && toAcc.type === "Mobile Wallet")
    ) {
      fee = Math.min(transferAmount * 0.015, 10); // 1.5% capped at GHS 10
    }
    // Cash transfers (no fee)
    else if (fromAcc.type === "Cash" || toAcc.type === "Cash") {
      fee = 0;
    }

    return fee.toFixed(2);
  };

  const handleAmountChange = (amount: string) => {
    setFormData((prev) => ({
      ...prev,
      amount,
      transferFee: calculateTransferFee(
        amount,
        prev.fromAccount,
        prev.toAccount
      ),
    }));
  };

  const handleAccountChange = (
    field: "fromAccount" | "toAccount",
    value: string
  ) => {
    const updatedData = { ...formData, [field]: value };

    // Prevent selecting same account
    if (
      (field === "fromAccount" && value === formData.toAccount) ||
      (field === "toAccount" && value === formData.fromAccount)
    ) {
      updatedData[field === "fromAccount" ? "toAccount" : "fromAccount"] = "";
    }

    // Recalculate fee with updated values
    updatedData.transferFee = calculateTransferFee(
      updatedData.amount,
      updatedData.fromAccount,
      updatedData.toAccount
    );

    setFormData(updatedData);
  };

  const handleSave = () => {
    if (!formData.fromAccount || !formData.toAccount || !formData.amount) {
      alert("Please fill in all required fields");
      return;
    }

    const transferAmount = parseFloat(formData.amount);
    if (transferAmount <= 0) {
      alert("Please enter a valid transfer amount");
      return;
    }

    const fromAccount = getAccountById(formData.fromAccount);
    const totalAmount = transferAmount + parseFloat(formData.transferFee);

    if (fromAccount && fromAccount.balance < totalAmount) {
      alert(
        `Insufficient balance. Available: GHS ${fromAccount.balance.toFixed(
          2
        )}, Required: GHS ${totalAmount.toFixed(2)}`
      );
      return;
    }

    onSave(formData);
    onClose();

    // Reset form
    setFormData({
      fromAccount: "",
      toAccount: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      description: "",
      transferFee: "0.00",
      reference: "",
    });
    setShowFeeBreakdown(false);
  };

  const swapAccounts = () => {
    if (formData.fromAccount && formData.toAccount) {
      const newFromAccount = formData.toAccount;
      const newToAccount = formData.fromAccount;

      setFormData((prev) => ({
        ...prev,
        fromAccount: newFromAccount,
        toAccount: newToAccount,
        transferFee: calculateTransferFee(
          prev.amount,
          newFromAccount,
          newToAccount
        ),
      }));
    }
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case "Bank Account":
        return "text-blue-600";
      case "Mobile Wallet":
        return "text-green-600";
      case "Credit Card":
        return "text-purple-600";
      case "Cash":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  if (!isOpen) return null;

  const fromAccount = getAccountById(formData.fromAccount);
  const toAccount = getAccountById(formData.toAccount);
  const totalAmount =
    parseFloat(formData.amount || "0") +
    parseFloat(formData.transferFee || "0");

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`
        fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50 
        bg-white rounded-t-3xl shadow-2xl
        transition-transform duration-300 ease-out
        ${isOpen ? "translate-y-0" : "translate-y-full"}
        max-h-[70vh] min-h-[60vh] overflow-y-auto
        w-full max-w-md
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Transfer Funds</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-full p-2"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* From Account */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">From Account *</Label>
            <Select
              value={formData.fromAccount}
              onValueChange={(value) =>
                handleAccountChange("fromAccount", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select source account" />
              </SelectTrigger>
              <SelectContent>
                {activeAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <div className="font-medium">{account.name}</div>
                        <div
                          className={`text-xs ${getAccountTypeColor(
                            account.type
                          )}`}
                        >
                          {account.provider}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 ml-4">
                        GHS {account.balance.toFixed(2)}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Swap Button */}
          {formData.fromAccount && formData.toAccount && (
            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={swapAccounts}
                className="rounded-full p-2"
              >
                <ArrowLeftRight size={16} />
              </Button>
            </div>
          )}

          {/* To Account */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">To Account *</Label>
            <Select
              value={formData.toAccount}
              onValueChange={(value) => handleAccountChange("toAccount", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select destination account" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableToAccounts().map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <div className="font-medium">{account.name}</div>
                        <div
                          className={`text-xs ${getAccountTypeColor(
                            account.type
                          )}`}
                        >
                          {account.provider}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 ml-4">
                        GHS {account.balance.toFixed(2)}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">
              Transfer Amount (GHS) *
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                className="pl-10 text-lg"
              />
            </div>
          </div>

          {/* Transfer Fee */}
          {parseFloat(formData.transferFee) > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Transfer Fee</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFeeBreakdown(!showFeeBreakdown)}
                  className="text-xs text-blue-600"
                >
                  {showFeeBreakdown ? "Hide" : "Show"} Details
                </Button>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} className="text-yellow-600" />
                  <span className="text-sm">
                    Fee: GHS {formData.transferFee}
                  </span>
                </div>
                {showFeeBreakdown && (
                  <div className="mt-2 text-xs text-gray-600">
                    <p>
                      Transfer between different providers/types incurs a fee
                    </p>
                    <p className="mt-1">Total: GHS {totalAmount.toFixed(2)}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium">
              Transfer Date
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, date: e.target.value }))
                }
                className="pl-10"
              />
            </div>
          </div>

          {/* Reference */}
          <div className="space-y-2">
            <Label htmlFor="reference" className="text-sm font-medium">
              Reference (Optional)
            </Label>
            <Input
              id="reference"
              type="text"
              placeholder="e.g., Loan repayment, Savings"
              value={formData.reference}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, reference: e.target.value }))
              }
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              placeholder="Additional notes about this transfer"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={3}
            />
          </div>

          {/* Transfer Summary */}
          {formData.fromAccount && formData.toAccount && formData.amount && (
            <div className="bg-gray-50 rounded-lg p-4 border">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Transfer Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>From:</span>
                  <span className="font-medium">{fromAccount?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>To:</span>
                  <span className="font-medium">{toAccount?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span>GHS {parseFloat(formData.amount).toFixed(2)}</span>
                </div>
                {parseFloat(formData.transferFee) > 0 && (
                  <div className="flex justify-between">
                    <span>Fee:</span>
                    <span>GHS {formData.transferFee}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between font-medium">
                  <span>Total:</span>
                  <span>GHS {totalAmount.toFixed(2)}</span>
                </div>
                {fromAccount && (
                  <div className="text-xs text-gray-600 mt-2">
                    Remaining balance: GHS{" "}
                    {(fromAccount.balance - totalAmount).toFixed(2)}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            Transfer Funds
          </Button>
        </div>
      </div>
    </>
  );
};

export default TransferFundsModal;
