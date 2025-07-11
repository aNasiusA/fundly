import AccountCard from "@/components/AccountCard";
import { Landmark, Plus } from "lucide-react";
import MenuButton from "@/components/MenuButton";
import { useEffect, useState } from "react";
import { getAccountsByUserId } from "@/lib/database";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";

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

const Accounts = () => {
  const firebaseUser = useFirebaseUser();
  const uid = firebaseUser?.uid;
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await getAccountsByUserId(uid);
        setAccounts(data);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };
    if (uid) {
      fetchAccounts();
    }
  }, [uid]);

  return (
    <div className="mt-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-white shadow rounded-xl">
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold">Accounts</h1>
          <span className="text-sm text-muted-foreground">
            Total: {accounts.length}
          </span>
        </div>
        <MenuButton to="#" label="Add" icon={Plus} size={12} />
      </div>

      {/* Account List */}
      <div className="space-y-4">
        {accounts.map((acc) => (
          <AccountCard
            key={acc.id}
            accountId={acc.id}
            accountName={acc.name}
            accountBalance={acc.balance}
            icon={Landmark}
          />
        ))}
      </div>
    </div>
  );
};

export default Accounts;
