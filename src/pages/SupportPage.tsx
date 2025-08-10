import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  HeadphonesIcon, 
  Send, 
  MessageSquare, 
  Clock, 
  // CheckCircle,
  // XCircle,
  // Pause,
  StickyNote,
  Loader2,
  Trash2,
  MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";
import { messaging, onMessage } from "@/hooks/firebase copy";
import { toast } from "sonner";
import { GetMesaages, Getchats, SendMessage, deleteMessage, deleteChate } from "@/services/userService";

interface Chat {
  user: {
    id: number;
    name: string;
    email: string;
    image: string;
  };
  last_message: {
    id: number;
    message: string;
    is_mine: boolean;
    created_since: string;
    is_read: boolean;
  };
}

interface Message {
  id: number;
  message: string;
  is_mine: boolean;
  created_since: string;
  is_read: boolean;
  is_note?: boolean;
  isPending?: boolean;
  isFailed?: boolean;
}

// interface MessagesResponse {
//   status: boolean;
//   code: number;
//   message: string;
//   data: Message[];
//   meta: {
//     total: number;
//     current_page: number;
//     per_page: number;
//     last_page: number;
//   };
// }

// const statusColors = {
//   "مفتوحة": "bg-green-500/10 text-green-700 border-green-200",
//   "معلقة": "bg-yellow-500/10 text-yellow-700 border-yellow-200",
//   "مكتملة": "bg-blue-500/10 text-blue-700 border-blue-200",
//   "مغلقة": "bg-gray-500/10 text-gray-700 border-gray-200"
// };

// const statusIcons = {
//   "مفتوحة": CheckCircle,
//   "معلقة": Pause,
//   "مكتملة": CheckCircle,
//   "مغلقة": XCircle
// };

