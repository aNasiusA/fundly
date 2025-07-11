import { ChevronRight, type LucideIcon } from "lucide-react";

interface ProfileMenuItemProps {
  to: string;
  itemName: string;
  icon: LucideIcon;
  onClick?: () => void;
}
const ProfileMenuItem = ({
  itemName,
  icon: Icon,
  onClick,
}: ProfileMenuItemProps) => {
  return (
    <button className="cursor-pointer" onClick={onClick}>
      <div className="border-b flex items-center justify-between gap-4 py-2">
        <div className="flex gap-4 items-center">
          <Icon />
          <h2 className="font-semibold text-lg">{itemName}</h2>
        </div>
        <div className="">
          <ChevronRight />
        </div>
      </div>
    </button>
  );
};

export default ProfileMenuItem;
