import { Award, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "../../ui/card";

interface PhilosopherLegacyProps {
  influences: string[];
  controversies: string[];
}

const PhilosopherLegacy = ({ influences, controversies }: PhilosopherLegacyProps) => {
  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Award className="h-6 w-6 text-primary" />
          Influences
        </h3>
        <div className="grid gap-6 md:grid-cols-2">
          {influences.map((influence, index) => (
            <Card key={index} className="border-none shadow-md">
              <CardContent className="p-6 bg-gradient-to-br from-primary/5 to-transparent">
                <p className="text-foreground leading-relaxed">{influence}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {controversies.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-primary" />
            Controversies
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            {controversies.map((controversy, index) => (
              <Card key={index} className="border-none shadow-md">
                <CardContent className="p-6 bg-gradient-to-br from-primary/5 to-transparent">
                  <p className="text-foreground leading-relaxed">{controversy}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhilosopherLegacy;