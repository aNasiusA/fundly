import type { LucideIcon } from "lucide-react";
import { formatCurrency } from "@/lib/Helper functions";

import {
  Card,
  CardDescription,
  CardHeader,
  CardContent,
} from "@/components/ui/card";

interface AccountButtonProps {
  accountName: string;
  accountBalance: number;
  icon: LucideIcon;
}

const AccountButton = ({
  accountName,
  accountBalance,
  icon: Icon,
}: AccountButtonProps) => {
  return (
    <Card className="w-full gap-0">
      <CardHeader className="pb-2">
        <CardDescription className="text-center">{accountName}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-2 pt-2">
        <Icon className="w-6 h-6" />
        <span className="text-sm text-muted-foreground">Balance</span>
        <p className="text-lg font-semibold">
          {formatCurrency(accountBalance)}
        </p>
      </CardContent>
    </Card>
  );
};

export default AccountButton;
