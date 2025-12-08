import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MOCK_USERS } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

export default function EditProfile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Load current user data
  const user = MOCK_USERS.find(u => u.id === "me");
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    age: user?.age || "",
    bio: user?.bio || "",
  });

  const handleSave = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // In a real app, update the backend here
      // For now, we update the object reference in memory (hacky but works for mock)
      if (user) {
        user.name = formData.name;
        user.age = Number(formData.age);
        user.bio = formData.bio;
      }
      
      setIsLoading(false);
      toast({
        title: "Profile Updated",
        description: "Your changes have been saved successfully.",
      });
      setLocation("/profile");
    }, 1000);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 p-4 border-b bg-white sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/profile")}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-xl font-serif font-semibold">Edit Profile</h1>
        <div className="flex-1" />
        <Button onClick={handleSave} disabled={isLoading} className="rounded-full">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
        </Button>
      </header>

      <div className="p-6 space-y-8 max-w-md mx-auto w-full">
        {/* Avatar Edit */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative group cursor-pointer">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-muted">
              <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-8 h-8 text-white" />
            </div>
          </div>
          <span className="text-sm text-primary font-medium cursor-pointer">Change Photo</span>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <Input 
              id="name" 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input 
              id="age" 
              type="number"
              value={formData.age} 
              onChange={(e) => setFormData({...formData, age: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea 
              id="bio" 
              value={formData.bio} 
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              className="min-h-[120px] resize-none"
              placeholder="Tell your story..."
            />
            <p className="text-xs text-muted-foreground text-right">
              {formData.bio.length}/500
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
