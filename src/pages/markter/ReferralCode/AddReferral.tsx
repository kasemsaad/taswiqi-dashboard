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
import { CreareReferralLink, GetAllBrandsnoMeta } from "@/services/userService";
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

  // دالة لمعالجة تغيير الشركة
  const handleBrandChange = (brandId: string) => {
    formik.setFieldValue("brand_id", brandId);
    
    // البحث عن الشركة المختارة وتعيين القيم الافتراضية
    const selectedBrand = brands.find(brand => brand.id.toString() === brandId);
    if (selectedBrand) {
      formik.setFieldValue("earning_precentage", selectedBrand.default_link_earning || "");
    }
  };

  const formik = useFormik({
    initialValues: {
      brand_id: "",
      link: "",
      earning_precentage: "",
      link_code: "",
   
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        await CreareReferralLink({
          brand_id: values.brand_id,
          link: values.link,
          earning_precentage: values.earning_precentage,
          link_code: values.link_code,
        });
        toast({
          title: "تم بنجاح",
          description: "تم إضافة رابط الإحالة بنجاح",
          variant: "success",
        });
        navigate("/LinksCodes");
      } catch (error) {
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء إضافة رابط الإحالة",
          variant: "destructive",
        });
        console.error("Error adding referral link:", error);
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
          onClick={() => navigate("/marketers")}
          className="gap-2"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          العودة إلى روابط الإحالة
        </Button>
        <h1 className="text-2xl font-bold">إضافة رابط إحالة جديد</h1>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>معلومات رابط الإحالة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand_id">الشركة *</Label>
                <Select
                  value={formik.values.brand_id}
                  onValueChange={handleBrandChange}
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
                <Label htmlFor="link">رابط الإحالة *</Label>
                <Input
                  id="link"
                  name="link"
                  value={formik.values.link}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="https://example.com/referral"
                />
                {formik.touched.link && formik.errors.link && (
                  <div className="text-sm text-red-500">
                    {formik.errors.link}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="link_code">كود الرابط *</Label>
                <Input
                  id="link_code"
                  name="link_code"
                  value={formik.values.link_code}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="123asa"
                />
                {formik.touched.link_code && formik.errors.link_code && (
                  <div className="text-sm text-red-500">
                    {formik.errors.link_code}
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
            حفظ رابط الإحالة
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddReferralPage;