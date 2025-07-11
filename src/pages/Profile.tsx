import logo from "@/assets/logo-head.svg";
import { useState } from "react";
import { Pencil, Bell, Settings, Bookmark } from "lucide-react";
import ProfileUpdateModal from "@/components/modals/ProfileUpdateModal";
import ProfileMenuItem from "@/components/ProfileMenuItem";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";

const Profile = () => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleProfileUpdate = () => {
    return;
  };

  const firebaseUser = useFirebaseUser();

  return (
    <>
      <div className="px-5 mb-2">
        <div className="flex items-center justify-center mb-2">
          <h1 className="font-bold text-3xl">Profile</h1>
        </div>

        <div className="flex flex-col items-center justify-center mb-8">
          <img src={logo} alt="profile picture" className="h-36 w-auto" />
          <h1 className="text-3xl font-medium">{firebaseUser.displayName}</h1>
        </div>

        <div className="flex flex-col px-5 gap-8">
          <ProfileMenuItem
            to="#"
            itemName={"Personal Information"}
            icon={Pencil}
            onClick={() => setIsProfileModalOpen(true)}
          />
          <ProfileMenuItem
            to="#"
            itemName={"Security Settings"}
            icon={Settings}
          />
          <ProfileMenuItem to="#" itemName={"Notifications"} icon={Bell} />
          <ProfileMenuItem to="#" itemName={"Preferences"} icon={Bookmark} />
        </div>
        <div>
          <ProfileUpdateModal
            isOpen={isProfileModalOpen}
            onClose={() => setIsProfileModalOpen(false)}
            onSave={handleProfileUpdate}
          />
        </div>
      </div>
    </>
  );
};

export default Profile;
