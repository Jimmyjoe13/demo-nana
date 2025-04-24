import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useChatConfig } from "@/hooks/use-chat-config";

export function TemperatureSlider() {
  const { config, setTemperature } = useChatConfig();
  
  const handleTemperatureChange = (value: number[]) => {
    setTemperature(value[0]);
  };
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor="temperature-slider" className="block font-medium text-sm">Température</Label>
        <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
          {config.temperature.toFixed(1)}
        </span>
      </div>
      <Slider
        id="temperature-slider"
        min={0.1}
        max={1.5}
        step={0.1}
        value={[config.temperature]}
        onValueChange={handleTemperatureChange}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
        <span>Précis (0.1)</span>
        <span>Créatif (1.5)</span>
      </div>
    </div>
  );
}
