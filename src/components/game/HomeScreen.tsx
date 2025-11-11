import { Button } from "@/components/ui/button";
import { Play, HelpCircle } from "lucide-react";
import { useState } from "react";
import HowToPlayModal from "./HowToPlayModal";

interface HomeScreenProps {
  onStart: () => void;
}

const HomeScreen = ({ onStart }: HomeScreenProps) => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="flex flex-col items-center justify-between h-full px-6 py-12">
      <div className="text-center space-y-8 max-w-md">
        <div className="space-y-4">
          <h1 className="font-pixel text-3xl sm:text-4xl text-primary animate-pulse">
            Bitebite
          </h1>
          <h2 className="font-pixel text-xl sm:text-2xl text-secondary">
            Snake
          </h2>
        </div>

        <div className="space-y-3 w-full">
          <Button
            onClick={onStart}
            size="lg"
            className="w-full font-pixel text-base sm:text-lg h-14 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Play className="w-5 h-5 mr-2" />
            Play
          </Button>

          <Button
            onClick={() => setShowHelp(true)}
            variant="outline"
            size="lg"
            className="w-full font-pixel text-sm sm:text-base h-12 border-primary text-primary hover:bg-primary/10"
          >
            <HelpCircle className="w-5 h-5 mr-2" />
            How to Play
          </Button>
        </div>

        <div className="pt-8">
          <div className="flex items-center justify-center gap-4 text-muted-foreground">
            <div className="w-8 h-8 bg-snake rounded" />
            <span className="font-pixel text-xs">+</span>
            <div className="w-8 h-8 bg-apple rounded-full" />
            <span className="font-pixel text-xs">=</span>
            <span className="font-pixel text-sm text-secondary">Score!</span>
          </div>
        </div>
      </div>

      <footer className="text-center text-xs text-muted-foreground space-y-1">
        <p>
          Feedback：<a href="mailto:cs@bitebite.app" className="hover:text-primary transition-colors">cs@bitebite.app</a>
        </p>
        <p>Produced by Merlin Advisory Solution</p>
        <p>© 2025 版權所有</p>
      </footer>

      <HowToPlayModal open={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
};

export default HomeScreen;
