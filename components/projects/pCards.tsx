import { Switch } from "../ui/switch";

function PCards() {
  return (
    <div
      className="  rounded-lg p-2 w-[10rem] h-[10rem] flex flex-col justify-between shadow-[0px_4px_17px_0px_#fffbeb]"
    >
      <div className="flex justify-between items-baseline ">
        <div className="border border-border rounded-md w-[2rem] h-[2rem] flex justify-center items-center">
          J
        </div>
        <div className="flex items-end">
          <Switch />
        </div>
      </div>
      <div className="flex justify-around items-baseline ">
        <div>Joseph dffdffddffdfd ererrrgr</div>
      </div>
    </div>
  );
}

export default PCards;
