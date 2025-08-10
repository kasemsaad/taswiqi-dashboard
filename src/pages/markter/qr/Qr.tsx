import  { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetAllQr, DeleteQr } from "../../../services/userService";
import { GeneralTable } from "@/components/ui/tableCustom";
import { Badge } from "@/components/ui/badge";
import Delete from "@/assets/icons/delete.svg";
import { toast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TableColumn } from "@/components/ui/tableCustom";

interface QrSession {
  id: string;
  message: string;
  accountId: string | null;
  status: boolean;
  sessionId: string;
  created_at?: string;
}

const Qr = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<QrSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  const fetchQrData = async () => {
    try {
      setLoading(true);
      const response = await GetAllQr({
        page,
        per_page: perPage,
        sort_by: "created_at",
        sort_order: "desc",
        // search: searchTerm,
      });

      // Fix: Type guard for response and its nested properties
      let qrData: QrSession[] = [];
      let total = 0;

      if (
        response &&
        typeof response === "object" &&
        "data" in response &&
        response.data &&
        typeof response.data === "object"
      ) {
        const dataObj = response.data as { data?: unknown; meta?: { total?: number } };
        if (Array.isArray(dataObj.data)) {
          qrData = dataObj.data as QrSession[];
        }
        if (dataObj.meta && typeof dataObj.meta.total === "number") {
          total = dataObj.meta.total;
        }
      }

      setSessions(qrData);
      setTotalRecords(total || qrData.length);
    } catch (error) {
      console.error("Error fetching QR data:", error);
      setSessions([]);
      setTotalRecords(0);
      toast({
        title: "خطأ في جلب البيانات",
        description: "فشل في تحميل جلسات QR",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await DeleteQr(id);
      setSessions(prev => prev.filter(s => s.id !== id));
      setTotalRecords(prev => prev - 1);
      toast({
        title: "تم الحذف",
        description: "تم حذف الجلسة بنجاح",
        variant: "default",
      });
    } catch (error) {
      console.error("Error deleting QR:", error);
      toast({
        title: "خطأ في الحذف",
        description: "فشل في حذف الجلسة",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchQrData();
  }, [page, perPage,]);

  const columns: TableColumn[] = [
    {
      key: "index",
      header: "#",
  render: (session) => (
        <div className="space-y-1">
          <div className="text-sm">{session.id || "N/A"}</div>
        </div>
      ),    },
    {
      key: "session_name",
      header: "أسم الحساب",
      render: (session) => (
        <div className="space-y-1">
          <div className="text-sm">{session.session_name || "N/A"}</div>
        </div>
      ),
    },
    {
      key: "session_id",
      header: "معرف الجلسة",
      render: (session) => (
        <div className="space-y-1">
          <div className="text-sm">{session.session_id}</div>
        </div>
      ),
    },
    {
      key: "created_at",
      header: "تاريخ الإنشاء",
      render: (session) => (
        <div className="space-y-1">
          <div className="text-sm">{session.created_at || "N/A"}</div>
        </div>
      ),
    },
    {
      key: "status",
      header: "الحالة",
      render: (session) => (
        <Badge
          className={
            session.status=="active"
              ? "status-active":session.status=="logged_out"
              ?"status-inactive":"default"

          }
        >
          {session.status=="active" ? "نشط" :session.status=="logged_out"
              ?"غير نشط":"كود" }
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "الإجراءات",
      render: (session) => (
        <div className="font-medium ps-5 gap-2 flex">
          <button
            onClick={() => handleDelete(session.id)}
            className="text-muted-foreground hover:text-destructive"
          >
            <img src={Delete} alt="delete" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="md:flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-3xl font-bold text-foreground">جلسات QR</h1>
          <p className="text-muted-foreground mt-1">قائمة بجميع جلسات QR</p>
        </div>
        <Button onClick={() => navigate("/qr/add")}>
          إضافة جلسة جديدة
        </Button>
      </div>

      {/* Search and Filter */}
     
      {/* QR Sessions Table */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>جلسات QR</CardTitle>
        </CardHeader>
        <GeneralTable
          data={sessions}
          columns={columns}
          loading={loading}
          pagination={{
            page,
            perPage,
            total: totalRecords,
            onPageChange: setPage,
            onPerPageChange: (newPerPage) => {
              setPerPage(newPerPage);
              setPage(1);
            },
          }}
        />
      </Card>
    </div>
  );
};

export default Qr;