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
import { X, DollarSign, Calendar, Tag } from "lucide-react";

interface AddIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (incomeData: IncomeData) => void;
}

interface IncomeData {
  amount: string;
  source: string;
  category: string;
  date: string;
  description: string;
  suggestedSplit: {
    needs: string;
    emergency: string;
    investment: string;
  };
}

const AddIncomeModal: React.FC<AddIncomeModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<IncomeData>({
    amount: "",
    source: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    suggestedSplit: {
      needs: "0",
      emergency: "0",
      investment: "0",
    },
  });

  const [showSplit, setShowSplit] = useState(false);

  const incomeCategories = [
    "Salary",
    "Freelance",
    "Business",
    "Investment Returns",
    "Gift/Bonus",
    "Side Hustle",
    "Other",
  ];

  const calculateSplit = (amount: string) => {
    const total = parseFloat(amount) || 0;
    const needs = (total * 0.75).toFixed(2);
    const emergency = (total * 0.15).toFixed(2);
    const investment = (total * 0.1).toFixed(2);

    setFormData((prev) => ({
      ...prev,
      suggestedSplit: { needs, emergency, investment },
    }));
    setShowSplit(total > 0);
  };

  const handleAmountChange = (value: string) => {
    setFormData((prev) => ({ ...prev, amount: value }));
    calculateSplit(value);
  };

  const handleSave = () => {
    if (!formData.amount || !formData.source || !formData.category) {
      alert("Please fill in all required fields");
      return;
    }
    onSave(formData);
    onClose();
    // Reset form
    setFormData({
      amount: "",
      source: "",
      category: "",
      date: new Date().toISOString().split("T")[0],
      description: "",
      suggestedSplit: { needs: "0", emergency: "0", investment: "0" },
    });
    setShowSplit(false);
  };

  if (!isOpen) return null;

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
          <h2 className="text-xl font-semibold">Add Income</h2>
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
          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">
              Amount (GHS) *
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

          {/* Source */}
          <div className="space-y-2">
            <Label htmlFor="source" className="text-sm font-medium">
              Income Source *
            </Label>
            <Input
              id="source"
              placeholder="e.g., Company Name, Client Name"
              value={formData.source}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, source: e.target.value }))
              }
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select income category" />
              </SelectTrigger>
              <SelectContent>
                {incomeCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium">
              Date
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

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              placeholder="Additional notes about this income"
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

          {/* Smart Split Suggestion */}
          {showSplit && (
            <div className="bg-blue-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-blue-600" />
                <h3 className="font-medium text-blue-900">
                  Smart Split Suggestion (75/15/10)
                </h3>
              </div>

              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="text-center">
                  <div className="font-medium text-blue-900">Needs & Wants</div>
                  <div className="text-blue-700">
                    GHS {formData.suggestedSplit.needs}
                  </div>
                  <div className="text-xs text-blue-600">75%</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-blue-900">Emergency</div>
                  <div className="text-blue-700">
                    GHS {formData.suggestedSplit.emergency}
                  </div>
                  <div className="text-xs text-blue-600">15%</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-blue-900">Investment</div>
                  <div className="text-blue-700">
                    GHS {formData.suggestedSplit.investment}
                  </div>
                  <div className="text-xs text-blue-600">10%</div>
                </div>
              </div>

              <p className="text-xs text-blue-600 text-center">
                This split will be applied automatically when you save
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
          >
            Save Income
          </Button>
        </div>
      </div>
    </>
  );
};

export default AddIncomeModal;
