import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle } from "lucide-react";

const SuggestionForm = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"philosopher" | "book" | "content">("philosopher");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to submit suggestions");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("suggestions").insert({
        user_id: user.id,
        title,
        description,
        type,
      });

      if (error) throw error;

      toast.success("Suggestion submitted successfully!");
      setTitle("");
      setDescription("");
      setType("philosopher");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit suggestion");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Select value={type} onValueChange={(value: any) => setType(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="philosopher">Philosopher</SelectItem>
            <SelectItem value="book">Book</SelectItem>
            <SelectItem value="content">Content</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full">
        <PlusCircle className="w-4 h-4 mr-2" />
        Submit Suggestion
      </Button>
    </form>
  );
};

export default SuggestionForm;