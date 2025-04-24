export const defaultConfig = {
  models: [
    { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
    { id: "gpt-4", name: "GPT-4" },
    { id: "gpt-4o", name: "GPT-4o" },
    { id: "claude-v1", name: "Claude (via Ollama)" },
    { id: "llama2", name: "Llama 2 (via Ollama)" }
  ],
  defaultModel: "gpt-3.5-turbo",
  defaultTemperature: 1.0,
  minTemperature: 0.1,
  maxTemperature: 1.5,
  systemPromptText: "Vous êtes un assistant IA utile et efficace. Répondez de manière concise et claire aux questions posées.",
  maxMessagesPerDay: 20,
  welcomeMessage: {
    title: "Bienvenue sur ConversAI",
    content: "Je suis votre assistant IA personnel. Comment puis-je vous aider aujourd'hui ?"
  },
  suggestions: [
    {
      title: "Expliquer un concept",
      message: "Explique-moi comment fonctionne l'IA générative."
    },
    {
      title: "Rédiger un texte",
      message: "Écris un email professionnel pour demander un rendez-vous."
    },
    {
      title: "Améliorer un code",
      message: "Optimise cette fonction JavaScript: function add(a, b) { return a + b; }"
    },
    {
      title: "Trouver des idées",
      message: "Donne-moi 5 idées pour un projet de programmation."
    }
  ]
};