export default function SupportPage() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [newNote, setNewNote] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);
  // const [currentStatus, setCurrentStatus] = useState("مفتوحة");
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  // const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 10,
    total: 0,
    lastPage: 1,
    hasMore: false
  });
  const [displayedMessageCount, setDisplayedMessageCount] = useState(10);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedChatData = chats.find(chat => chat.user.id === selectedChat);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || isSending) return;

    setIsSending(true);
    
    const tempMsg: Message = {
      id: Date.now(),
      message: newMessage,
      is_mine: true,
      created_since: "جاري الإرسال...",
      is_read: false,
      isPending: true
    };
    
    setMessages(prev => [...prev, tempMsg]);
    setNewMessage("");
    
    try {
      const response = await SendMessage({
        customer_id: selectedChat,
        message: newMessage
      });
      
      if (response.status && response.data) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === tempMsg.id 
              ? { 
                  ...(response.data as Message), 
                  is_mine: true,
                  created_since: "الآن" 
                }
              : msg
          )
        );
        
        await fetchMessages(selectedChat.toString(), 1);
        await fetchChats();
      } else {
        throw new Error(response.message || "Failed to send message");
      }
    } catch (error: any) {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempMsg.id 
            ? { 
                ...msg, 
                created_since: "فشل الإرسال", 
                isFailed: true 
              }
            : msg
        )
      );
      toast.error("فشل إرسال الرسالة: " + (error.message || "حدث خطأ"));
    } finally {
      setIsSending(false);
      scrollToBottom();
    }
  };

  const handleSendNote = async () => {
    if (!newNote.trim() || !selectedChat || isSending) return;

    setIsSending(true);
    
    const tempNote: Message = {
      id: Date.now(),
      message: newNote,
      is_mine: false,
      created_since: "جاري الإرسال...",
      is_read: true,
      is_note: true,
      isPending: true
    };
    
    setMessages(prev => [...prev, tempNote]);
    setNewNote("");
    setShowNoteInput(false);
    
    try {
      const response = await SendMessage({
        customer_id: selectedChat,
        message: newNote,
        is_note: true
      });
      
      if (response.status && response.data) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === tempNote.id 
              ? { 
                  ...(response.data as Message), 
                  is_note: true,
                  created_since: "الآن"
                }
              : msg
          )
        );
      } else {
        throw new Error(response.message || "Failed to send note");
      }
    } catch (error: any) {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempNote.id 
            ? { 
                ...msg, 
                created_since: "فشل الإرسال", 
                isFailed: true 
              }
            : msg
        )
      );
      toast.error("فشل إرسال الملاحظة: " + (error.message || "حدث خطأ"));
    } finally {
      setIsSending(false);
      scrollToBottom();
    }
  };

  // const handleStatusChange = (newStatus: string) => {
  //   setCurrentStatus(newStatus);
  // };

  const fetchChats = async () => {
    try {
      const response = await Getchats();
      if (Array.isArray(response.data)) {
        setChats(response.data.sort((a, b) => b.last_message.id - a.last_message.id));
      } else {
        setChats([]);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
      toast.error("فشل تحميل المحادثات");
    }
  };

 // ... (بقية الواردات تبقى كما هي)

const fetchMessages = async (userId: string, page: number = 1) => {
  try {
    const response = await GetMesaages(userId, { per_page: 10, page });
    if (response && response.status && Array.isArray(response.data)) {
      if (page === 1) {
        // الصفحة الأولى - نعرض أحدث الرسائل
        setMessages(response.data);
        setDisplayedMessageCount(response.data.length);
      } else {
        // الصفحات التالية - نضيف الرسائل الأقدم في الأعلى
        if (Array.isArray(response.data)) {
          const messagesArray = response.data as typeof messages;
          setMessages(prev => [...messagesArray, ...prev]);
          setDisplayedMessageCount(prev => prev + messagesArray.length);
        } else {
          // إذا لم تكن البيانات مصفوفة، لا تقم بتغيير الرسائل أو العدد
        }
      }
      
      if (response.meta) {
        setPagination({
          currentPage: response.meta.current_page,
          perPage: response.meta.per_page,
          total: response.meta.total,
          lastPage: response.meta.last_page,
          hasMore: response.meta.current_page < response.meta.last_page
        });
      }
      
      if (page === 1) {
        setTimeout(scrollToBottom, 100);
      }
    } else {
      setMessages([]);
      setDisplayedMessageCount(0);
    }
  } catch (error) {
    console.error("Error fetching messages:", error);
    toast.error("فشل تحميل الرسائل");
  }
};

// ... (بقية الكود يبقى كما هو)

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const response = await deleteMessage(messageId.toString());
      if (response.status) {
        toast.success("تم حذف الرسالة بنجاح");
        setMessages(prev => prev.filter(msg => msg.id.toString() !== messageId));
        setDisplayedMessageCount(prev => prev - 1);
      } else {
        throw new Error(response.message || "Failed to delete message");
      }
    } catch (error: any) {
      toast.error("فشل حذف الرسالة: " + (error.message || "حدث خطأ"));
    }
  };

  const handleDeleteChat = async () => {
    if (!selectedChat) return;
    
    try {
      const response = await deleteChate(selectedChat.toString());
      if (response.status) {
        toast.success("تم حذف المحادثة بنجاح");
        setSelectedChat(null);
        fetchChats();
      } else {
        throw new Error(response.message || "Failed to delete chat");
      }
    } catch (error: any) {
      toast.error("فشل حذف المحادثة: " + (error.message || "حدث خطأ"));
    }
  };

  const handleLoadMoreMessages = () => {
    const nextPage = pagination.currentPage + 1;
    if (selectedChat) {
      fetchMessages(selectedChat.toString(), nextPage);
    }
  };

  useEffect(() => {
    fetchChats();
    
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("New message notification:", payload);
      const { title, body } = payload.notification ?? {};
      toast(`${title}\n${body}`);
      fetchChats();
      if (selectedChat) fetchMessages(selectedChat.toString(), 1);
    });

    return () => unsubscribe();
  }, [selectedChat]);

  useEffect(() => {
    if (selectedChat) {
      // if (pollingInterval) clearInterval(pollingInterval);
      fetchMessages(selectedChat.toString(), 1);
      fetchChats();
    }
  }, [selectedChat]);

  useEffect(() => {
    if (pagination.currentPage === 1) {
      scrollToBottom();
    }
  }, [messages]);

  const renderMessage = (message: Message) => (
    <div 
      className={cn(
        "max-w-xs lg:max-w-md px-4 py-2 rounded-lg relative group",
        message.is_note 
          ? "bg-orange-100 border-l-4 border-orange-500 text-orange-800 w-full max-w-none"
          : message.is_mine
          ? "bg-primary text-primary-foreground"
          : "bg-muted",
        message.isPending && "opacity-75",
        message.isFailed && "bg-red-100 text-red-800"
      )}
      onMouseEnter={() => setSelectedMessageId(message.id)}
      onMouseLeave={() => setSelectedMessageId(null)}
    >
      {message.is_note && (
        <div className="flex items-center gap-2 mb-1">
          <StickyNote className="h-4 w-4" />
          <span className="text-xs font-medium">ملاحظة للفريق الداخلي</span>
        </div>
      )}
      <p className="text-sm">{message.message}</p>
      <div className="flex justify-between items-center">
        <p className={cn(
          "text-xs mt-1",
          message.is_note 
            ? "text-orange-600" 
            : message.is_mine 
            ? "text-primary-foreground/70" 
            : "text-muted-foreground",
          message.isFailed && "text-red-600"
        )}>
          {message.created_since}
          {message.isPending && " ⏳"}
          {message.isFailed && " ❌"}
        </p>
        {selectedMessageId === message.id  && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0 opacity-70 hover:opacity-100 hover:bg-red-100/50 hover:text-red-600"
            onClick={() => handleDeleteMessage(message.id.toString())}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );

  if (selectedChat) {
    return (
      <div className="h-[calc(100vh-8rem)] flex flex-col">
        <div className="bg-card border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedChat(null)}
                className="p-2"
              >
                ←
              </Button>
              <Avatar>
                <AvatarImage src={selectedChatData?.user.image} />
                <AvatarFallback>
                  {selectedChatData?.user.name.split(' ')[0][0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{selectedChatData?.user.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedChatData?.user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteChat}
                  className="h-8 text-red-600 hover:text-red-700 hover:bg-red-100/50"
                >
                  <Trash2 className="h-3 w-3 ml-1" />
                  حذف المحادثة
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {pagination.hasMore && (
            <div className="flex justify-center">
              <Button 
                variant="outline" 
                onClick={handleLoadMoreMessages}
                className="flex items-center gap-1"
              >
                <MoreHorizontal className="h-4 w-4" />
                عرض المزيد من الرسائل (حاليا {displayedMessageCount})
              </Button>
            </div>
          )}
          {messages.map((message) => (
            <div key={message.id} className={cn(
              "flex",
              message.is_mine ? "justify-end" : "justify-start",
              message.is_note && "justify-center"
            )}>
              {renderMessage(message)}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t p-4 space-y-3">
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
                  onKeyPress={(e) => e.key === 'Enter' && !isSending && handleSendNote()}
                  className="flex-1 bg-white"
                  disabled={isSending}
                />
                <Button 
                  onClick={handleSendNote} 
                  disabled={!newNote.trim() || isSending}
                  size="sm"
                >
                  {isSending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowNoteInput(false)}
                  size="sm"
                  disabled={isSending}
                >
                  إلغاء
                </Button>
              </div>
            </div>
          )}
          
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="اكتب رسالتك هنا..."
              onKeyPress={(e) => e.key === 'Enter' && !isSending && handleSendMessage()}
              className="flex-1"
              disabled={isSending}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!newMessage.trim() || !selectedChat || isSending}
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
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
            {chats.map((chat) => {
              // const StatusIcon = statusIcons[currentStatus as keyof typeof statusIcons];
              return (
                <div
                  key={chat.user.id}
                  onClick={() => setSelectedChat(chat.user.id)}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors",
                    "hover:bg-muted/50",
                    !chat.last_message.is_read && "bg-muted/30 border-primary/20"
                  )}
                >
                  <Avatar>
                    <AvatarImage src={chat.user.image} />
                    <AvatarFallback>
                      {chat.user.name.split(' ')[0][0]}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium truncate">{chat.user.name}</h4>
                      {!chat.last_message.is_read && (
                        <div className="h-2 w-2 bg-primary rounded-full" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {chat.last_message.message}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {chat.last_message.created_since}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* <Badge className={statusColors[currentStatus as keyof typeof statusColors]}>
                      <StatusIcon className="h-3 w-3 ml-1" />
                      {currentStatus}
                    </Badge> */}
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