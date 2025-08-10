import  { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreateQr,
  GetQrById,
} from "../../../services/userService";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import QRCode from "react-qr-code";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface QrSession {
  id: string;
  message: string;
  accountId: string | null;
  status: boolean;
  sessionId: string;
  created_at?: string;
  qr?: string;
  last_qr?: string;
}

interface FormQr {
  session_name: string;
}

const useCountdownTimer = (initialTime: number) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (isActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isActive, timeLeft]);

  const startTimer = () => {
    setTimeLeft(initialTime);
    setIsActive(true);
  };

  const resetTimer = () => {
    setTimeLeft(initialTime);
    setIsActive(false);
  };

  return { timeLeft, isActive, startTimer, resetTimer };
};

const QrCodeDisplay = ({
  qrData,
  timeLeft,
  onRefresh,
  isLoading,
}: {
  qrData: string;
  timeLeft: number;
  onRefresh?: () => void;
  isLoading: boolean;
}) => {
  if (!qrData) {
    return (
      <div className="text-gray-500 py-5 text-center">
        Submit a Name to generate QR code
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      {/* QR Code */}
      <QRCode value={qrData} size={180} />

      {/* Countdown */}
      <div className="text-sm text-gray-500">
        {timeLeft > 0
          ? `Refreshing in ${timeLeft}s`
          : "QR expired — refresh to get a new one"}
      </div>

      {/* Refresh Button */}
      <button
        onClick={onRefresh}
        disabled={isLoading || timeLeft > 0}
        className={`text-sm font-medium ${
          isLoading || timeLeft > 0
            ? "text-gray-400 cursor-not-allowed"
            : "text-blue-500 hover:underline"
        }`}
      >
        {isLoading ? "Refreshing..." : "Refresh Now"}
      </button>
    </div>
  );
};

const Qr = () => {
  const navigate = useNavigate();
  // const [sessions, setSessions] = useState<QrSession[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [qrData, setQrData] = useState("");
  const [currentQrId, setCurrentQrId] = useState<number | null>(null);
  const { timeLeft, startTimer, resetTimer } = useCountdownTimer(7);

  const UsersSchema = Yup.object({
    session_name: Yup.string().required("Name is required"),
  });

  const fetchQrStatus = async (id: number) => {
    try {
      setLoading(true);
      const response = await GetQrById(id.toString());
      const qrData = response.data as QrSession;

      if (qrData?.status) {
        setQrData(qrData.last_qr || "");
        resetTimer();
        startTimer();
      }
    } catch (error) {
      console.error("Error fetching QR data:", error);
      toast({
        title: "خطأ في جلب البيانات",
        description: "فشل في تحميل حالة QR",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    if (currentQrId) {
      fetchQrStatus(currentQrId);
    }
  };

  // const handleDelete = async (id: string) => {
  //   try {
  //     await DeleteQr(id);
  //     // setSessions((prev) => prev.filter((s) => s.id !== id));
  //     toast({
  //       title: "تم الحذف",
  //       description: "تم حذف الجلسة بنجاح",
  //       variant: "default",
  //     });
  //   } catch (error) {
  //     console.error("Error deleting QR:", error);
  //     toast({
  //       title: "خطأ في الحذف",
  //       description: "فشل في حذف الجلسة",
  //       variant: "destructive",
  //     });
  //   }
  // };

  const handleCreateSubmit = async (values: FormQr) => {
    try {
      setLoading(true);
      const response = await CreateQr(values);
      const newQr = response.data as QrSession;

      if (newQr.qr) {
        setQrData(newQr.qr);
        startTimer();
      }
      if ((newQr as any).session_details?.id) {
        const qrId = parseInt((newQr as any).session_details.id);
        setCurrentQrId(qrId);
        fetchQrStatus(qrId);
      }

      toast({
        title: "تم الإنشاء",
        description: "تم إنشاء QR بنجاح",
        variant: "default",
      });
    } catch (error) {
      console.error("Error creating QR:", error);
      toast({
        title: "خطأ في الإنشاء",
        description: "فشل في إنشاء QR",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh QR when it expires
  useEffect(() => {
    if (timeLeft === 0 && currentQrId) {
      fetchQrStatus(currentQrId);
    }
  }, [timeLeft, currentQrId]);

  return (
    <div className="space-y-6">
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>إنشاء جلسة QR جديدة</CardTitle>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={{ session_name: "" }}
            validationSchema={UsersSchema}
            onSubmit={handleCreateSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="session_name"
                      className="block mb-2 text-sm font-medium"
                    >
                      اسم الجلسة
                    </label>
                    <Field
                      name="session_name"
                      type="text"
                      className="border p-2 w-full rounded"
                    />
                    <ErrorMessage
                      name="session_name"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* QR Code Display */}
                  <div className="flex items-center justify-center">
                    <QrCodeDisplay
                      qrData={qrData}
                      timeLeft={timeLeft}
                      onRefresh={refresh}
                      isLoading={loading}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "جاري الإنشاء..." : "إنشاء"}
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => navigate(-1)}
                  >
                    إلغاء
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
};

export default Qr;
