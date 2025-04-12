import { Switch } from "../ui/switch";

export default function ProjectsCards() {
  return (
    <div className="border border-border h-45 w-45 rounded-lg bg-amber-200 shadow-blue-500/50 p-2">
      <div className="f">Ceptra</div>
      <div className="text-border">this is where description goes</div>
      <div>
      <Switch />
      </div>
    </div>
  );
}
