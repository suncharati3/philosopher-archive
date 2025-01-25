import PhilosopherCard from "./PhilosopherCard";

const SAMPLE_PHILOSOPHERS = [
  {
    name: "Plato",
    era: "Ancient Greece",
    nationality: "Greek",
    coreIdeas: "Theory of Forms, Ideal State, The Cave Allegory",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/88/Plato_Silanion_Musei_Capitolini_MC1377.jpg",
  },
  {
    name: "Immanuel Kant",
    era: "Enlightenment",
    nationality: "German",
    coreIdeas: "Categorical Imperative, Transcendental Idealism",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Kant_gemaelde_3.jpg",
  },
  {
    name: "Simone de Beauvoir",
    era: "Contemporary",
    nationality: "French",
    coreIdeas: "Existential Feminism, Ethics of Ambiguity",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Simone_de_Beauvoir2.png",
  },
];

const PhilosopherGrid = () => {
  return (
    <div className="container py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {SAMPLE_PHILOSOPHERS.map((philosopher) => (
          <PhilosopherCard key={philosopher.name} {...philosopher} />
        ))}
      </div>
    </div>
  );
};

export default PhilosopherGrid;