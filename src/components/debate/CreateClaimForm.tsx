
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
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

type CreateClaimFormProps = {
  parentId?: string;
  onSuccess?: () => void;
};

type FormData = {
  content: string;
  stance: "for" | "against" | "neutral";
  category: string;
  supporting_evidence: string;
  counter_arguments: string;
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

export const CreateClaimForm = ({ parentId, onSuccess }: CreateClaimFormProps) => {
  const { user } = useAuth();
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <Select onValueChange={(value) => setValue("category", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
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
            <SelectTrigger>
              <SelectValue placeholder="Select your stance" />
            </SelectTrigger>
            <SelectContent>
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
            className="min-h-[100px]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Supporting Evidence</label>
          <Textarea
            {...register("supporting_evidence")}
            placeholder="Provide evidence to support your argument..."
            className="min-h-[100px]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Counter Arguments</label>
          <Textarea
            {...register("counter_arguments")}
            placeholder="Address potential counter arguments..."
            className="min-h-[100px]"
          />
        </div>

        <Button type="submit" className="w-full">
          Submit Claim
        </Button>
      </form>
    </Card>
  );
};
