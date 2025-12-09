import { useState, useRef, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { ArrowLeft, Send, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { MOCK_USERS, MOCK_MESSAGES, Message } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { ConnectionKnot } from "@/components/ConnectionKnot";
import { GradingModal } from "@/components/GradingModal";
import { StarRating } from "@/components/StarRating";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Chat() {
  const [, params] = useRoute("/chat/:id");
  const [, setLocation] = useLocation();
  const partnerId = params?.id;
  const partner = MOCK_USERS.find(u => u.id === partnerId);
  const [showGrading, setShowGrading] = useState(false);
  const { toast } = useToast();
  
  // Initialize with mock messages for this conversation
  const [messages, setMessages] = useState<Message[]>(
    MOCK_MESSAGES.filter(m => 
      (m.senderId === "me" && m.receiverId === partnerId) || 
      (m.senderId === partnerId && m.receiverId === "me")
    ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
  );

  // Calculate conversation rounds (exchanges)
  // A round is completed when the sender switches.
  // Example: A -> B (1 round), B -> A (2 rounds), A -> A (2 rounds), A -> B (3 rounds)
  const calculateRounds = (msgs: Message[]) => {
    if (msgs.length === 0) return 0;
    let rounds = 0;
    let lastSenderId = msgs[0].senderId;
    
    // Start counting from the second message
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

    const msg: Message = {
      id: Math.random().toString(),
      senderId: "me",
      receiverId: partnerId || "",
      content: newMessage,
      timestamp: new Date(),
      isRead: false,
      isRepliedTo: false,
    };

    setMessages([...messages, msg]);
    setNewMessage("");
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

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="bg-white/50 backdrop-blur-md sticky top-0 z-10 border-b">
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

        {/* The Connection Knot Progress Bar */}
        <ConnectionKnot 
          messageCount={rounds} 
          onGradeUnlock={() => setShowGrading(true)}
        />
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="text-center text-xs text-muted-foreground py-4">
          You matched with {partner.name} on {new Date().toLocaleDateString()}
        </div>
        
        {messages.map((msg) => {
          const isMe = msg.senderId === "me";
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

      {/* Input Area */}
      <div className="p-4 bg-background border-t">
        <div className="flex gap-2 items-center bg-muted/50 rounded-full px-4 py-2 border focus-within:border-primary/50 transition-colors">
          <Input 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..." 
            className="border-none bg-transparent shadow-none focus-visible:ring-0 p-0 h-auto"
          />
          <Button 
            size="icon" 
            className="rounded-full w-8 h-8 shrink-0" 
            onClick={handleSend}
            disabled={!newMessage.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Rating Modal */}
      {showGrading && (
        <GradingModal 
          isOpen={showGrading} 
          onClose={() => setShowGrading(false)}
          partnerName={partner.name}
          onSubmit={handleRatingSubmit}
          isSubmitting={ratingMutation.isPending}
        />
      )}
    </div>
  );
}
