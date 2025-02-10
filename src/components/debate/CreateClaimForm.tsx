
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
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

type CreateClaimFormProps = {
  onSuccess?: () => void;
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

export const CreateClaimForm = ({ onSuccess }: CreateClaimFormProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, setValue } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const { error } = await supabase.from("debate_claims").insert({
        ...data,
        user_id: user?.id,
      });

      if (error) throw error;

      toast.success("Claim submitted successfully!");
      reset();
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
        <h2 className="text-xl font-semibold">Submit New Claim</h2>
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
            className="min-h-[100px] bg-white"
          />
        </div>

        <Button type="submit" className="w-full">
          Submit Claim
        </Button>
      </form>
    </Card>
  );
};

