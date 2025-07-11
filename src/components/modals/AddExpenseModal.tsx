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

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expenseData: ExpenseData) => void;
}

interface ExpenseData {
  amount: string;
  category: string;
  subcategory: string;
  paymentMethod: string;
  date: string;
  description: string;
  isRecurring: boolean;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<ExpenseData>({
    amount: "",
    category: "",
    subcategory: "",
    paymentMethod: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    isRecurring: false,
  });

  const expenseCategories = {
    Needs: [
      "Food & Groceries",
      "Rent/Mortgage",
      "Transportation",
      "Utilities",
      "Insurance",
      "Healthcare",
      "Phone Bill",
      "Internet",
    ],
    Wants: [
      "Entertainment",
      "Dining Out",
      "Shopping",
      "Travel",
      "Hobbies",
      "Subscriptions",
      "Personal Care",
      "Gifts",
    ],
    Emergency: [
      "Medical Emergency",
      "Car Repairs",
      "Home Repairs",
      "Urgent Replacement",
      "Other Emergency",
    ],
  };

  const paymentMethods = [
    "Bank Account",
    "Mobile Wallet",
    "Cash",
    "Credit Card",
    "Debit Card",
  ];

  const [selectedCategory, setSelectedCategory] = useState("");
  const [availableSubcategories, setAvailableSubcategories] = useState<
    string[]
  >([]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setAvailableSubcategories(
      expenseCategories[category as keyof typeof expenseCategories] || []
    );
    setFormData((prev) => ({
      ...prev,
      category,
      subcategory: "", // Reset subcategory when category changes
    }));
  };

  const handleSave = () => {
    if (
      !formData.amount ||
      !formData.category ||
      !formData.subcategory ||
      !formData.paymentMethod
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    onSave(formData);
    onClose();

    // Reset form
    setFormData({
      amount: "",
      category: "",
      subcategory: "",
      paymentMethod: "",
      date: new Date().toISOString().split("T")[0],
      description: "",
      isRecurring: false,
    });
    setSelectedCategory("");
    setAvailableSubcategories([]);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Needs":
        return "bg-blue-50 border-blue-200 text-blue-800";
      case "Wants":
        return "bg-purple-50 border-purple-200 text-purple-800";
      case "Emergency":
        return "bg-red-50 border-red-200 text-red-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
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
          <h2 className="text-xl font-semibold">Add Expense</h2>
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
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, amount: e.target.value }))
                }
                className="pl-10 text-lg"
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select expense category" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(expenseCategories).map((category) => (
                  <SelectItem key={category} value={category}>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${getCategoryColor(
                          category
                        )}`}
                      >
                        {category}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subcategory */}
          {availableSubcategories.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Subcategory *</Label>
              <Select
                value={formData.subcategory}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, subcategory: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {availableSubcategories.map((subcategory) => (
                    <SelectItem key={subcategory} value={subcategory}>
                      {subcategory}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Payment Method */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Payment Method *</Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, paymentMethod: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="How did you pay?" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
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

          {/* Recurring Expense Toggle */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="recurring"
              checked={formData.isRecurring}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isRecurring: e.target.checked,
                }))
              }
              className="rounded border-gray-300"
            />
            <Label htmlFor="recurring" className="text-sm font-medium">
              This is a recurring expense
            </Label>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              placeholder="Additional notes about this expense"
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

          {/* Category Info */}
          {selectedCategory && (
            <div
              className={`rounded-lg p-4 border ${getCategoryColor(
                selectedCategory
              )}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Tag className="h-4 w-4" />
                <h3 className="font-medium">{selectedCategory} Expense</h3>
              </div>
              <p className="text-xs">
                {selectedCategory === "Needs" &&
                  "Essential expenses for daily living"}
                {selectedCategory === "Wants" &&
                  "Discretionary spending for lifestyle"}
                {selectedCategory === "Emergency" &&
                  "Unexpected urgent expenses"}
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
            className="flex-1 bg-red-600 hover:bg-red-700"
          >
            Save Expense
          </Button>
        </div>
      </div>
    </>
  );
};

export default AddExpenseModal;
