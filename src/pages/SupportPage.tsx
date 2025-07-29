import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  HeadphonesIcon, 
  Send, 
  MessageSquare, 
  Clock, 
  CheckCircle,
  XCircle,
  Pause,
  StickyNote
} from "lucide-react";
import { cn } from "@/lib/utils";

const supportTickets = [
  {
    id: 1,
    marketerName: "أحمد محمد العالي",
    subject: "دعم",
    lastMessage: "لدي مشكلة في الرصيد",
    timestamp: "منذ دقيقتين",
    status: "مفتوحة",
    unread: true
  },
  {
    id: 2,
    marketerName: "سارة أحمد الزهراني",
    subject: "شكوى",
    lastMessage: "لم أحصل على عمولتي",
    timestamp: "منذ ساعة",
    status: "معلقة",
    unread: false
  },
  {
    id: 3,
    marketerName: "محمد علي القحطاني",
    subject: "استفسار",
    lastMessage: "كيف أحدث بياناتي؟",
    timestamp: "أمس",
    status: "مكتملة",
    unread: false
  },
  {
    id: 4,
    marketerName: "فاطمة عبدالله النجار",
    subject: "دعم تقني",
    lastMessage: "التطبيق لا يعمل بشكل صحيح",
    timestamp: "2024-01-15",
    status: "مغلقة",
    unread: false
  }
];

const chatMessages = [
  {
    id: 1,
    sender: "system",
    content: "سبب التواصل: دعم",
    timestamp: "اليوم 02:30 ص",
    isOld: false
  },
  {
    id: 2,
    sender: "marketer",
    content: "السلام عليكم، لدي مشكلة في الرصيد. الرصيد لا يظهر بشكل صحيح في حسابي",
    timestamp: "اليوم 02:32 ص",
    isOld: false
  },
  {
    id: 3,
    sender: "internal_note",
    content: "العميل لديه مشكلة في الرصيد، يجب مراجعة الحساب",
    timestamp: "اليوم 02:33 ص",
    isOld: false
  },
  {
    id: 4,
    sender: "admin",
    content: "وعليكم السلام، سوف أقوم بمراجعة حسابك الآن",
    timestamp: "اليوم 02:35 ص",
    isOld: false
  },
  {
    id: 5,
    sender: "marketer",
    content: "شكرًا لكم",
    timestamp: "اليوم 02:36 ص",
    isOld: false
  }
];

const statusColors = {
  "مفتوحة": "bg-green-500/10 text-green-700 border-green-200",
  "معلقة": "bg-yellow-500/10 text-yellow-700 border-yellow-200",
  "مكتملة": "bg-blue-500/10 text-blue-700 border-blue-200",
  "مغلقة": "bg-gray-500/10 text-gray-700 border-gray-200"
};

const statusIcons = {
  "مفتوحة": CheckCircle,
  "معلقة": Pause,
  "مكتملة": CheckCircle,
  "مغلقة": XCircle
};

export default function SupportPage() {
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [newNote, setNewNote] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("مفتوحة");

  const selectedTicketData = supportTickets.find(ticket => ticket.id === selectedTicket);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // هنا يتم إرسال الرسالة
      setNewMessage("");
    }
  };

  const handleSendNote = () => {
    if (newNote.trim()) {
      // هنا يتم إرسال الملاحظة الداخلية
      setNewNote("");
      setShowNoteInput(false);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    setCurrentStatus(newStatus);
    // هنا يتم تحديث الحالة في قاعدة البيانات
  };

  if (selectedTicket) {
    return (
      <div className="h-[calc(100vh-8rem)] flex flex-col">
        {/* Header */}
        <div className="bg-card border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedTicket(null)}
                className="p-2"
              >
                ←
              </Button>
              <Avatar>
                <AvatarFallback>
                  {selectedTicketData?.marketerName.split(' ')[0][0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{selectedTicketData?.marketerName}</h3>
                <p className="text-sm text-muted-foreground">مسوق</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge className={statusColors[currentStatus as keyof typeof statusColors]}>
                {currentStatus}
              </Badge>
              <div className="flex gap-1">
                {Object.keys(statusColors).map((status) => {
                  const Icon = statusIcons[status as keyof typeof statusIcons];
                  return (
                    <Button
                      key={status}
                      variant={currentStatus === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStatusChange(status)}
                      className="h-8"
                    >
                      <Icon className="h-3 w-3 ml-1" />
                      {status}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.map((message) => (
            <div key={message.id} className={cn(
              "flex",
              message.sender === "admin" ? "justify-end" : 
              message.sender === "internal_note" ? "justify-center" : "justify-start"
            )}>
              <div className={cn(
                "max-w-xs lg:max-w-md px-4 py-2 rounded-lg",
                message.sender === "system" 
                  ? "bg-muted text-center w-full max-w-none text-sm"
                  : message.sender === "internal_note"
                  ? "bg-orange-100 border-l-4 border-orange-500 text-orange-800 w-full max-w-none"
                  : message.sender === "admin"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted",
                message.isOld && "opacity-60"
              )}>
                {message.sender === "internal_note" && (
                  <div className="flex items-center gap-2 mb-1">
                    <StickyNote className="h-4 w-4" />
                    <span className="text-xs font-medium">ملاحظة للفريق الداخلي</span>
                  </div>
                )}
                <p className="text-sm">{message.content}</p>
                <p className={cn(
                  "text-xs mt-1",
                  message.sender === "admin" ? "text-primary-foreground/70" : 
                  message.sender === "internal_note" ? "text-orange-600" : "text-muted-foreground"
                )}>
                  {message.timestamp}
                  {message.isOld && " (محادثة قديمة)"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="border-t p-4 space-y-3">
          {/* ملاحظة داخلية */}
          {showNoteInput && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <StickyNote className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">ملاحظة للفريق الداخلي</span>
              </div>
              <div className="flex gap-2">
                <Input
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="اكتب ملاحظة للفريق الداخلي..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendNote()}
                  className="flex-1 bg-white"
                />
                <Button onClick={handleSendNote} disabled={!newNote.trim()} size="sm">
                  <Send className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowNoteInput(false)}
                  size="sm"
                >
                  إلغاء
                </Button>
              </div>
            </div>
          )}
          
          {/* رسالة عادية */}
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="اكتب رسالتك هنا..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button 
              variant="outline" 
              onClick={() => setShowNoteInput(!showNoteInput)}
              className="text-orange-600 border-orange-200 hover:bg-orange-50"
            >
              <StickyNote className="h-4 w-4" />
            </Button>
            <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">الدعم الفني</h1>
        <p className="text-muted-foreground mt-1">إدارة رسائل الدعم والتواصل مع المسوقين</p>
      </div>

      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HeadphonesIcon className="h-5 w-5" />
            رسائل الدعم
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {supportTickets.map((ticket) => {
              const StatusIcon = statusIcons[ticket.status as keyof typeof statusIcons];
              return (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket.id)}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors",
                    "hover:bg-muted/50",
                    ticket.unread && "bg-muted/30 border-primary/20"
                  )}
                >
                  <Avatar>
                    <AvatarFallback>
                      {ticket.marketerName.split(' ')[0][0]}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium truncate">{ticket.marketerName}</h4>
                      {ticket.unread && (
                        <div className="h-2 w-2 bg-primary rounded-full" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {ticket.subject}: {ticket.lastMessage}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {ticket.timestamp}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={statusColors[ticket.status as keyof typeof statusColors]}>
                      <StatusIcon className="h-3 w-3 ml-1" />
                      {ticket.status}
                    </Badge>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}