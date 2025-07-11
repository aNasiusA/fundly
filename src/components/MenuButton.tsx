import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

interface MenuButtonProps {
  to?: string;
  onClicked?: () => void;
  label: string;
  icon: LucideIcon;
  iconSize?: number;
  width?: number;
  height?: number;
}

const MenuButton = ({
  to,
  onClicked,
  label,
  icon: Icon,
  iconSize = 20,
  width = 80,
  height = 80,
}: MenuButtonProps) => {
  const buttonContent = (
    <div className="flex flex-col items-center justify-center gap-1">
      <Icon size={iconSize} />
      <span className="text-[10px] text-center leading-tight max-w-full overflow-hidden text-ellipsis">
        {label}
      </span>
    </div>
  );

  // If onClicked is provided, use it as a button
  if (onClicked) {
    return (
      <Button
        variant="ghost"
        className="rounded-full p-2 font-light bg-accent text-accent-foreground hover:bg-accent/80 transition-colors"
        style={{ width: `${width}px`, height: `${height}px` }}
        onClick={onClicked}
      >
        {buttonContent}
      </Button>
    );
  }

  // If 'to' is provided, use it as a link
  if (to) {
    return (
      <Button
        asChild
        variant="ghost"
        className="rounded-full p-2 font-light bg-accent text-accent-foreground hover:bg-accent/80 transition-colors"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <Link to={to}>{buttonContent}</Link>
      </Button>
    );
  }

  // Fallback - just a button without action
  return (
    <Button
      variant="ghost"
      className="rounded-full p-2 font-light bg-accent text-accent-foreground hover:bg-accent/80 transition-colors"
      style={{ width: `${width}px`, height: `${height}px` }}
      disabled
    >
      {buttonContent}
    </Button>
  );
};

export default MenuButton;
