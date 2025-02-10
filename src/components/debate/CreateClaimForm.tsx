
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

type CreateClaimFormProps = {
  onSuccess?: () => void;
  parentId?: string;
};

type FormData = {
  content: string;
  stance: "for" | "against" | "neutral";
  category: string;
  supporting_evidence: string;
};

const CATEGORIES = [
  "Philosophy",
  "Ethics",
  "Politics",
  "Science",
  "Religion",
  "Society",
  "Other",
];

export const CreateClaimForm = ({ onSuccess, parentId }: CreateClaimFormProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, setValue } = useForm<FormData>();
  const [isUploading, setIsUploading] = React.useState(false);
  const [evidenceFiles, setEvidenceFiles] = React.useState<string[]>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !user) return;

    setIsUploading(true);
    try {
      const uploadedFiles: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('evidence-files')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        if (data) {
          const { data: { publicUrl } } = supabase.storage
            .from('evidence-files')
            .getPublicUrl(filePath);
          
          uploadedFiles.push(publicUrl);
        }
      }

      setEvidenceFiles((prev) => [...prev, ...uploadedFiles]);
      toast.success("Files uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const evidenceText = data.supporting_evidence || '';
      const filesList = evidenceFiles.length > 0 
        ? `\n\nAttached files:\n${evidenceFiles.join('\n')}`
        : '';

      const { error } = await supabase.from("debate_claims").insert({
        ...data,
        supporting_evidence: evidenceText + filesList,
        user_id: user?.id,
        parent_id: parentId,
      });

      if (error) throw error;

      toast.success(parentId ? "Reply submitted successfully!" : "Claim submitted successfully!");
      reset();
      setEvidenceFiles([]);
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting claim:", error);
      toast.error("Failed to submit claim. Please try again.");
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">
          {parentId ? "Reply to Claim" : "Submit New Claim"}
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <Select onValueChange={(value) => setValue("category", value)}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category.toLowerCase()}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Stance</label>
          <Select onValueChange={(value: "for" | "against" | "neutral") => setValue("stance", value)}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Select your stance" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="for">For</SelectItem>
              <SelectItem value="against">Against</SelectItem>
              <SelectItem value="neutral">Neutral</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Main Argument</label>
          <Textarea
            {...register("content")}
            placeholder="Present your main argument..."
            className="min-h-[100px] bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Supporting Evidence</label>
          <Textarea
            {...register("supporting_evidence")}
            placeholder="Provide evidence to support your argument..."
            className="min-h-[100px] bg-white mb-2"
          />
          <div className="space-y-2">
            <Input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="bg-white"
              disabled={isUploading}
            />
            {evidenceFiles.length > 0 && (
              <div className="text-sm text-gray-600">
                {evidenceFiles.length} file(s) uploaded
              </div>
            )}
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isUploading}>
          Submit Claim
        </Button>
      </form>
    </Card>
  );
};
