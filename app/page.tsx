import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col">
      <p className="text-3xl">
        Hello class
      </p>
      <Button variant={"secondary"}>
        Click me
      </Button>              
    </div>
  );
}