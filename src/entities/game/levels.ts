export interface MatchItem {
  id: string;
  word: string; // English word
  belarusianWord?: string; // Belarusian word (optional, for Animal Map)
  imageUrl: string;
  category: "Animals" | "Fruit" | "Colors" | "Shapes";
}

export const GAME_LEVELS: MatchItem[] = [
  {
    id: "a1",
    word: "Dog",
    imageUrl: "/src/assets/tiles/dog.png",
    category: "Animals",
  },
  {
    id: "a2",
    word: "Cat",
    imageUrl: "/src/assets/tiles/cat.png",
    category: "Animals",
  },
  {
    id: "a3",
    word: "Lion",
    imageUrl: "/src/assets/tiles/lion.png",
    category: "Animals",
  },
  {
    id: "a4",
    word: "Bird",
    imageUrl: "/src/assets/tiles/bird.png",
    category: "Animals",
  },

  {
    id: "f1",
    word: "Apple",
    imageUrl: "/src/assets/tiles/apple.png",
    category: "Fruit",
  },
  {
    id: "f2",
    word: "Banana",
    imageUrl: "/src/assets/tiles/banana.png",
    category: "Fruit",
  },
  {
    id: "f3",
    word: "Grapes",
    imageUrl: "/src/assets/tiles/grapes.png",
    category: "Fruit",
  },
  {
    id: "f4",
    word: "Orange",
    imageUrl: "/src/assets/tiles/orange.png",
    category: "Fruit",
  },

  // Colors
  {
    id: "c1",
    word: "Red",
    imageUrl: "https://placehold.co/200x200/red/red",
    category: "Colors",
  },
  {
    id: "c2",
    word: "Blue",
    imageUrl: "https://placehold.co/200x200/blue/blue",
    category: "Colors",
  },
  {
    id: "c3",
    word: "Green",
    imageUrl: "https://placehold.co/200x200/green/green",
    category: "Colors",
  },
  {
    id: "c4",
    word: "Yellow",
    imageUrl: "https://placehold.co/200x200/yellow/yellow",
    category: "Colors",
  },

  // Shapes
  {
    id: "s1",
    word: "Circle",
    imageUrl: "https://placehold.co/200x200/purple/white?text=Circle",
    category: "Shapes",
  },
  {
    id: "s2",
    word: "Square",
    imageUrl: "https://placehold.co/200x200/orange/white?text=Square",
    category: "Shapes",
  },
  {
    id: "s3",
    word: "Triangle",
    imageUrl: "https://placehold.co/200x200/cyan/white?text=Triangle",
    category: "Shapes",
  },
  {
    id: "s4",
    word: "Star",
    imageUrl: "https://placehold.co/200x200/magenta/white?text=Star",
    category: "Shapes",
  },
];
