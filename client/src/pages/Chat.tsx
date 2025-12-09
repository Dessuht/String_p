import { useState, useRef, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { ArrowLeft, Send, ShieldCheck, MapPin, ExternalLink, Calendar, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MOCK_USERS, 
  MOCK_MESSAGES, 
  MOCK_MATCHES,
  Message, 
  DateSpot,
  checkMessageThreshold 
} from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { ConnectionKnot } from "@/components/ConnectionKnot";
import { GradingModal } from "@/components/GradingModal";
import { DateSuggestionModal } from "@/components/DateSuggestionModal";
import { StarRating } from "@/components/StarRating";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Chat() {
  const [, params] = useRoute("/chat/:id");
  const [, setLocation] = useLocation();
  const partnerId = params?.id;
  const partner = MOCK_USERS.find(u => u.id === partnerId);
  const currentUser = MOCK_USERS.find(u => u.id === "me");
  const [showGrading, setShowGrading] = useState(false);
  const [showDateSuggestion, setShowDateSuggestion] = useState(false);
  const [showExpiredWarning, setShowExpiredWarning] = useState(false);
  const { toast } = useToast();
  
  const match = MOCK_MATCHES.find(m => 
    m.users.includes("me") && m.users.includes(partnerId || "")
  );

  const [matchState, setMatchState] = useState(match || {
    id: "temp",
    users: ["me", partnerId || ""] as [string, string],
    timestamp: new Date(),
    messageCount: 0,
    user1MessageCount: 0,
    user2MessageCount: 0,
    graded: false,
    knotStatus: "chatting" as const,
    chatExpiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000),
  });

  const [messages, setMessages] = useState<Message[]>(
    MOCK_MESSAGES.filter(m => 
      (m.senderId === "me" && m.receiverId === partnerId) || 
      (m.senderId === partnerId && m.receiverId === "me")
    ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
  );

  const calculateRounds = (msgs: Message[]) => {
    if (msgs.length === 0) return 0;
    let rounds = 0;
    let lastSenderId = msgs[0].senderId;
    
    for (let i = 1; i < msgs.length; i++) {
      if (msgs[i].senderId !== lastSenderId) {
        rounds++;
        lastSenderId = msgs[i].senderId;
      }
    }
    return rounds;
  };

  const rounds = calculateRounds(messages);

  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    if (matchState.knotStatus === "archived") {
      toast({
        title: "Chat Archived",
        description: "This conversation has expired. You can no longer send messages.",
        variant: "destructive"
      });
      return;
    }

    const msg: Message = {
      id: Math.random().toString(),
      senderId: "me",
      receiverId: partnerId || "",
      content: newMessage,
      timestamp: new Date(),
      isRead: false,
      isRepliedTo: false,
      type: "text"
    };

    setMessages([...messages, msg]);
    setNewMessage("");

    setMatchState(prev => ({
      ...prev,
      messageCount: prev.messageCount + 1,
      user1MessageCount: prev.user1MessageCount + 1,
    }));
  };

  const handleTieKnot = () => {
    if (matchState.knotRequestedBy && matchState.knotRequestedBy !== "me") {
      setMatchState(prev => ({
        ...prev,
        knotStatus: "knotted",
        knottedAt: new Date(),
      }));

      toast({
        title: "You're Knotted!",
        description: `You and ${partner?.name} are now permanently connected! +0.1 Star Rating and +50 FP earned.`,
      });

      const systemMsg: Message = {
        id: Math.random().toString(),
        senderId: "system",
        receiverId: "",
        content: `You and ${partner?.name} have tied the knot! Chat is now permanent, and all features are unlocked.`,
        timestamp: new Date(),
        isRead: true,
        isRepliedTo: true,
        type: "system"
      };
      setMessages(prev => [...prev, systemMsg]);
    } else {
      setMatchState(prev => ({
        ...prev,
        knotStatus: "knot_requested",
        knotRequestedBy: "me",
        knotRequestedAt: new Date(),
      }));

      toast({
        title: "Knot Request Sent",
        description: `Waiting for ${partner?.name} to accept your knot request.`,
      });

      setTimeout(() => {
        setMatchState(prev => ({
          ...prev,
          knotStatus: "knotted",
          knottedAt: new Date(),
        }));

        toast({
          title: "They accepted!",
          description: `${partner?.name} has tied the knot with you! +0.1 Star Rating and +50 FP earned.`,
        });

        const systemMsg: Message = {
          id: Math.random().toString(),
          senderId: "system",
          receiverId: "",
          content: `${partner?.name} accepted your knot request! Chat is now permanent, and all features are unlocked.`,
          timestamp: new Date(),
          isRead: true,
          isRepliedTo: true,
          type: "system"
        };
        setMessages(prev => [...prev, systemMsg]);
      }, 2000);
    }
  };

  const handleDateSelect = (spot: DateSpot, dateTime: Date) => {
    setShowDateSuggestion(false);

    const dateMsg: Message = {
      id: Math.random().toString(),
      senderId: "me",
      receiverId: partnerId || "",
      content: "",
      timestamp: new Date(),
      isRead: false,
      isRepliedTo: false,
      type: "date_suggestion",
      dateSuggestion: spot
    };

    setMessages(prev => [...prev, dateMsg]);

    setMatchState(prev => ({
      ...prev,
      scheduledDate: {
        id: Math.random().toString(),
        spotId: spot.id,
        spot: spot,
        scheduledFor: dateTime,
        user1Confirmed: true,
        user2Confirmed: false,
        status: "pending"
      }
    }));

    toast({
      title: "Date Suggested!",
      description: `You've suggested meeting at ${spot.name} on ${dateTime.toLocaleDateString()} at ${dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    });
  };

  const ratingMutation = useMutation({
    mutationFn: async ({ isPositive, reason }: { isPositive: boolean; reason?: string }) => {
      return await apiRequest("POST", "/api/ratings", {
        raterUserId: "me",
        ratedUserId: partnerId,
        isPositive,
        reason,
      });
    },
    onSuccess: (_, variables) => {
      toast({
        title: variables.isPositive ? "Positive rating submitted!" : "Feedback submitted",
        description: variables.isPositive 
          ? "You've earned 5 Fidelity Points for your honest feedback." 
          : "Thank you for helping us maintain community quality.",
      });
      setShowGrading(false);
      queryClient.invalidateQueries({ queryKey: ["/api/users", "me"] });
    },
    onError: () => {
      toast({
        title: "Failed to submit rating",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleRatingSubmit = (isPositive: boolean, reason?: string) => {
    ratingMutation.mutate({ isPositive, reason });
  };

  if (!partner) return <div>User not found</div>;

  const canRequestKnot = checkMessageThreshold(matchState as any);
  const isKnotted = matchState.knotStatus === "knotted" || matchState.knotStatus === "permanently_knotted";

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="bg-white/50 dark:bg-background/50 backdrop-blur-md sticky top-0 z-10 border-b">
        <div className="flex items-center gap-3 p-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/messages")} data-testid="button-back-to-messages">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          
          <div 
            className="flex items-center gap-3 flex-1 cursor-pointer min-w-0"
            onClick={() => setLocation(`/user/${partnerId}`)}
          >
            <Avatar className="w-10 h-10 border border-primary/20">
              <AvatarImage src={partner.avatar} className="object-cover" />
              <AvatarFallback>{partner.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <h2 className="font-semibold truncate">{partner.name}</h2>
                {partner.isVerified && <ShieldCheck className="w-3 h-3 text-blue-400" />}
              </div>
              <p className="text-xs text-muted-foreground truncate">Active now</p>
            </div>
          </div>

          <StarRating 
            rating={partner.starRating} 
            totalRatings={partner.totalRatingsReceived}
            size="sm"
            className="shrink-0"
          />
        </div>

        <ConnectionKnot 
          messageCount={rounds}
          user1MessageCount={matchState.user1MessageCount}
          user2MessageCount={matchState.user2MessageCount}
          knotStatus={matchState.knotStatus}
          chatExpiresAt={matchState.chatExpiresAt}
          onGradeUnlock={() => setShowGrading(true)}
          onTieKnot={handleTieKnot}
          onSuggestDate={() => setShowDateSuggestion(true)}
          canRequestKnot={canRequestKnot}
          knotRequestedBy={matchState.knotRequestedBy}
          currentUserId="me"
        />
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="text-center text-xs text-muted-foreground py-4">
          You matched with {partner.name} on {new Date(matchState.timestamp).toLocaleDateString()}
        </div>

        {partner.deepDivePrompts && partner.deepDivePrompts.length > 0 && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-3">
              <p className="text-xs font-medium text-primary mb-2">Conversation Starter</p>
              <p className="text-sm italic text-muted-foreground">"{partner.deepDivePrompts[0].prompt}"</p>
              <p className="text-sm mt-1">"{partner.deepDivePrompts[0].answer}"</p>
            </CardContent>
          </Card>
        )}
        
        {messages.map((msg) => {
          const isMe = msg.senderId === "me";
          const isSystem = msg.type === "system";
          const isDateSuggestion = msg.type === "date_suggestion";

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center">
                <div className="bg-muted/50 text-muted-foreground text-xs px-4 py-2 rounded-full max-w-[80%] text-center">
                  {msg.content}
                </div>
              </div>
            );
          }

          if (isDateSuggestion && msg.dateSuggestion) {
            const spot = msg.dateSuggestion;
            return (
              <div 
                key={msg.id} 
                className={cn(
                  "flex w-full",
                  isMe ? "justify-end" : "justify-start"
                )}
              >
                <Card className={cn(
                  "max-w-[85%]",
                  isMe ? "bg-primary/10 border-primary/20" : "bg-muted"
                )}>
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Date Suggestion</span>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-16 h-16 rounded-md overflow-hidden shrink-0">
                        <img src={spot.imageUrl} alt={spot.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm">{spot.name}</h4>
                        <p className="text-xs text-muted-foreground">{spot.address}</p>
                        <Badge variant="secondary" className="mt-1 text-xs">{spot.category}</Badge>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-3 gap-2"
                      onClick={() => window.open(spot.mapUrl, '_blank')}
                      data-testid={`button-view-map-${spot.id}`}
                    >
                      <ExternalLink className="w-3 h-3" />
                      View on Map
                    </Button>
                    {matchState.scheduledDate && (
                      <div className="mt-2 p-2 bg-background/50 rounded-md flex items-center gap-2 text-xs">
                        <Calendar className="w-3 h-3 text-primary" />
                        <span>
                          {new Date(matchState.scheduledDate.scheduledFor).toLocaleDateString()} at {new Date(matchState.scheduledDate.scheduledFor).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          }

          return (
            <div 
              key={msg.id} 
              className={cn(
                "flex w-full",
                isMe ? "justify-end" : "justify-start"
              )}
            >
              <div 
                className={cn(
                  "max-w-[75%] px-4 py-2.5 rounded-2xl text-sm",
                  isMe 
                    ? "bg-primary text-primary-foreground rounded-br-sm" 
                    : "bg-muted text-foreground rounded-bl-sm"
                )}
              >
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-background border-t">
        {matchState.knotStatus === "archived" ? (
          <div className="flex items-center justify-center gap-2 text-muted-foreground py-2">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">This chat has been archived</span>
          </div>
        ) : (
          <div className="flex gap-2 items-center bg-muted/50 rounded-full px-4 py-2 border focus-within:border-primary/50 transition-colors">
            <Input 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..." 
              className="border-none bg-transparent shadow-none focus-visible:ring-0 p-0 h-auto"
              data-testid="input-chat-message"
            />
            <Button 
              size="icon" 
              className="rounded-full w-8 h-8 shrink-0" 
              onClick={handleSend}
              disabled={!newMessage.trim()}
              data-testid="button-send-message"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {showGrading && (
        <GradingModal 
          isOpen={showGrading} 
          onClose={() => setShowGrading(false)}
          partnerName={partner.name}
          onSubmit={handleRatingSubmit}
          isSubmitting={ratingMutation.isPending}
        />
      )}

      <DateSuggestionModal
        isOpen={showDateSuggestion}
        onClose={() => setShowDateSuggestion(false)}
        onSelect={handleDateSelect}
      />

      <AlertDialog open={showExpiredWarning} onOpenChange={setShowExpiredWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Chat Expired</AlertDialogTitle>
            <AlertDialogDescription>
              This conversation has expired because the knot wasn't tied within 72 hours.
              Both users have received a -0.1 Star Rating penalty and lost 20 FP.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setLocation("/messages")}>
              Back to Messages
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
