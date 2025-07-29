import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {  MessageSquare, Heart, Eye, EyeOff, Trash2, Star, MoreHorizontal, Ban, UserX, MessageCircleX } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

const postsData = [
  {
    id: 1,
    marketerName: "أحمد محمد العلي",
    content: "نصائح رائعة للتسويق عبر وسائل التواصل الاجتماعي! شكراً لفريق تسويقي على هذه المنصة الرائعة.",
    likes: 24,
    comments: 8,
    views: 156,
    postDate: "2024-01-15",
    postTime: "14:30",
    status: "نشط",
    reports: 0,
    type: "نص",
    image: null,
    reportedComments: [],
    allComments: [
      {
        id: 1,
        commenterName: "سارة أحمد",
        comment: "شكراً لك على هذه النصائح المفيدة!",
        date: "2024-01-15",
        time: "15:00"
      },
      {
        id: 2,
        commenterName: "محمد علي",
        comment: "معلومات قيمة جداً، استفدت كثيراً",
        date: "2024-01-15",
        time: "15:30"
      }
    ]
  },
  {
    id: 2,
    marketerName: "فاطمة خالد السعد",
    content: "شاركت تجربتي في الحصول على أول عمولة 1000 ريال! الطريق ليس سهلاً لكن النتائج تستحق المجهود.",
    likes: 45,
    comments: 15,
    views: 289,
    postDate: "2024-01-15",
    postTime: "11:15",
    status: "نشط",
    reports: 0,
    type: "قصة نجاح",
    image: "https://via.placeholder.com/400x200",
    reportedComments: [],
    allComments: [
      {
        id: 1,
        commenterName: "أحمد محمد",
        comment: "مبروك! تجربة ملهمة حقاً",
        date: "2024-01-15",
        time: "12:00"
      },
      {
        id: 2,
        commenterName: "ليلى عبدالله",
        comment: "كيف بدأتِ؟ أريد أن أتعلم منك",
        date: "2024-01-15",
        time: "13:15"
      },
      {
        id: 3,
        commenterName: "عبدالرحمن سالم",
        comment: "نجاح يستحق التقدير والاحترام",
        date: "2024-01-15",
        time: "14:20"
      }
    ]
  },
  {
    id: 3,
    marketerName: "عبدالله صالح القحطاني",
    content: "محتوى مشكوك فيه قد يحتوي على معلومات مضللة حول استراتيجيات التسويق.",
    likes: 3,
    comments: 1,
    views: 67,
    postDate: "2024-01-14",
    postTime: "09:45",
    status: "مخفي",
    reports: 5,
    type: "نص",
    image: null,
    reportedComments: [
      {
        id: 1,
        commenterName: "سارة أحمد",
        comment: "هذا المحتوى غير مناسب ويحتوي على معلومات خاطئة",
        reportReason: "محتوى مضلل"
      }
    ],
    allComments: [
      {
        id: 1,
        commenterName: "مريم خالد",
        comment: "لا أتفق مع هذا الرأي",
        date: "2024-01-14",
        time: "10:30"
      }
    ]
  },
  {
    id: 4,
    marketerName: "نورا عبدالرحمن",
    content: "مبروك لجميع المسوقين الذين حققوا إنجازاتهم هذا الشهر! 🎉 دعونا نحتفل بالنجاح ونشارك الخبرات.",
    likes: 38,
    comments: 12,
    views: 234,
    postDate: "2024-01-13",
    postTime: "16:20",
    status: "مميز",
    reports: 0,
    type: "تهنئة",
    image: null,
    reportedComments: [],
    allComments: [
      {
        id: 1,
        commenterName: "أحمد سالم",
        comment: "شكراً لك على التشجيع! 🎉",
        date: "2024-01-13",
        time: "17:00"
      },
      {
        id: 2,
        commenterName: "فاطمة محمد",
        comment: "بالتوفيق للجميع",
        date: "2024-01-13",
        time: "18:30"
      }
    ]
  },
  {
    id: 5,
    marketerName: "محمد أحمد الشهري",
    content: "ورشة عمل مجانية عن التسويق بالعمولة يوم السبت القادم. من يريد الانضمام؟",
    likes: 28,
    comments: 19,
    views: 178,
    postDate: "2024-01-12",
    postTime: "10:30",
    status: "نشط",
    reports: 0,
    type: "فعالية",
    image: null,
    reportedComments: [],
    allComments: [
      {
        id: 1,
        commenterName: "عبدالله أحمد",
        comment: "أنا مهتم! كيف يمكنني التسجيل؟",
        date: "2024-01-12",
        time: "11:00"
      },
      {
        id: 2,
        commenterName: "ريم محمد",
        comment: "ما هو الوقت المحدد للورشة؟",
        date: "2024-01-12",
        time: "12:15"
      },
      {
        id: 3,
        commenterName: "سعد عبدالله",
        comment: "هل ستكون الورشة أونلاين أم حضورية؟",
        date: "2024-01-12",
        time: "14:45"
      }
    ]
  }
];

export default function CommunityPage() {
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [showComments, setShowComments] = useState<any>(null);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">إدارة المجتمع</h1>
          <p className="text-muted-foreground mt-1">مراقبة وإدارة المحتوى المنشور من قبل المسوقين</p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="dashboard-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-muted-foreground text-sm">إجمالي المنشورات</p>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-success">1,189</div>
            <p className="text-muted-foreground text-sm">منشورات نشطة</p>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">45</div>
            <p className="text-muted-foreground text-sm">منشورات مميزة</p>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-warning">8</div>
            <p className="text-muted-foreground text-sm">منشورات مخفية</p>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-destructive">5</div>
            <p className="text-muted-foreground text-sm">بلاغات جديدة</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters Section */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>فلاتر البحث</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">البلاغات</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="جميع البلاغات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع البلاغات</SelectItem>
                  <SelectItem value="no-reports">بدون بلاغات</SelectItem>
                  <SelectItem value="has-reports">يحتوي على بلاغات</SelectItem>
                  <SelectItem value="high-reports">بلاغات عالية (5+)</SelectItem>
                  <SelectItem value="most-reports">الأكثر بلاغات</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">المشاهدات</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="جميع المشاهدات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع المشاهدات</SelectItem>
                  <SelectItem value="low">قليلة (أقل من 100)</SelectItem>
                  <SelectItem value="medium">متوسطة (100-300)</SelectItem>
                  <SelectItem value="high">عالية (أكثر من 300)</SelectItem>
                  <SelectItem value="most-views">الأكثر مشاهدات</SelectItem>
                  <SelectItem value="least-views">الأقل مشاهدات</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">التفاعل</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="جميع التفاعلات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع التفاعلات</SelectItem>
                  <SelectItem value="low">ضعيف (أقل من 10)</SelectItem>
                  <SelectItem value="medium">متوسط (10-50)</SelectItem>
                  <SelectItem value="high">عالي (أكثر من 50)</SelectItem>
                  <SelectItem value="most-engagement">الأكثر تفاعل</SelectItem>
                  <SelectItem value="least-engagement">الأقل تفاعل</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">تاريخ النشر</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="جميع التواريخ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع التواريخ</SelectItem>
                  <SelectItem value="today">اليوم</SelectItem>
                  <SelectItem value="week">آخر أسبوع</SelectItem>
                  <SelectItem value="month">آخر شهر</SelectItem>
                  <SelectItem value="oldest">من الأقدم</SelectItem>
                  <SelectItem value="newest">من الأحدث</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">الحالة</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="جميع الحالات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="featured">مميز</SelectItem>
                  <SelectItem value="hidden">مخفي</SelectItem>
                  <SelectItem value="pending">قيد المراجعة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Management */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>منشورات المجتمع ({postsData.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="rtl-table">
              <TableHeader>
                <TableRow>
                  <TableHead>المسوق</TableHead>
                  <TableHead>المحتوى</TableHead>
                  <TableHead>الإعجابات</TableHead>
                  <TableHead>التعليقات</TableHead>
                  <TableHead>المشاهدات</TableHead>
                  <TableHead>البلاغات</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>تاريخ ووقت النشر</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {postsData.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div className="font-medium">{post.marketerName}</div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-64 text-sm line-clamp-2">{post.content}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="text-sm">{post.likes}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 cursor-pointer hover:bg-muted/50 rounded p-1" 
                           onClick={() => setShowComments(post)}>
                        <MessageSquare className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">{post.comments}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{post.views}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {post.reports > 0 ? (
                        <Badge className="bg-red-100 text-red-800">
                          {post.reports} بلاغ
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">لا توجد</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        post.status === "نشط" ? "status-active" :
                        post.status === "مميز" ? "bg-yellow-100 text-yellow-800" :
                        post.status === "مخفي" ? "status-inactive" : "status-pending"
                      }>
                        {post.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        <div>{post.postDate}</div>
                        <div>{post.postTime}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Dialog>
                            <DialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => {
                                e.preventDefault();
                                setSelectedPost(post);
                              }}>
                                <Eye className="h-4 w-4 ml-2" />
                                عرض التفاصيل
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>تفاصيل المنشور</DialogTitle>
                              </DialogHeader>
                              {selectedPost && (
                                <div className="space-y-6">
                                  {/* Post Content */}
                                  <div className="space-y-2">
                                    <h3 className="font-semibold">نص المنشور:</h3>
                                    <p className="text-sm bg-muted p-4 rounded-md">{selectedPost.content}</p>
                                  </div>
                                  
                                  {/* Post Date and Time */}
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-medium">تاريخ النشر:</h4>
                                      <p className="text-sm text-muted-foreground">{selectedPost.postDate}</p>
                                    </div>
                                    <div>
                                      <h4 className="font-medium">وقت النشر:</h4>
                                      <p className="text-sm text-muted-foreground">{selectedPost.postTime}</p>
                                    </div>
                                  </div>

                                  {/* Post Image */}
                                  {selectedPost.image && (
                                    <div className="space-y-2">
                                      <h3 className="font-semibold">صورة المنشور:</h3>
                                      <img 
                                        src={selectedPost.image} 
                                        alt="صورة المنشور" 
                                        className="max-w-full h-auto rounded-md border"
                                      />
                                    </div>
                                  )}

                                  {/* Reported Comments */}
                                  {selectedPost.reportedComments && selectedPost.reportedComments.length > 0 && (
                                    <div className="space-y-4">
                                      <h3 className="font-semibold text-red-600">التعليقات المبلغ عنها:</h3>
                                      {selectedPost.reportedComments.map((reportedComment: any) => (
                                        <div key={reportedComment.id} className="border rounded-md p-4 bg-red-50">
                                          <div className="space-y-2">
                                            <div className="flex justify-between items-start">
                                              <div>
                                                <p className="font-medium">المعلق: {reportedComment.commenterName}</p>
                                                <p className="text-sm text-muted-foreground">سبب البلاغ: {reportedComment.reportReason}</p>
                                              </div>
                                            </div>
                                            <p className="text-sm bg-white p-2 rounded border">{reportedComment.comment}</p>
                                            <div className="flex gap-2 mt-3">
                                              <Button size="sm" variant="destructive">
                                                <Ban className="h-4 w-4 ml-1" />
                                                حظر صاحب التعليق
                                              </Button>
                                              <Button size="sm" variant="outline">
                                                <MessageCircleX className="h-4 w-4 ml-1" />
                                                منع من التعليق
                                              </Button>
                                              <Button size="sm" variant="secondary">
                                                <Trash2 className="h-4 w-4 ml-1" />
                                                حذف التعليق
                                              </Button>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <DropdownMenuItem>
                            <Star className="h-4 w-4 ml-2" />
                            تمييز المنشور
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <EyeOff className="h-4 w-4 ml-2" />
                            إخفاء المنشور
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <UserX className="h-4 w-4 ml-2" />
                            حظر من النشر
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 ml-2" />
                            حذف المنشور
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Comments Dialog */}
      <Dialog open={!!showComments} onOpenChange={() => setShowComments(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>التعليقات على المنشور</DialogTitle>
          </DialogHeader>
          {showComments && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-md">
                <p className="font-medium">المنشور:</p>
                <p className="text-sm mt-1">{showComments.content}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  بواسطة: {showComments.marketerName}
                </p>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold">جميع التعليقات ({showComments.allComments?.length || 0})</h3>
                {showComments.allComments && showComments.allComments.length > 0 ? (
                  showComments.allComments.map((comment: any) => (
                    <div key={comment.id} className="border rounded-md p-4 bg-background">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{comment.commenterName}</p>
                          <p className="text-xs text-muted-foreground">
                            {comment.date} - {comment.time}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="destructive">
                            <Ban className="h-4 w-4 ml-1" />
                            حظر المعلق
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4 ml-1" />
                            حذف التعليق
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm bg-muted/50 p-2 rounded">{comment.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">لا توجد تعليقات على هذا المنشور</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}