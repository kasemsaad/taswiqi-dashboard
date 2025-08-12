import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Formik, Form } from "formik";
import { UploadedImage } from "@/components/interfaces/Interfaces";
import company from "@/assets/icons/companies.svg";
// import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  // Calendar,
  Phone,
  Mail,
  MapPin,
  // Wallet,
  // TrendingUp,
  // Users,
  // ShoppingBag,
  // CreditCard,
  // FileText,
  // AlertCircle,
  // CheckCircle,
  // XCircle,
  Ban,
  MessageSquare,
  Clock,
  IdCard,
  Shield,
  User,
  Calendar as CalendarIcon,
  // Banknote,
  // Edit,
  // Trash,
  // Upload,
  BarChart3,
  // Image as ImageIcon,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  CreateBlock,
  GetAllReferralLinks,
  GetAllDiscountCode,
  GetCustomersById,
  GetAllWalletRequests,
  GetAllBrand,
  GetAllblocked,
  PushNotification,
} from "@/services/userService";
import FileUploadField from "@/components/ui/FileUploadField";
import { GeneralTable, TableColumn } from "@/components/ui/tableCustom";

// Mock data for marketer profile

export default function MarketerProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const [isPushOpen, setIsPushOpen] = useState(false);
  const [isVerificationDialogOpen, setIsVerificationDialogOpen] =
    useState(false);
  const [Customer, setCustomer] = useState<any>(null);
  const [Referral, setReferral] = useState<any>(null);
  const [DiscountCode, setDiscountCode] = useState<any>(null);
  const [WalletRequests, setWalletRequests] = useState<any>(null);
  const [Block, setBlock] = useState<any>(null);
  const [Brand, setBrand] = useState<any>(null);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [image, setimage] = useState<File | null>(null);
  const [reason, setreason] = useState<string>("");
  const [bodyAr, setbodyAr] = useState<string>("");
  const [bodyEn, setbodyEn] = useState<string>("");
  const [titleAr, settitleAr] = useState<string>("");
  const [titleEn, settitleEn] = useState<string>("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // const handleVerificationAction = (action: string) => {
  //   toast({
  //     title: action === "verify" ? "تم التوثيق" : "تم إلغاء التوثيق",
  //     description: `تم ${action === "verify" ? "توثيق" : "إلغاء توثيق"} حساب ${
  //       marketerProfile?.name
  //     }`,
  //   });
  //   setIsVerificationDialogOpen(false);
  // };

  const fetchCustomer = async (id: string) => {
    try {
      const Customer = await GetCustomersById(id);
      const CustomerData = Customer.data;
      setCustomer(CustomerData);
    } catch (error) {
      console.error("Error fetching center data:", error);
    }
  };
  const fetchReferral = async (id: string) => {
    try {
      const Referral = await GetAllReferralLinks(id);
      const ReferralData = Referral.data;
      const Referralpage = Referral as any;
      setReferral(ReferralData);
      setPage(Referralpage.meta.current_page);
      setPerPage(Referralpage.meta.per_page);
    } catch (error) {
      console.error("Error fetching center data:", error);
    }
  };
  const fetchDiscountCode = async (id: string) => {
    try {
      const DiscountCode = await GetAllDiscountCode(id);
      const DiscountCodeData = DiscountCode.data;
      const DiscountCodepage = DiscountCode as any;
      setDiscountCode(DiscountCodeData);
      setPage(DiscountCodepage.meta.current_page);
      setPerPage(DiscountCodepage.meta.per_page);
    } catch (error) {
      console.error("Error fetching center data:", error);
    }
  };
  const fetchBrand = async (id: string) => {
    try {
      const Brand = await GetAllBrand(id);
      const BrandData = Brand.data;
      const Brandpage = Brand as any;
      setBrand(BrandData);
      setPage(Brandpage.meta.current_page);
      setPerPage(Brandpage.meta.per_page);
    } catch (error) {
      console.error("Error fetching center data:", error);
    }
  };
  const fetchWalletRequests = async (id: string) => {
    try {
      const WalletRequests = await GetAllWalletRequests(id);
      const WalletRequestsData = WalletRequests.data;
      const WalletRequestsPage = WalletRequests as any;
      setWalletRequests(WalletRequestsData);
      setPage(WalletRequestsPage.meta.current_page);
      setPerPage(WalletRequestsPage.meta.per_page);
    } catch (error) {
      console.error("Error fetching center data:", error);
    }
  };
  const fetchBlock = async (id: string) => {
    try {
      const Block = await GetAllblocked(id);
      const BlockData = Block.data;
      const BlockPage = Block as any;
      setBlock(BlockData);
      setPage(BlockPage.meta.current_page);
      setPerPage(BlockPage.meta.per_page);
    } catch (error) {
      console.error("Error fetching center data:", error);
    }
  };
  const ReferralColumns: TableColumn[] = [
    {
      key: "link",
      header: "الرابط",
      render: (Referral) => (
        <div>
          <div className="font-medium">{Referral.link}</div>
        </div>
      ),
    },
    {
      key: "socialMediaPlatform",
      header: "المنصة",
      render: (Referral) => (
        <div className="space-y-1">
          <div className="text-sm">{Referral.socialMediaPlatform}</div>
        </div>
      ),
    },
    {
      key: "totalUsage",
      header: "عدد مرات الإستخدام",
      render: (Referral) => (
        <div className="space-y-1">
          <div className="text-sm">{Referral.totalUsage}</div>
        </div>
      ),
    },

    {
      key: "brand",
      header: "الشركة",
      render: (Referral) => <div className="text-sm">{Referral.brand}</div>,
    },
    {
      key: "created_at",
      header: "تاريخ الإنشاء ",
      render: (Referral) => (
        <div className="font-medium">{Referral.created_at}</div>
      ),
    },
    {
      key: "totalEarnings",
      header: "إجمالي الربح",
      render: (Referral) => (
        <div className="font-medium">{Referral.totalEarnings}</div>
      ),
    },

    {
      key: "isActive",
      header: "حالة الرابط",
      render: (Referral) => (
        <Badge
          className={Referral.isActive ? "status-active" : "status-inactive"}
        >
          {Referral.isActive ? "نشط" : "غير نشط"}
        </Badge>
      ),
    },
  ];
  const WalletRequestsColumns: TableColumn[] = [
    {
      key: "info",
      header: "الرقم المرجعي",
      render: (WalletRequests) => (
        <div>
          <div className="font-medium">{WalletRequests.info}</div>
        </div>
      ),
    },
    {
      key: "total",
      header: "المبلغ",
      render: (WalletRequests) => (
        <div className="space-y-1">
          <div className="text-sm">{WalletRequests.total}</div>
        </div>
      ),
    },
    {
      key: "created_at",
      header: "التاريخ ",
      render: (WalletRequests) => (
        <div className="space-y-1">
          <div className="text-sm">{WalletRequests.created_at}</div>
        </div>
      ),
    },

    {
      key: "type",
      header: "الوسيلة",
      render: (WalletRequests) => (
        <div className="text-sm">{WalletRequests.type}</div>
      ),
    },

    {
      key: "status",
      header: "حالة الرابط",
      render: (WalletRequests) => (
        <Badge
          className={
            WalletRequests.status === "approved"
              ? "status-active"
              : WalletRequests.status === "pending"
              ? "status-pending"
              : WalletRequests.status === "rejected"
              ? "status-inactive"
              : "status-inactive"
          }
        >
          {WalletRequests.status === "approved"
            ? "ناجحة"
            : WalletRequests.status === "pending"
            ? "معلقة"
            : WalletRequests.status === "rejected"
            ? "مرفوضة"
            : "لايوجد حالة"}
        </Badge>
      ),
    },
  ];
  const DiscountCodeColumns: TableColumn[] = [
    {
      key: "code",
      header: "الكود",
      render: (DiscountCode) => (
        <div>
          <div className="font-medium">{DiscountCode.code}</div>
        </div>
      ),
    },
    {
      key: "socialMediaPlatform",
      header: "المنصة",
      render: (Referral) => (
        <div className="space-y-1">
          <div className="text-sm">{Referral.socialMediaPlatform}</div>
        </div>
      ),
    },
    {
      key: "totalUsage",
      header: "عدد مرات الإستخدام",
      render: (Referral) => (
        <div className="space-y-1">
          <div className="text-sm">{Referral.totalUsage}</div>
        </div>
      ),
    },

    {
      key: "brand",
      header: "الشركة",
      render: (Referral) => <div className="text-sm">{Referral.brand}</div>,
    },
    {
      key: "created_at",
      header: "تاريخ الإنشاء ",
      render: (Referral) => (
        <div className="font-medium">{Referral.created_at}</div>
      ),
    },
    {
      key: "totalEarnings",
      header: "إجمالي الربح",
      render: (Referral) => (
        <div className="font-medium">{Referral.totalEarnings}</div>
      ),
    },

    {
      key: "isActive",
      header: "حالة الرابط",
      render: (Referral) => (
        <Badge
          className={Referral.isActive ? "status-active" : "status-inactive"}
        >
          {Referral.isActive ? "نشط" : "غير نشط"}
        </Badge>
      ),
    },
  ];
  const BrandColumns: TableColumn[] = [
    {
      key: "name",
      header: "أسم الشركة",
      render: (Brand) => (
        <div>
          <div className="font-medium">{Brand.name}</div>
        </div>
      ),
    },
    {
      key: "total_clients",
      header: "عدد الإحالات",
      render: (Brand) => (
        <div className="space-y-1">
          <div className="text-sm">{Brand.total_clients}</div>
        </div>
      ),
    },
    {
      key: "total_earnigns",
      header: "إجمالي الأرباح",
      render: (Brand) => (
        <div className="space-y-1">
          <div className="text-sm">{Brand.total_earnigns}</div>
        </div>
      ),
    },

    {
      key: "first_join",
      header: "تاريخ بدء التعاون",
      render: (Brand) => <div className="text-sm">{Brand.first_join}</div>,
    },
    {
      key: "id",
      header: "ملف الشركة",
      render: (Referral) => (
        <div className="font-medium ps-5">
          <a href={`/companies/edit/${Referral.id}`}>
            <img src={company} alt="company" />
          </a>
        </div>
      ),
    },
  ];
  const BlockColumns: TableColumn[] = [
    {
      key: "type",
      header: "الحالة",
      render: (Block) => (
        <Badge
          className={
            Block.type === "block" ? "status-inactive" : "status-active"
          }
        >
          {Block.type === "block" ? "محظور" : "إلغاء الحظر"}
        </Badge>
      ),
    },
    {
      key: "created_at",
      header: "التاريخ",
      render: (Block) => (
        <div>
          <div className="font-medium">{Block.created_at}</div>
        </div>
      ),
    },
    {
      key: "reason",
      header: "السبب ",
      render: (Block) => (
        <div className="space-y-1">
          <div className="text-sm">{Block.reason}</div>
        </div>
      ),
    },
    {
      key: "creator.name",
      header: "الأدمن",
      render: (Block) => (
        <div className="space-y-1">
          <div className="text-sm">{Block.creator.name}</div>
        </div>
      ),
    },
  ];

  const handleBlockAccount = async (id: string, status: string) => {
    try {
      const sendData = {
        customer_id: id,
        reason,
        images,

        type: status == "blocked" ? "unblock" : "block",
      };
      // Call the API to block the account
      await CreateBlock(sendData);
      fetchCustomer(id);
      toast({
        title: status == "blocked" ? "تم الغاء حظر الحساب" : "تم حظر الحساب",
        description:
          status == "blocked"
            ? `تم الغاء حظر الحساب ${Customer?.name}`
            : `تم حظر حساب ${Customer?.name}`,
        variant: "success",
      });
      setIsBlockDialogOpen(false);
    } catch (error) {
      console.error("Error blocking account:", error);
      // setIsBlockDialogOpen(false);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء محاولة حظر الحساب",
        variant: "destructive",
      });
    }
  };
  const handlePushNotification = async () => {
    const notificationPayload = {
      title: {
        ar: titleAr,
        en: titleEn,
      },
      body: {
        ar: bodyAr,
        en: bodyEn,
      },
      users: [Customer.user_id], // أو id فقط حسب هيكل بياناتك
      target: "given_ids", // أو id فقط حسب هيكل بياناتك
      image, // أو id فقط حسب هيكل بياناتك
    };
    if (!titleAr || !titleEn || !bodyAr || !bodyEn || !image) {
      toast({
        title: "جميع الحقول مطلوبة",
        description: `يرجى ملء جميع الحقول`,
        variant: "destructive",
      });
      return;
    }
    try {
      // Show toast
      await PushNotification(notificationPayload);
      toast({
        title: "تم إرسال الإشعار",
        description: `تم إرسال الإشعار إلى ${Customer?.name}`,
        variant: "success",
      });

      setIsPushOpen(false);
    } catch (error) {
      console.error("Error blocking/unblocking account:", error);
      // setIsPushOpen(false);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تنفيذ العملية",
        variant: "destructive",
      });
    }
  };
  useEffect(() => {
    if (id) fetchCustomer(id);
    fetchDiscountCode(id as string);
    fetchReferral(id as string);
    fetchWalletRequests(id as string);
    fetchBlock(id as string);
    fetchBrand(id as string);
    // if (id) GetBlock(id);
  }, [id]);
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/marketers")}>
          <ArrowRight className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            الملف الشخصي للمسوق
          </h1>
          <p className="text-muted-foreground mt-1">
            معلومات تفصيلية عن {Customer?.name}
          </p>
        </div>
      </div>

      {/* Profile Overview */}
      <Card className="dashboard-card">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={Customer?.image} alt={Customer?.name} />
                <AvatarFallback>
                  {Customer?.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold">{Customer?.name}</h2>
                <p className="text-muted-foreground">{Customer?.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    className={
                      Customer?.status === "verified"
                        ? "status-active"
                        : Customer?.status === "not_verified"
                        ? "status-pending"
                        : Customer?.status === "blocked"
                        ? "status-inactive"
                        : "status-inactive"
                    }
                  >
                    <Shield className="h-3 w-3 ml-1" />
                    {Customer?.status === "verified"
                      ? "موثق"
                      : Customer?.status === "not_verified"
                      ? "غير موثق"
                      : Customer?.status === "blocked"
                      ? "محظور"
                      : "لايوجد حالة"}{" "}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-success">
                  {Customer?.totalClients}
                </div>
                <p className="text-sm text-muted-foreground">
                  إجمالي عدد الإحالات{" "}
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {Customer?.discountCodeCount}
                </div>
                <p className="text-sm text-muted-foreground">
                  عملاء أكواد الخصم
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {Customer?.referralLinkCount}
                </div>
                <p className="text-sm text-muted-foreground">
                  عدد روابط الإحالة{" "}
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {Customer?.totalEarning}
                </div>
                <p className="text-sm text-muted-foreground">
                  إجمالي العمولات ريال
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Chart */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            تقرير أداء المسوق
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={Customer?.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="commissions"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="clients"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <Dialog open={isPushOpen} onOpenChange={setIsPushOpen}>
          <DialogTrigger asChild>
            <Button>
              <MessageSquare className="h-4 w-4 ml-2" />
              إرسال إشعار
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-right">
                إرسال إشعار للمسوق
              </DialogTitle>
              <DialogDescription className="text-right">
                اكتب رسالة الإشعار التي تريد إرسالها إلى {Customer?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="mb-4">
              <Formik initialValues={{ images_upload: [] }} onSubmit={() => {}}>
                 {({ setFieldValue }) => (
                  <Form className="space-y-4">
                    <input
                      type="text"
                      className="border p-2 rounded-md w-full"
                      placeholder="عنوان الإشعار بالعربية"
                      onChange={(e) => settitleAr(e.target.value)}
                      required
                    />
                    <input
                      type="textarea"
                      className="border p-2 rounded-md w-full"
                      placeholder="Notification Title in English"
                      onChange={(e) => settitleEn(e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      className="border p-2 rounded-md w-full"
                      placeholder="وصف الإشعار بالعربية"
                      onChange={(e) => setbodyAr(e.target.value)}
                      required
                    />

                    <input
                      type="text"
                      className="border p-2 rounded-md w-full"
                      placeholder="وصف الإشعار بالإنجليزية"
                      onChange={(e) => setbodyEn(e.target.value)}
                      required
                    />
                  <FileUploadField
                        label=""
                        name="images_upload"
                        multiple
                        onFilesSelected={(files) => {
                                    const firstImage = { image: files[0] }; // only index 0

                          // setImages(newImages);
                          setimage(firstImage.image);
                          setFieldValue("images_upload", files); // Update Formik state
                        }}
                      />
                  </Form>
                )}
              </Formik>
            </div>
            <DialogFooter>
              <Button
                onClick={() => {
                  handlePushNotification();
                }}
              >
                إرسال الإشعار
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isBlockDialogOpen} onOpenChange={setIsBlockDialogOpen}>
          {/* {CustomerCheck?.type=="block" &&   <Button variant="destructive" onClick={() => deleteBlock(CustomerCheck.id as string)}>
              <Ban className="h-4 w-4 ml-2" />
              الغاء الحظر
            </Button>} */}

          <DialogTrigger asChild className="">
            <Button
              variant={
                Customer?.status !== "blocked" ? "destructive" : "success"
              }
            >
              <Ban className="h-4 w-4 ml-2" />
              {Customer?.status == "blocked" ? " الغاء الحظر " : " حظر الحساب"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-right">تأكيد حظر الحساب</DialogTitle>
              <DialogDescription className="text-right">
                {Customer?.status == "blocked"
                  ? `هل أنت متأكد من أنك تريد  الغاء حظر حساب ${Customer?.name}
                سيمنحه الوصول إلى حسابه.`
                  : `هل أنت متأكد من أنك تريد حظر حساب ${Customer?.name}؟ هذا الإجراء
                سيمنع المسوق من الوصول إلى حسابه.`}
              </DialogDescription>
              <input
                type="textarea"
                className="border p-2 rounded-md w-full"
                placeholder="أضف ملاحظة  (اجباري)"
                onChange={(e) => setreason(e.target.value)}
              />
              <div className="mb-4">
                <Formik
                  initialValues={{ images_upload: [] }}
                  onSubmit={() => {
                    // handle form submission
                  }}
                >
                  {({ setFieldValue }) => (
                    <Form>
                      <FileUploadField
                        label=""
                        name="images_upload"
                        multiple
                        onFilesSelected={(files) => {
                          const newImages = [
                            ...(images || []),
                            ...files.map((file) => ({
                              image: file,
                            })),
                          ];
                          setImages(newImages);
                          setFieldValue("images_upload", files); // Update Formik state
                        }}
                      />
                      {/* rest of your form */}
                    </Form>
                  )}
                </Formik>
              </div>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setIsBlockDialogOpen(false)}
              >
                إلغاء
              </Button>
              <Button
                variant={
                  Customer?.status == "blocked" ? "destructive" : "success"
                }
                onClick={() =>
                  handleBlockAccount(id as string, Customer?.status)
                }
              >
                {Customer?.status == "blocked"
                  ? "لإلغاء الحظر"
                  : " تأكيد الحظر"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="info" dir="rtl" className="relative">
  <TabsList className="flex w-full overflow-x-auto py-2 space-x-reverse space-x-2">
          <TabsTrigger value="info">المعلومات الشخصية</TabsTrigger>
          <TabsTrigger
            value="codes"
            onClick={() => fetchDiscountCode(id as string)}
          >
            أكواد الخصم
          </TabsTrigger>
          <TabsTrigger
            value="links"
            onClick={() => fetchReferral(id as string)}
          >
            روابط الإحالة
          </TabsTrigger>
          <TabsTrigger
            value="WalletRequests"
            onClick={() => fetchWalletRequests(id as string)}
          >
            عمليات السحب
          </TabsTrigger>
          <TabsTrigger
            value="companies"
            onClick={() => fetchBrand(id as string)}
          >
            الشركات المتعاون معها
          </TabsTrigger>
          <TabsTrigger value="blocked" onClick={() => fetchBlock(id as string)}>
            سجل الحظر
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4" dir="rtl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle>المعلومات الشخصية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Customer?.birthdate && (
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>تاريخ الميلاد: {Customer?.birthdate}</span>
                  </div>
                )}
                {Customer?.gender && (
                  <div className="flex items-center gap-3">
                    <IdCard className="h-4 w-4 text-muted-foreground" />
                    <span> الجنس: {Customer?.gender}</span>
                  </div>
                )}
                {/* <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>رقم الجواز: {marketerProfile.passport}</span>
                </div> */}
                {Customer?.status && (
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span>حالة التوثيق: </span>
                    <Dialog
                      open={isVerificationDialogOpen}
                      onOpenChange={setIsVerificationDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Badge
                          className={
                            Customer?.status === "verified"
                              ? "status-active"
                              : Customer?.status === "not_verified"
                              ? "status-pending"
                              : Customer?.status === "blocked"
                              ? "status-inactive"
                              : "status-inactive"
                          }
                        >
                          {Customer?.status === "verified"
                            ? "موثق"
                            : Customer?.status === "not_verified"
                            ? "غير موثق"
                            : Customer?.status === "blocked"
                            ? "محظور"
                            : "لايوجد حالة"}{" "}
                        </Badge>
                      </DialogTrigger>
                      {/* <DialogContent>
                        <DialogHeader>
                          <DialogTitle>صورة بطاقة الهوية</DialogTitle>
                          <DialogDescription>
                            مراجعة صورة البطاقة للتوثيق
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="flex justify-center">
                            <img
                              src={marketerProfile.idCardImage}
                              alt="بطاقة الهوية"
                              className="max-w-full h-64 object-cover rounded-lg border"
                            />
                          </div>
                        </div>
                        <DialogFooter className="gap-2">
                          <Button
                            variant="outline"
                            onClick={() => handleVerificationAction("unverify")}
                          >
                            إلغاء التوثيق
                          </Button>
                          <Button
                            onClick={() => handleVerificationAction("verify")}
                          >
                            توثيق
                          </Button>
                        </DialogFooter>
                      </DialogContent> */}
                    </Dialog>
                  </div>
                )}
                {/* <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  <span>حالة الحساب: </span>
                  <Badge
                    className={
                      marketerProfile.accountStatus === "نشط"
                        ? "status-active"
                        : marketerProfile.accountStatus === "محظور"
                        ? "status-inactive"
                        : "status-pending"
                    }
                  >
                    {marketerProfile.accountStatus}
                  </Badge>
                </div> */}
              </CardContent>
            </Card>
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle>معلومات الاتصال</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Customer?.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{Customer?.email}</span>
                  </div>
                )}
                {Customer?.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{Customer?.phone}</span>
                  </div>
                )}
                {Customer?.country && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{Customer?.country}</span>
                  </div>
                )}
                {Customer?.joined_at && (
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span>تاريخ الانضمام: {Customer?.joined_at}</span>
                  </div>
                )}
                {Customer?.joined_since && (
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>آخر نشاط: {Customer?.joined_since}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* <Card className="dashboard-card md:col-span-2">
              <CardHeader>
                <CardTitle>الحسابات البنكية وطرق الدفع</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketerProfile.bankAccounts.map((account) => (
                    <div key={account.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{account.bankName}</div>
                          <div className="text-sm text-muted-foreground">
                            {account.accountNumber}
                          </div>
                          {account.type === "bank" && (
                            <>
                              <div className="text-sm text-muted-foreground">
                                الاسم الكامل: {account.beneficiaryName}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                الدولة: {account.country}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                رمز سويفت: {account.swiftCode}
                              </div>
                              {account.iban && (
                                <div className="text-sm text-muted-foreground">
                                  IBAN: {account.iban}
                                </div>
                              )}
                            </>
                          )}
                          {account.type === "paypal" && (
                            <div className="text-sm text-muted-foreground">
                              الاسم: {account.beneficiaryName}
                            </div>
                          )}
                        </div>
                        <Badge
                          className={
                            account.type === "bank"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {account.type === "bank" ? "حساب بنكي" : "PayPal"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card> */}
          </div>
        </TabsContent>

        <TabsContent value="codes" className="space-y-4" dir="rtl">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>أكواد الخصم الخاصة بالمسوق</CardTitle>
            </CardHeader>
            <GeneralTable
              data={DiscountCode}
              columns={DiscountCodeColumns}
              pagination={{
                page,
                perPage,
                total: DiscountCode?.length,
                onPageChange: (newPage) => setPage(newPage),
                onPerPageChange: (newPerPage) => {
                  setPerPage(newPerPage);
                  setPage(1);
                },
              }}
            />
          </Card>
        </TabsContent>

        <TabsContent value="links" className="space-y-4" dir="rtl">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>روابط الإحالة الخاصة بالمسوق</CardTitle>
            </CardHeader>

            <GeneralTable
              data={Referral}
              columns={ReferralColumns}
              pagination={{
                page,
                perPage,
                total: Referral?.length, // Use filtered length for total items
                onPageChange: (newPage) => setPage(newPage),
                onPerPageChange: (newPerPage) => {
                  setPerPage(newPerPage);
                  setPage(1);
                },
              }}
            />
          </Card>
        </TabsContent>

        <TabsContent value="companies" className="space-y-4" dir="rtl">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>الشركات التي يسوق لها</CardTitle>
            </CardHeader>
            <GeneralTable
              data={Brand}
              columns={BrandColumns}
              pagination={{
                page,
                perPage,
                total: Brand?.length,
                onPageChange: (newPage) => setPage(newPage),
                onPerPageChange: (newPerPage) => {
                  setPerPage(newPerPage);
                  setPage(1);
                },
              }}
            />
          </Card>
        </TabsContent>

        <TabsContent value="WalletRequests" className="space-y-4" dir="rtl">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>طلبات سحب العمولة</CardTitle>
            </CardHeader>
            <GeneralTable
              data={WalletRequests}
              columns={WalletRequestsColumns}
              pagination={{
                page,
                perPage,
                total: WalletRequests?.length,
                onPageChange: (newPage) => setPage(newPage),
                onPerPageChange: (newPerPage) => {
                  setPerPage(newPerPage);
                  setPage(1);
                },
              }}
            />
          </Card>
        </TabsContent>
        <TabsContent value="blocked" className="space-y-4" dir="rtl">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>سجل الحظر</CardTitle>
            </CardHeader>
            <GeneralTable
              data={Block}
              columns={BlockColumns}
              pagination={{
                page,
                perPage,
                total: Block?.length,
                onPageChange: (newPage) => setPage(newPage),
                onPerPageChange: (newPerPage) => {
                  setPerPage(newPerPage);
                  setPage(1);
                },
              }}
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
