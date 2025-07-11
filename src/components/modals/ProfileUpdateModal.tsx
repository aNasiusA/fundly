import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { X, UserRound, Mail, Smartphone } from "lucide-react";
import { auth } from "@/lib/firebase";
import { updateProfile } from "firebase/auth";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";

interface ProfileUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profileData: ProfileData) => void;
}

interface ProfileData {
  displayName: string;
  email: string;
  phoneNumber: string;
}

const ProfileUpdateModal: React.FC<ProfileUpdateModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({
    displayName: "",
    email: "",
    phoneNumber: "",
  });
  const firebaseUser = useFirebaseUser();

  useEffect(() => {
    setFormData({
      displayName: firebaseUser?.displayName ?? "",
      email: firebaseUser?.email ?? "",
      phoneNumber: firebaseUser?.phoneNumber ?? "",
    });
  }, [firebaseUser]);

  const handleSave = async () => {
    setError("");

    if (!formData.displayName || !formData.email) {
      setError("Please fill in all required fields");
      setTimeout(() => {
        setError("");
      }, 1500);
      return;
    }

    setIsLoading(true);

    try {
      onSave(formData);
      const user = auth.currentUser;
      if (user) {
        await updateProfile(user, { displayName: formData.displayName });
        await user.reload();
        const event = new CustomEvent("forceAuthRefresh");
        window.dispatchEvent(event);
      }
      onClose();
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />

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
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Edit Info</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-full p-2"
          >
            <X size={20} />
          </Button>
        </div>

        {error && (
          <div className="px-6 pt-4">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="displayName" className="text-sm font-medium">
              Display Name (Username)<p className="text-red-500">*</p>
            </Label>
            <div className="relative">
              <UserRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="displayName"
                type="text"
                placeholder="aNasiusA"
                value={formData.displayName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    displayName: e.target.value,
                  }))
                }
                className="pl-10 text-lg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email<p className="text-red-500">*</p>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="aNasiusA@fundly.com"
                value={formData.email}
                readOnly
                className="pl-10 text-lg bg-gray-50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-sm font-medium">
              Phone Number
            </Label>
            <div className="relative">
              <Smartphone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="+233"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    phoneNumber: e.target.value,
                  }))
                }
                className="pl-10 text-lg"
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50 flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Info"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProfileUpdateModal;
