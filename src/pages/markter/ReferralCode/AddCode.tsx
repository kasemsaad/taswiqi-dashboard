import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CreareCode, GetAllBrandsnoMeta } from "@/services/userService";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const validationSchema = Yup.object().shape({
  brand_id: Yup.string().required("الشركة مطلوبة"),
  earning_precentage: Yup.number()
    .min(1, "يجب أن تكون النسبة بين 1 و 100")
    .max(100, "يجب أن تكون النسبة بين 1 و 100")
    .required("نسبة الربح مطلوبة"),
  code: Yup.string().required("كود الرابط مطلوب"),
});

const AddReferralPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [brands, setBrands] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const formik = useFormik({
    initialValues: {
      brand_id: "",
      earning_precentage: "",
      code: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const formData = new FormData();

        formData.append("brand_id", values.brand_id);
        formData.append("earning_precentage", values.earning_precentage);
        formData.append("code", values.code);
        console.log("dfdfsd", values);
        await CreareCode(values);
        toast({
          title: "تم بنجاح",
          description: "تم إضافة  كود الخصم بنجاح",
          variant: "success",
        });
        navigate("/LinksCodes");
      } catch (error) {
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء إضافة  كود الخصم",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <div className="md:flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/LinksCodes")}
          className="gap-2"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          العودة إلى كود الخصم
        </Button>
        <h1 className="text-2xl font-bold">إضافة كود خصم جديد</h1>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>معلومات كود الخصم</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand_id">الشركة *</Label>
                <Select
                  value={formik.values.brand_id}
                  onValueChange={(value) => {
                    formik.setFieldValue("brand_id", value);
                    formik.setFieldTouched("brand_id", true, false);
                  }}
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
                {formik.touched.brand_id && formik.errors.brand_id && (
                  <div className="text-sm text-red-500">
                    {formik.errors.brand_id}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="earning_precentage">نسبة الربح (%) *</Label>
                <Input
                  id="earning_precentage"
                  name="earning_precentage"
                  type="number"
                  min="1"
                  max="100"
                  value={formik.values.earning_precentage}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="15"
                />
                {formik.touched.earning_precentage &&
                  formik.errors.earning_precentage && (
                    <div className="text-sm text-red-500">
                      {formik.errors.earning_precentage}
                    </div>
                  )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">كود  *</Label>
                <Input
                  id="code"
                  name="code"
                  value={formik.values.code}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="123asa"
                />
                {formik.touched.code && formik.errors.code && (
                  <div className="text-sm text-red-500">
                    {formik.errors.code}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/LinksCodes")}
          >
            إلغاء
          </Button>
          <Button type="submit" className="gap-2" disabled={isSubmitting}>
            <Save className="w-4 h-4" />
            حفظ  كود الخصم
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddReferralPage;
