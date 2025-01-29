import { Brain } from "lucide-react";

interface PhilosopherFrameworkProps {
  framework: string;
  style: string;
}

const PhilosopherFramework = ({ framework, style }: PhilosopherFrameworkProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Brain className="h-5 w-5 text-primary" />
        Framework & Style
      </h3>
      <p className="text-sm text-muted-foreground">{framework}</p>
      <p className="text-sm text-muted-foreground">{style}</p>
    </div>
  );
};

export default PhilosopherFramework;