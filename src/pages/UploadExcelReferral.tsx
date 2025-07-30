import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
import { ArrowRight, Save, Upload, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  CreareReferralLink, 
  GetAllBrandsnoMeta,
  ExportReferralTemplate,
  ImportReferralLinks 
} from "@/services/userService";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const validationSchema = Yup.object().shape({
  brand_id: Yup.string().required("الشركة مطلوبة"),
  link: Yup.string()
    .url("يجب أن يكون الرابط صحيحًا")
    .required("رابط الإحالة مطلوب"),
  earning_precentage: Yup.number()
    .min(1, "يجب أن تكون النسبة بين 1 و 100")
    .max(100, "يجب أن تكون النسبة بين 1 و 100")
    .required("نسبة الربح مطلوبة"),
  link_code: Yup.string().required("كود الرابط مطلوب"),
});

const AddReferralPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [brands, setBrands] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [selectedBrandId, setSelectedBrandId] = useState("");

  const fetchBrands = async () => {
    try {
      const response = await GetAllBrandsnoMeta();
      const BrandData = Array.isArray(response?.data) ? response.data : [];
      setBrands(BrandData);
    } catch (error) {
      console.error("Error fetching brands:", error);
      setBrands([]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

const handleExportTemplate = async () => {
  try {
    const response = await ExportReferralTemplate();

    // تحديد نوع المحتوى الصحيح
    const blob = new Blob([response], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    // إنشاء رابط للتحميل
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'referral_template.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url); // تنظيف

    toast({
      title: "تم التحميل",
      description: "تم تحميل قالب الإكسل بنجاح",
      variant: "success",
    });
  } catch (error) {
    toast({
      title: "خطأ",
      description: "حدث خطأ أثناء تحميل القالب",
      variant: "destructive",
    });
    console.error("Error exporting template:", error);
  }
};


  const handleImportSubmit = async () => {
    if (!file || !selectedBrandId) {
      toast({
        title: "خطأ",
        description: "يجب اختيار الملف والشركة",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("brand_id", selectedBrandId);

      await ImportReferralLinks(formData);
      toast({
        title: "تم بنجاح",
        description: "تم استيراد الملف بنجاح",
        variant: "success",
      });
      navigate("/LinksCodes");
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء استيراد الملف",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  

  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/LinksCodes")}
            className="gap-2"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            العودة إلى روابط الإحالة
          </Button>
          <h1 className="text-2xl font-bold">إضافة رابط إحالة جديد</h1>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleExportTemplate}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            تحميل القالب
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
       

        {/* Excel Import Section */}
        <Card>
          <CardHeader>
            <CardTitle>استيراد من ملف Excel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>اختر الشركة</Label>
                <Select
                  value={selectedBrandId}
                  onValueChange={setSelectedBrandId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الشركة" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id.toString()}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>اختر ملف Excel</Label>
                <Input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleImportSubmit}
                disabled={!file || !selectedBrandId || isSubmitting}
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                استيراد الملف
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddReferralPage;