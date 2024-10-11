import { Button } from "@/components/ui/button";
import Particles from "@/components/ui/particles";

export default function App() {
  return (
    <>
      <Particles className="h-screen w-screen bg-black relative"></Particles>
      <div className="absolute inset-0 text-white z-10 p-5 text-center ">
        VAIBHAV READY FOR SETUP
      </div>
      <div className="absolute inset-0 text-3xl m-5 text-yellow-500 z-10 p-5 text-center">
        FLUXDOCS
      </div>
    </>
  );
}
