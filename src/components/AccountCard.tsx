import {
  type LucideIcon,
  Repeat,
  BanknoteArrowUp,
  BanknoteArrowDown,
} from "lucide-react";
import { formatCurrency } from "@/lib/Helper functions";
import MenuButton from "./MenuButton";

import {
  Card,
  CardDescription,
  CardHeader,
  CardContent,
  CardAction,
} from "@/components/ui/card";

interface AccountCardProps {
  accountName: string;
  accountBalance: number;
  icon: LucideIcon;
  accountId?: string;
}

const AccountCard = ({
  accountName,
  accountBalance,
  icon: Icon,
  accountId,
}: AccountCardProps) => {
  return (
    <Card className="w-full gap-2 mb-4">
      <CardHeader className="flex justify-between items-start">
        <div>
          <CardDescription className="text-sm font-medium text-muted-foreground">
            {accountName}
          </CardDescription>
        </div>
        <CardAction>
          <div className="flex gap-2 sm:gap-4">
            <MenuButton
              to="#"
              label="Income"
              icon={BanknoteArrowUp}
              size={10}
              iconSize="12px"
            />
            <MenuButton
              to="#"
              label="Expense"
              icon={BanknoteArrowDown}
              size={10}
              iconSize="12px"
            />
            <MenuButton
              to="#"
              label="Transfer"
              icon={Repeat}
              size={10}
              iconSize="12px"
            />
          </div>
        </CardAction>
      </CardHeader>

      <CardContent className="px-4 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-muted rounded-full">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs uppercase text-muted-foreground tracking-wide">
              Balance
            </span>
            <p className="text-lg font-semibold">
              {formatCurrency(accountBalance)}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-muted-foreground">Account ID</span>
          <p className="text-sm font-medium text-foreground">
            {accountId ?? "N/A"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountCard;
