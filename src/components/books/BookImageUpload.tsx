import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BookImageUploadProps {
  bookId: string;
  onUploadComplete: (url: string) => void;
}

const BookImageUpload = ({ bookId, onUploadComplete }: BookImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${bookId}-${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('book-covers')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('book-covers')
        .getPublicUrl(filePath);

      // Update book record with new image URL
      const { error: updateError } = await supabase
        .from('books')
        .update({ cover_image_url: publicUrl })
        .eq('id', bookId);

      if (updateError) throw updateError;

      onUploadComplete(publicUrl);
      toast({
        title: "Success",
        description: "Book cover uploaded successfully",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload book cover",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        id="image-upload"
        className="hidden"
        accept="image/*"
        onChange={handleFileUpload}
        disabled={isUploading}
      />
      <Button
        variant="outline"
        size="sm"
        disabled={isUploading}
        onClick={() => document.getElementById('image-upload')?.click()}
      >
        <Upload className="h-4 w-4 mr-2" />
        {isUploading ? "Uploading..." : "Upload Cover"}
      </Button>
    </div>
  );
};

export default BookImageUpload;