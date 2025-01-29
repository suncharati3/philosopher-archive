import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { usePhilosophersStore } from "@/store/usePhilosophersStore";
import { useChat } from "@/hooks/useChat";
import { useToast } from "../ui/use-toast";
import ChatInterface from "../ChatInterface";
import { useState, useEffect } from "react";
import BookCover from "./BookCover";
import BookSection from "./BookSection";
import BookChatButton from "./BookChatButton";
import BookChatHeader from "./BookChatHeader";
import { useChatMode } from "@/hooks/useChatMode";

interface BookDetailsProps {
  book: {
    id: string;
    title: string;
    publication_date: string | null;
    summary: string | null;
    key_concepts: string | null;
    historical_context: string | null;
    influence: string | null;
    cover_image_url: string | null;
    philosopher?: {
      name: string;
    } | null;
  };
  onBack: () => void;
  onChatStart: () => void;
}

const BookDetails = ({ book, onBack, onChatStart }: BookDetailsProps) => {
  return (
    <div className="p-6 space-y-6">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Books
      </Button>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <BookCover
            title={book.title}
            coverImageUrl={book.cover_image_url}
            publicationDate={book.publication_date}
            authorName={book.philosopher?.name}
          />
        </div>
        <div className="space-y-6">
          <BookSection title="Summary" content={book.summary} />
          <BookSection
            title="Key Concepts"
            content={book.key_concepts}
            type="tags"
          />
          <BookSection
            title="Historical Context"
            content={book.historical_context}
          />
          <BookSection title="Influence" content={book.influence}>
            <BookChatButton book={book} onChatStart={onChatStart} />
          </BookSection>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;