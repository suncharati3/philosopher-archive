import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";

interface Suggestion {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  created_at: string;
}

const fetchSuggestions = async () => {
  const { data, error } = await supabase
    .from("suggestions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
};

const SuggestionList = () => {
  const { user } = useAuth();

  const { data: suggestions, isLoading, error } = useQuery({
    queryKey: ["suggestions"],
    queryFn: fetchSuggestions,
    enabled: !!user,
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "rejected":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Please log in to view suggestions.</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Loading suggestions...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    toast.error("Failed to load suggestions");
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Error loading suggestions.</p>
        </CardContent>
      </Card>
    );
  }

  if (!suggestions || suggestions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">No suggestions found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {suggestions.map((suggestion) => (
        <Card key={suggestion.id}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg">{suggestion.title}</CardTitle>
              <Badge variant="outline" className={getStatusColor(suggestion.status)}>
                <span className="flex items-center gap-1">
                  {getStatusIcon(suggestion.status)}
                  {suggestion.status}
                </span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{suggestion.description}</p>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary">{suggestion.type}</Badge>
              <Badge variant="secondary">
                {new Date(suggestion.created_at).toLocaleDateString()}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SuggestionList;