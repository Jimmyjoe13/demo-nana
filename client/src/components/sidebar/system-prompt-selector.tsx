import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useChatConfig } from "@/hooks/use-chat-config";
import { systemPrompts } from "@/config/prompts";

export function SystemPromptSelector() {
  const { config, setSystemPrompt, setCustomPrompt } = useChatConfig();
  const [showCustomPrompt, setShowCustomPrompt] = useState(config.systemPrompt === "custom");

  useEffect(() => {
    setShowCustomPrompt(config.systemPrompt === "custom");
  }, [config.systemPrompt]);

  const handleSystemPromptChange = (value: string) => {
    setSystemPrompt(value);
  };

  const handleCustomPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomPrompt(e.target.value);
  };

  // Trouver le prompt système actuel
  const currentPrompt = systemPrompts.find(prompt => prompt.id === config.systemPrompt);
  const promptText = currentPrompt?.prompt || config.customPrompt || "";

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="system-prompt" className="block font-medium text-sm">Prompt système</Label>
        <Select value={config.systemPrompt} onValueChange={handleSystemPromptChange}>
          <SelectTrigger id="system-prompt" className="w-full">
            <SelectValue placeholder="Sélectionner un prompt" />
          </SelectTrigger>
          <SelectContent>
            {systemPrompts.map((prompt) => (
              <SelectItem key={prompt.id} value={prompt.id}>
                {prompt.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {showCustomPrompt && (
        <div className="space-y-2">
          <Label htmlFor="custom-prompt" className="block font-medium text-sm">Prompt personnalisé</Label>
          <Textarea
            id="custom-prompt"
            placeholder="Entrez votre prompt système personnalisé..."
            rows={4}
            className="w-full resize-none"
            value={config.customPrompt}
            onChange={handleCustomPromptChange}
          />
        </div>
      )}

      {/* Affichage du contenu du prompt */}
      <div>
        <Label className="block font-medium text-sm mb-2">Contenu du prompt actuel</Label>
        <Card className="bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700">
          <CardContent className="p-3 text-xs overflow-auto max-h-40">
            {promptText}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}