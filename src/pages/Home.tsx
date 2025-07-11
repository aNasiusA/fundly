import { useEffect } from "react";
import { TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import MenuButton from "@/components/MenuButton";
import logo from "@/assets/logo-head.svg";
import { Link } from "react-router-dom";
import AccountButton from "@/components/AccountButton";
import Transaction from "@/components/Transaction";
import AddIncomeModal from "@/components/modals/AddIncomeModal";
import AddExpenseModal from "@/components/modals/AddExpenseModal";
import AddAccountModal from "@/components/modals/AddAccountModal ";
import TransferFundsModal from "@/components/modals/TransferFundsModal";
import { formatCurrency } from "@/lib/Helper functions";
import { useState } from "react";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";
import { getAccountsByUserId, getTotalBalanceByUserId } from "@/lib/database";
import {
  BanknoteArrowUp,
  BanknoteArrowDown,
  Repeat,
  Landmark,
  ChevronRight,
  Vault,
} from "lucide-react";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { addDocument } from "@/lib/database";

type Account = {
  user_id: string;
  name: string;
  type: string;
  provider: string;
  balance: string;
  accountNumber: string;
  description: string;
  isActive: boolean;
  id: string;
};

const Home = () => {
  const firebaseUser = useFirebaseUser();
  const uid = firebaseUser?.uid;
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await getAccountsByUserId(uid);
        setAccounts(data);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };

    const fetchTotalBalance = async () => {
      try {
        const balance = await getTotalBalanceByUserId(uid);
        setTotalBalance(balance);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };
    if (uid) {
      fetchAccounts();
      fetchTotalBalance();
    }
  }, [uid, accounts]);

  const handleSaveIncome = (incomeData: object) => {
    console.log("Income saved:", incomeData);
    // Here you would typically save to your database/state
    // The modal will close automatically after saving
  };

  const handleSaveExpense = (expenseData: object) => {
    console.log("Expense saved:", expenseData);
    // Save to database/state
  };

  const handleSaveAccount = async (accountData: object) => {
    await addDocument("accounts", accountData);
    const updatedAccounts = await getDocumentsByUserId("accounts", uid);
    setAccounts(updatedAccounts);
    console.log("New account:", accountData);
  };

  const handleTransfer = (transferData: object) => {
    // Handle the transfer logic
    console.log("Transfer:", transferData);
  };

  return (
    <>
      <div className="px-5 mb-2">
        <div className="flex items-center gap-2">
          <Link to="/profile">
            <img src={logo} alt="Logo" className="h-16 w-auto" />
          </Link>
          <div className="flex flex-col gap-0">
            <h2 className="text-sm text-gray-400">
              {firebaseUser.displayName}
            </h2>
            <h1 className="text-lg">Welcome back 👋</h1>
          </div>
        </div>
      </div>
      {/* Total Balance */}
      <div className="px-8">
        <Card className="gap-2 p-8">
          <CardHeader>
            <CardDescription>Total Balance</CardDescription>
            {/* <CardTitle className="text-2xl font-semibold py-2">
            GH₵ 1,250.00
          </CardTitle> */}
            <CardAction>
              <Badge variant="outline">
                <TrendingUp />
                +12.5%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-center pb-4">
            {formatCurrency(totalBalance)}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-4 gap-2">
        <CardHeader>
          <CardDescription>Quick actions</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex justify-between w-full gap-2 px-2">
            <MenuButton
              onClicked={() => setIsAddIncomeOpen(true)}
              label="Add Income"
              icon={BanknoteArrowUp}
              iconSize={24}
              width={75}
              height={50}
            />
            <MenuButton
              onClicked={() => setIsAddExpenseOpen(true)}
              label=" Add Expense"
              icon={BanknoteArrowDown}
              iconSize={24}
              width={75}
              height={50}
            />
            <MenuButton
              onClicked={() => setIsAccountModalOpen(true)}
              label="New Account"
              icon={Vault}
              iconSize={24}
              width={75}
              height={50}
            />
            <MenuButton
              onClicked={() => setIsTransferModalOpen(true)}
              label="Transfer"
              icon={Repeat}
              iconSize={24}
              width={75}
              height={50}
            />
          </div>
        </CardContent>
      </Card>
      {/* Top Accounts */}
      <div>
        <div className="mt-4 mb-2 px-2 flex items-center justify-between">
          <h1>Top Accounts</h1>
          <Link to={"/accounts"} className="flex items-center">
            <span className="text-xs text-accent-foreground">See all...</span>
            <ChevronRight style={{ width: "12px", height: "12px" }} />
          </Link>
        </div>
        <div className="flex gap-2 overflow-x-auto px-2">
          {accounts.slice(0, 3).map((account) => (
            <AccountButton
              key={account.id}
              accountName={account.name}
              accountBalance={Number(account.balance)}
              icon={Landmark}
            />
          ))}
        </div>
      </div>
      {/* Recent Activities */}
      <div>
        <div className="mt-4 mb-2 px-2 flex items-center justify-between">
          <h1>Recent Transactions</h1>
          <Link to={"/transactions"} className="flex items-center">
            <span className="text-xs text-accent-foreground">See all...</span>
            <ChevronRight style={{ width: "12px", height: "12px" }} />
          </Link>
        </div>
        <Card className="mt-4 py-4">
          <CardContent className="p-0">
            <div className="px-4">
              <h1 className="text-gray-400">Today</h1>
            </div>
            <div className="flex flex-col gap-4 w-full px-4">
              <Transaction
                transactionName="Data"
                transactionAmount={12}
                transactionType="expense"
                transactionDate={new Date()}
              />
              <Transaction
                transactionName="MTN MoMo to Zenith bank"
                transactionAmount={12}
                transactionType="transfer"
                transactionDate={new Date()}
              />
              <Transaction
                transactionName="Monthly Allowance"
                transactionAmount={500}
                transactionType="income"
                transactionDate={new Date()}
              />
            </div>
          </CardContent>
        </Card>
        <div>
          <AddIncomeModal
            isOpen={isAddIncomeOpen}
            onClose={() => setIsAddIncomeOpen(false)}
            onSave={handleSaveIncome}
          />
          <AddExpenseModal
            isOpen={isAddExpenseOpen}
            onClose={() => setIsAddExpenseOpen(false)}
            onSave={handleSaveExpense}
          />
          <AddAccountModal
            isOpen={isAccountModalOpen}
            onClose={() => setIsAccountModalOpen(false)}
            onSave={handleSaveAccount}
          />
          <TransferFundsModal
            isOpen={isTransferModalOpen}
            onClose={() => setIsTransferModalOpen(false)}
            onSave={handleTransfer}
            accounts={accounts}
          />
        </div>
      </div>
    </>
  );
};

export default Home;
