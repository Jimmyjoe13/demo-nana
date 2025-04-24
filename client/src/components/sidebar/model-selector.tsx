import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useChatConfig } from "@/hooks/use-chat-config";

const models = [
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
  { id: "gpt-4", name: "GPT-4" },
  { id: "gpt-4o", name: "GPT-4o" },
  { id: "claude-v1", name: "Claude (via Ollama)" },
  { id: "llama2", name: "Llama 2 (via Ollama)" }
];

export function ModelSelector() {
  const { config, setModel } = useChatConfig();
  
  const handleModelChange = (value: string) => {
    setModel(value);
  };
  
  return (
    <div className="space-y-2">
      <Label htmlFor="model-select" className="block font-medium text-sm">Modèle</Label>
      <Select value={config.model} onValueChange={handleModelChange}>
        <SelectTrigger id="model-select" className="w-full">
          <SelectValue placeholder="Sélectionner un modèle" />
        </SelectTrigger>
        <SelectContent>
          {models.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              {model.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
