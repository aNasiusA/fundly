import { BanknoteArrowUp, BanknoteArrowDown, Repeat } from "lucide-react";
import { formatCurrency, formatFullDate } from "@/lib/Helper functions";

interface TransactionProps {
  transactionName: string;
  transactionDate: Date;
  transactionType: "income" | "expense" | "transfer";
  transactionAmount: number;
}

const Transaction = ({
  transactionName,
  transactionDate,
  transactionType,
  transactionAmount,
}: TransactionProps) => {
  const getIcon = (type: "income" | "expense" | "transfer") => {
    const size = "w-6 h-6";
    const color =
      type === "income"
        ? "text-green-600"
        : type === "expense"
        ? "text-red-600"
        : "text-blue-600";

    const className = `${size} ${color}`;

    switch (type) {
      case "income":
        return <BanknoteArrowUp className={className} />;
      case "expense":
        return <BanknoteArrowDown className={className} />;
      case "transfer":
        return <Repeat className={className} />;
    }
  };

  const getAmountColor = (type: "income" | "expense" | "transfer") => {
    switch (type) {
      case "income":
        return "text-green-600";
      case "expense":
        return "text-red-600";
      case "transfer":
      default:
        return "text-blue-600";
    }
  };

  const getAmountSign = (type: "income" | "expense" | "transfer") => {
    switch (type) {
      case "income":
        return "+";
      case "expense":
        return "-";
      default:
        return "";
    }
  };

  return (
    <div className="border-b flex items-center justify-between gap-4 py-2">
      <div className="flex gap-4 items-center">
        {getIcon(transactionType)}
        <div className="flex flex-col mb-2">
          <h2 className="font-semibold text-lg">{transactionName}</h2>
          <p className="text-xs">{formatFullDate(transactionDate)}</p>
        </div>
      </div>
      <div className={getAmountColor(transactionType)}>
        {getAmountSign(transactionType)}
        {formatCurrency(transactionAmount)}
      </div>
    </div>
  );
};

export default Transaction;
