import { User } from "lucide-react";

interface PhilosopherPersonalInfoProps {
  fullName: string;
  name: string;
  lifespan: string;
  nationality: string;
  era: string;
}

const PhilosopherPersonalInfo = ({
  fullName,
  name,
  lifespan,
  nationality,
  era
}: PhilosopherPersonalInfoProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <User className="h-5 w-5 text-primary" />
        Personal Information
      </h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="text-muted-foreground">Full Name</div>
        <div>{fullName || name}</div>
        <div className="text-muted-foreground">Lifespan</div>
        <div>{lifespan}</div>
        <div className="text-muted-foreground">Nationality</div>
        <div>{nationality}</div>
        <div className="text-muted-foreground">Era</div>
        <div>{era}</div>
      </div>
    </div>
  );
};

export default PhilosopherPersonalInfo;