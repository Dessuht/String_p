import { useState } from "react";
import { MapPin, Star, DollarSign, Navigation, Check, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DateSpot, MOCK_DATE_SPOTS } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface DateSuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (spot: DateSpot, dateTime: Date) => void;
}

export function DateSuggestionModal({ isOpen, onClose, onSelect }: DateSuggestionModalProps) {
  const [selectedSpot, setSelectedSpot] = useState<DateSpot | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [step, setStep] = useState<"select" | "schedule">("select");

  const spots = MOCK_DATE_SPOTS;

  const getPriceLevelDisplay = (level: number) => {
    return Array(level).fill("$").join("");
  };

  const handleSpotSelect = (spot: DateSpot) => {
    setSelectedSpot(spot);
    setStep("schedule");
  };

  const handleSchedule = () => {
    if (!selectedSpot || !selectedDate || !selectedTime) return;
    
    const dateTime = new Date(`${selectedDate}T${selectedTime}`);
    onSelect(selectedSpot, dateTime);
    
    setSelectedSpot(null);
    setSelectedDate("");
    setSelectedTime("");
    setStep("select");
  };

  const handleBack = () => {
    setStep("select");
    setSelectedSpot(null);
  };

  const handleClose = () => {
    setStep("select");
    setSelectedSpot(null);
    setSelectedDate("");
    setSelectedTime("");
    onClose();
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            {step === "select" ? "Suggest a Date Spot" : "Schedule Your Date"}
          </DialogTitle>
          <DialogDescription>
            {step === "select" 
              ? "Public places perfect for a first meeting. All locations are highly rated and conversation-friendly."
              : `Confirm the date and time to meet at ${selectedSpot?.name}`
            }
          </DialogDescription>
        </DialogHeader>

        {step === "select" ? (
          <div className="space-y-3 mt-2">
            {spots.map((spot) => (
              <Card 
                key={spot.id} 
                className={cn(
                  "cursor-pointer transition-all hover-elevate",
                  selectedSpot?.id === spot.id && "ring-2 ring-primary"
                )}
                onClick={() => handleSpotSelect(spot)}
                data-testid={`card-date-spot-${spot.id}`}
              >
                <CardContent className="p-3">
                  <div className="flex gap-3">
                    <div className="w-20 h-20 rounded-md overflow-hidden shrink-0">
                      <img 
                        src={spot.imageUrl} 
                        alt={spot.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold truncate">{spot.name}</h3>
                        <Badge variant="secondary" className="shrink-0 text-xs">
                          {spot.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          {spot.rating}
                        </span>
                        <span className="flex items-center gap-0.5 text-green-600">
                          {getPriceLevelDisplay(spot.priceLevel)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Navigation className="w-3 h-3" />
                          {spot.distance} km
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {spot.address}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4 mt-2">
            <Card>
              <CardContent className="p-3">
                <div className="flex gap-3">
                  <div className="w-16 h-16 rounded-md overflow-hidden shrink-0">
                    <img 
                      src={selectedSpot?.imageUrl} 
                      alt={selectedSpot?.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{selectedSpot?.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedSpot?.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  Date
                </Label>
                <Input 
                  id="date"
                  type="date" 
                  value={selectedDate}
                  min={minDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  data-testid="input-date"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time" className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  Time
                </Label>
                <Input 
                  id="time"
                  type="time" 
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  data-testid="input-time"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={handleBack} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={handleSchedule} 
                className="flex-1"
                disabled={!selectedDate || !selectedTime}
                data-testid="button-schedule-date"
              >
                <Check className="w-4 h-4 mr-2" />
                Share in Chat
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
