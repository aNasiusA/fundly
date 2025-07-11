"use client";
import React, { useEffect, useState } from "react";
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
  Wallet,
  Building2,
  CreditCard,
  Smartphone,
} from "lucide-react";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (accountData: AccountData) => void;
}

interface AccountData {
  user_id: string;
  name: string;
  type: string;
  provider: string;
  balance: string;
  accountNumber: string;
  description: string;
  isActive: boolean;
}

const accountTypes = {
  "Bank Account": [
    "Ghana Commercial Bank",
    "Ecobank Ghana",
    "Standard Chartered",
    "Fidelity Bank",
    "Zenith Bank",
    "Access Bank",
    "Stanbic Bank",
    "Absa Bank",
    "Prudential Bank",
    "Other Bank",
  ],
  "Mobile Wallet": [
    "MTN Mobile Money",
    "Vodafone Cash",
    "AirtelTigo Money",
    "Zeepay",
    "Other Mobile Wallet",
  ],
  "Credit Card": ["Visa", "MasterCard", "American Express", "Other Credit Card"],
  Cash: ["Physical Cash", "Petty Cash", "Emergency Cash"],
};

const AddAccountModal: React.FC<AddAccountModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const { uid } = useFirebaseUser();
  const [availableProviders, setAvailableProviders] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState("");

  const [formData, setFormData] = useState<AccountData>({
    user_id: "",
    name: "",
    type: "",
    provider: "",
    balance: "",
    accountNumber: "",
    description: "",
    isActive: true,
  });

  useEffect(() => {
    if (uid) {
      setFormData((prev) => ({ ...prev, user_id: uid }));
    }
  }, [uid]);

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setAvailableProviders(accountTypes[type as keyof typeof accountTypes] || []);
    setFormData((prev) => ({ ...prev, type, provider: "" }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.type || !formData.provider) {
      // Replace with toast later
      alert("Please fill in all required fields");
      return;
    }

    if (formData.balance && parseFloat(formData.balance) < 0) {
      alert("Balance cannot be negative");
      return;
    }

    onSave(formData);
    onClose();

    setFormData({
      user_id: uid || "",
      name: "",
      type: "",
      provider: "",
      balance: "",
      accountNumber: "",
      description: "",
      isActive: true,
    });
    setSelectedType("");
    setAvailableProviders([]);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Bank Account":
        return "bg-blue-50 border-blue-200 text-blue-800";
      case "Mobile Wallet":
        return "bg-green-50 border-green-200 text-green-800";
      case "Credit Card":
        return "bg-purple-50 border-purple-200 text-purple-800";
      case "Cash":
        return "bg-orange-50 border-orange-200 text-orange-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Bank Account":
        return <Building2 className="h-4 w-4" />;
      case "Mobile Wallet":
        return <Smartphone className="h-4 w-4" />;
      case "Credit Card":
        return <CreditCard className="h-4 w-4" />;
      case "Cash":
        return <Wallet className="h-4 w-4" />;
      default:
        return <Wallet className="h-4 w-4" />;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-account-title"
        className={`
          fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50 
          bg-white rounded-t-3xl shadow-2xl w-full max-w-md
          max-h-[70vh] min-h-[60vh] overflow-y-auto
          transition-transform duration-300 ease-out
          ${isOpen ? "translate-y-0" : "translate-y-full"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 id="add-account-title" className="text-xl font-semibold">Add Account</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full p-2">
            <X size={20} />
          </Button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Account Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Main Savings"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label>Account Type *</Label>
            <Select value={formData.type} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(accountTypes).map((type) => (
                  <SelectItem key={type} value={type}>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(type)}
                      <span className={`px-2 py-1 rounded text-xs ${getTypeColor(type)}`}>
                        {type}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {availableProviders.length > 0 && (
            <div className="space-y-2">
              <Label>Provider *</Label>
              <Select
                value={formData.provider}
                onValueChange={(value) => setFormData({ ...formData, provider: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {availableProviders.map((provider) => (
                    <SelectItem key={provider} value={provider}>
                      {provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="balance">Current Balance (GHS)</Label>
            <div className="relative">
              <Wallet className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="balance"
                type="number"
                placeholder="0.00"
                value={formData.balance}
                onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                className="pl-10 text-lg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number (Optional)</Label>
            <Input
              id="accountNumber"
              placeholder="Last 4 digits or identifier"
              value={formData.accountNumber}
              onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="active"
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="rounded border-gray-300"
            />
            <Label htmlFor="active">This account is active</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Additional notes about this account"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          {selectedType && (
            <div className={`rounded-lg p-4 border ${getTypeColor(selectedType)}`}>
              <div className="flex items-center gap-2 mb-2">
                {getTypeIcon(selectedType)}
                <h3 className="font-medium">{selectedType}</h3>
              </div>
              <p className="text-xs">
                {selectedType === "Bank Account" && "Traditional banking accounts for savings and checking"}
                {selectedType === "Mobile Wallet" && "Digital wallets for mobile money transactions"}
                {selectedType === "Credit Card" && "Credit accounts for purchases and payments"}
                {selectedType === "Cash" && "Physical cash holdings and petty cash"}
              </p>
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
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            disabled={!formData.name || !formData.type || !formData.provider}
          >
            Save Account
          </Button>
        </div>
      </div>
    </>
  );
};

export default AddAccountModal;
