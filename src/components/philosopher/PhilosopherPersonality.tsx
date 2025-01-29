interface PhilosopherPersonalityProps {
  personality: string;
}

const PhilosopherPersonality = ({ personality }: PhilosopherPersonalityProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Personality</h3>
      <p className="text-sm text-muted-foreground">{personality}</p>
    </div>
  );
};

export default PhilosopherPersonality;