import { useState } from "react";
import { Calendar, CheckCircle, XCircle, Heart, AlertTriangle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DateFeedback, ScheduledDate } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface DateFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: DateFeedback) => void;
  partnerName: string;
  scheduledDate: ScheduledDate;
}

type FeedbackOutcome = "planning_another" | "tie_permanently" | "not_interested" | "no_show_reported";

export function DateFeedbackModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  partnerName,
  scheduledDate 
}: DateFeedbackModalProps) {
  const [step, setStep] = useState<"attendance" | "outcome" | "comments">("attendance");
  const [attended, setAttended] = useState<boolean | null>(null);
  const [partnerAttended, setPartnerAttended] = useState<boolean | null>(null);
  const [outcome, setOutcome] = useState<FeedbackOutcome | null>(null);
  const [comments, setComments] = useState("");

  const handleAttendanceNext = () => {
    if (attended === null || partnerAttended === null) return;
    
    if (!partnerAttended && attended) {
      setOutcome("no_show_reported");
      setStep("comments");
    } else if (attended && partnerAttended) {
      setStep("outcome");
    } else {
      setStep("comments");
    }
  };

  const handleOutcomeNext = () => {
    if (!outcome) return;
    setStep("comments");
  };

  const handleSubmit = () => {
    if (attended === null || partnerAttended === null) return;

    const feedback: DateFeedback = {
      attended,
      partnerAttended,
      outcome: outcome || "not_interested",
      comments: comments.trim() || undefined,
      submittedAt: new Date()
    };

    onSubmit(feedback);
    resetAndClose();
  };

  const resetAndClose = () => {
    setStep("attendance");
    setAttended(null);
    setPartnerAttended(null);
    setOutcome(null);
    setComments("");
    onClose();
  };

  const outcomeOptions = [
    { 
      value: "planning_another" as FeedbackOutcome, 
      label: "We're planning another date", 
      icon: Calendar,
      description: "Great connection, want to see them again"
    },
    { 
      value: "tie_permanently" as FeedbackOutcome, 
      label: "Ready to tie the knot permanently", 
      icon: Heart,
      description: "This could be something special"
    },
    { 
      value: "not_interested" as FeedbackOutcome, 
      label: "Not interested in continuing", 
      icon: XCircle,
      description: "No hard feelings, just not a match"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            How was your date?
          </DialogTitle>
          <DialogDescription>
            {step === "attendance" && `Did you meet with ${partnerName} at ${scheduledDate.spot.name}?`}
            {step === "outcome" && "What's the next step?"}
            {step === "comments" && "Any additional feedback?"}
          </DialogDescription>
        </DialogHeader>

        {step === "attendance" && (
          <div className="space-y-4 mt-2">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Did you attend the date?</Label>
              <div className="grid grid-cols-2 gap-3">
                <Card 
                  className={cn(
                    "cursor-pointer transition-all",
                    attended === true && "ring-2 ring-primary bg-primary/5"
                  )}
                  onClick={() => setAttended(true)}
                  data-testid="button-i-attended"
                >
                  <CardContent className="p-4 flex flex-col items-center gap-2">
                    <CheckCircle className={cn(
                      "w-8 h-8",
                      attended === true ? "text-primary" : "text-muted-foreground"
                    )} />
                    <span className="text-sm font-medium">Yes, I attended</span>
                  </CardContent>
                </Card>
                <Card 
                  className={cn(
                    "cursor-pointer transition-all",
                    attended === false && "ring-2 ring-destructive bg-destructive/5"
                  )}
                  onClick={() => setAttended(false)}
                  data-testid="button-i-did-not-attend"
                >
                  <CardContent className="p-4 flex flex-col items-center gap-2">
                    <XCircle className={cn(
                      "w-8 h-8",
                      attended === false ? "text-destructive" : "text-muted-foreground"
                    )} />
                    <span className="text-sm font-medium">No, I didn't</span>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Did {partnerName} attend?</Label>
              <div className="grid grid-cols-2 gap-3">
                <Card 
                  className={cn(
                    "cursor-pointer transition-all",
                    partnerAttended === true && "ring-2 ring-primary bg-primary/5"
                  )}
                  onClick={() => setPartnerAttended(true)}
                  data-testid="button-partner-attended"
                >
                  <CardContent className="p-4 flex flex-col items-center gap-2">
                    <CheckCircle className={cn(
                      "w-8 h-8",
                      partnerAttended === true ? "text-primary" : "text-muted-foreground"
                    )} />
                    <span className="text-sm font-medium">Yes</span>
                  </CardContent>
                </Card>
                <Card 
                  className={cn(
                    "cursor-pointer transition-all",
                    partnerAttended === false && "ring-2 ring-destructive bg-destructive/5"
                  )}
                  onClick={() => setPartnerAttended(false)}
                  data-testid="button-partner-did-not-attend"
                >
                  <CardContent className="p-4 flex flex-col items-center gap-2">
                    <XCircle className={cn(
                      "w-8 h-8",
                      partnerAttended === false ? "text-destructive" : "text-muted-foreground"
                    )} />
                    <span className="text-sm font-medium">No</span>
                  </CardContent>
                </Card>
              </div>
            </div>

            {partnerAttended === false && attended === true && (
              <Card className="bg-destructive/10 border-destructive/20">
                <CardContent className="p-3 flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-destructive">No-show reported</p>
                    <p className="text-muted-foreground">
                      {partnerName} will receive a -0.3 Star Rating penalty and lose 50 FP for not showing up.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {attended === false && (
              <Card className="bg-destructive/10 border-destructive/20">
                <CardContent className="p-3 flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-destructive">You didn't attend</p>
                    <p className="text-muted-foreground">
                      You will receive a -0.3 Star Rating penalty and lose 50 FP for not showing up.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Button 
              className="w-full" 
              onClick={handleAttendanceNext}
              disabled={attended === null || partnerAttended === null}
              data-testid="button-attendance-next"
            >
              Continue
            </Button>
          </div>
        )}

        {step === "outcome" && (
          <div className="space-y-4 mt-2">
            <RadioGroup 
              value={outcome || ""} 
              onValueChange={(v) => setOutcome(v as FeedbackOutcome)}
              className="space-y-3"
            >
              {outcomeOptions.map((option) => (
                <Card 
                  key={option.value}
                  className={cn(
                    "cursor-pointer transition-all",
                    outcome === option.value && "ring-2 ring-primary bg-primary/5"
                  )}
                  onClick={() => setOutcome(option.value)}
                  data-testid={`option-outcome-${option.value}`}
                >
                  <CardContent className="p-4 flex items-center gap-3">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <option.icon className={cn(
                      "w-5 h-5",
                      outcome === option.value ? "text-primary" : "text-muted-foreground"
                    )} />
                    <div className="flex-1">
                      <Label htmlFor={option.value} className="text-sm font-medium cursor-pointer">
                        {option.label}
                      </Label>
                      <p className="text-xs text-muted-foreground">{option.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </RadioGroup>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep("attendance")} className="flex-1">
                Back
              </Button>
              <Button 
                className="flex-1" 
                onClick={handleOutcomeNext}
                disabled={!outcome}
                data-testid="button-outcome-next"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === "comments" && (
          <div className="space-y-4 mt-2">
            {outcome === "no_show_reported" && (
              <Card className="bg-destructive/10 border-destructive/20">
                <CardContent className="p-3">
                  <p className="text-sm font-medium text-destructive">No-show will be reported</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {partnerName} will receive penalties for not showing up. Please provide any details below.
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="space-y-2">
              <Label htmlFor="comments">Additional comments (optional)</Label>
              <Textarea 
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Share any details about your date experience..."
                className="min-h-[100px] resize-none"
                data-testid="input-feedback-comments"
              />
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => outcome === "no_show_reported" ? setStep("attendance") : setStep("outcome")} 
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                className="flex-1" 
                onClick={handleSubmit}
                data-testid="button-submit-feedback"
              >
                Submit Feedback
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
