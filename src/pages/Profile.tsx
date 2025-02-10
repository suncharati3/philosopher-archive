
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

const profileFormSchema = z.object({
  display_name: z.string().min(2, "Display name must be at least 2 characters.").max(50),
  bio: z.string().max(160, "Bio must not be longer than 160 characters."),
  preferred_persona: z.string().optional(),
});

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      display_name: "",
      bio: "",
      preferred_persona: undefined,
    },
  });

  // Fetch philosophers for persona selection
  const { data: philosophers } = useQuery({
    queryKey: ["philosophers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("philosophers")
        .select("id, name");
      if (error) throw error;
      return data;
    },
  });

  // Fetch user profile
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  // Update form when profile data is loaded
  useEffect(() => {
    if (profile) {
      form.reset({
        display_name: profile.display_name || "",
        bio: profile.bio || "",
        preferred_persona: profile.preferred_persona?.toString() || undefined,
      });
    }
  }, [profile, form]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      
      setUploading(true);
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}/avatar.${fileExt}`;

      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile picture updated successfully!");
    } catch (error: any) {
      toast.error("Error uploading image: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  // Update profile mutation
  const updateProfile = useMutation({
    mutationFn: async (values: z.infer<typeof profileFormSchema>) => {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: values.display_name,
          bio: values.bio,
          preferred_persona: values.preferred_persona ? parseInt(values.preferred_persona) : null,
        })
        .eq("id", user?.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated successfully!");
    },
  });

  const onSubmit = (values: z.infer<typeof profileFormSchema>) => {
    updateProfile.mutate(values);
  };

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <div className="relative group">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile?.avatar_url || ""} />
                <AvatarFallback className="text-2xl">
                  {profile?.display_name?.[0]?.toUpperCase() || user?.email?.[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <label 
                  htmlFor="avatar-upload" 
                  className="bg-black/50 rounded-full p-2 cursor-pointer"
                >
                  <Upload className="h-6 w-6 text-white" />
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium">{profile?.display_name || user?.email}</h3>
              <p className="text-sm text-muted-foreground">Free Plan</p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="display_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your display name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell us a bit about yourself"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferred_persona"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Philosopher Persona</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your preferred philosopher" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {philosophers?.map((philosopher) => (
                          <SelectItem 
                            key={philosopher.id} 
                            value={philosopher.id.toString()}
                          >
                            {philosopher.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full"
                disabled={updateProfile.isPending || uploading}
              >
                {updateProfile.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
