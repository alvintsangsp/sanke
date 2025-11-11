import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface HowToPlayModalProps {
  open: boolean;
  onClose: () => void;
}

const HowToPlayModal = ({ open, onClose }: HowToPlayModalProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-pixel text-lg text-card-foreground">
            {t("howToPlayTitle")}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <p className="text-sm leading-relaxed text-card-foreground">
            {t("howToPlayDesc1")}
          </p>
          
          <p className="text-sm leading-relaxed text-card-foreground">
            {t("howToPlayDesc2")}
          </p>

          <div className="bg-muted/30 p-4 rounded-lg">
            <p className="text-xs font-pixel mb-3 text-muted-foreground">{t("controls")}</p>
            <div className="grid grid-cols-3 gap-2 w-fit mx-auto">
              <div className="col-start-2 flex justify-center">
                <div className="w-10 h-10 bg-primary/20 border border-primary rounded flex items-center justify-center">
                  <ArrowUp className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-10 h-10 bg-primary/20 border border-primary rounded flex items-center justify-center">
                  <ArrowLeft className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-10 h-10 bg-primary/20 border border-primary rounded flex items-center justify-center">
                  <ArrowDown className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-10 h-10 bg-primary/20 border border-primary rounded flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-primary" />
                </div>
              </div>
            </div>
            <p className="text-xs text-center mt-3 text-muted-foreground">
              {t("swipeDirection")}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HowToPlayModal;
