import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { GetAllCountries, GetAllCategories, EditBrands, GetBrandById } from "@/services/userService";

const validationSchema = Yup.object().shape({
  name: Yup.object()
    .shape({
      ar: Yup.string().required("اسم الشركة بالعربية مطلوب"),
      en: Yup.string().required("Company name in English is required"),
    })
    .required("Name is required"),
  description: Yup.object()
    .shape({
      ar: Yup.string().required("وصف الشركة بالعربية مطلوب"),
      en: Yup.string().required("Company description in English is required"),
    })
    .required("Description is required"),
  category_id: Yup.string().required("التصنيف مطلوب"),
  countries: Yup.array()
    .of(Yup.number())
    .min(1, "يجب اختيار دولة واحدة على الأقل")
    .required("الدول مطلوبة"),
  google_drive_url: Yup.string().url("يجب أن يكون الرابط صحيحًا"),
  email: Yup.string()
    .email("البريد الإلكتروني غير صحيح")
    .required("البريد الإلكتروني مطلوب"),
  phone: Yup.string()
    .required("رقم الهاتف مطلوب")
    .test("is-valid-phone", "رقم الهاتف غير صحيح", (value) => {
      if (!value) return false;
      return /^\d{1,14}$/.test(value);
    }),
  code: Yup.string().required("الكود مطلوب"),
  // logo: Yup.mixed(),
});

const EditCompanyPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeLanguage, setActiveLanguage] = useState<"ar" | "en">("ar");
  const [CategoriesRequests, setCategoriesRequests] = useState<any>(null);
  const [CountriesRequests, setCountriesRequests] = useState<any>(null);
  type Brand = {
    name: { ar: string; en: string };
    description: { ar: string; en: string };
    logo?: string;
    category_id: string;
    countries?: { country_id: number }[];
    google_drive_url?: string;
    email?: string;
    phone?: string;
    code?: string;
  };
  
  const [BrandData, setBrandData] = useState<Brand | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();

  const fetchCategories = async () => {
    try {
      const response = await GetAllCategories();
      setCategoriesRequests(response.data || []);
    } catch (error) {
      console.error("Error fetching Categories:", error);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await GetAllCountries();
      setCountriesRequests(response.data || []);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const fetchBrandData = async (id: string) => {
    try {
      const response = await GetBrandById(id);
      setBrandData(response.data as Brand);
      
      // Initialize form values with fetched data
      if (response.data) {
        const brand = response.data as Brand;
        formik.setValues({
          name: {
            ar: brand.name.ar || "",
            en: brand.name.en || "",
          },
          description: {
            ar: brand.description.ar || "",
            en: brand.description.en || "",
          },
          logo: null,
          category_id: brand.category_id || "",
          countries: brand.countries?.map((c: any) => c.country_id) || [],
          google_drive_url: brand.google_drive_url || "",
          email: brand.email || "",
          phone: brand.phone || "",
          code: brand.code || "",
        });
      }
    } catch (error) {
      console.error("Error fetching brand data:", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: {
        ar: "",
        en: "",
      },
      description: {
        ar: "",
        en: "",
      },
      logo: null as File | null,
      category_id: "",
      countries: [] as number[],
      google_drive_url: "",
      email: "",
      phone: "",
      code: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const formData = new FormData();

        formData.append("name[ar]", values.name.ar);
        formData.append("name[en]", values.name.en);
        formData.append("description[ar]", values.description.ar);
        formData.append("description[en]", values.description.en);
        if (values.logo) formData.append("logo", values.logo);
        formData.append("category_id", values.category_id);
        
        values.countries.forEach(countryId => {
          formData.append("countries[][country_id]", countryId.toString());
        });

        formData.append("google_drive_url", values.google_drive_url);
        formData.append("email", values.email);
        formData.append("phone", values.phone);
        formData.append("code", values.code);
        formData.append("_method", "put");
      

        await EditBrands(String(id), formData);

        toast({
          title: "تم بنجاح",
          description: "تم تعديل الشركة بنجاح",
          variant: "success",
        });
        navigate("/companies");
      } catch (error) {
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء تعديل الشركة",
          variant: "destructive",
        });
        console.error("Error editing company:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleCountryToggle = (countryId: number) => {
    const newCountries = formik.values.countries.includes(countryId)
      ? formik.values.countries.filter(id => id !== countryId)
      : [...formik.values.countries, countryId];
    formik.setFieldValue("countries", newCountries);
  };

  useEffect(() => {
    fetchCategories();
    fetchCountries();
    if (id) {
      fetchBrandData(id);
    }
  }, [id]);


  if (!BrandData) {
    return <div className="container mx-auto p-6">جاري التحميل...</div>;
  }


  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <div className="md:flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/companies")}
          className="gap-2"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          العودة إلى إدارة الشركات
        </Button>
        <h1 className="text-2xl font-bold">عرض وتعديل الشركة</h1>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>المعلومات الأساسية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="name">اسم الشركة *</Label>
                  <div className="flex border rounded-md">
                    <Button
                      type="button"
                      variant={activeLanguage === "ar" ? "default" : "ghost"}
                      size="sm"
                      className="h-8 px-3"
                      onClick={() => setActiveLanguage("ar")}
                    >
                      AR
                    </Button>
                    <Button
                      type="button"
                      variant={activeLanguage === "en" ? "default" : "ghost"}
                      size="sm"
                      className="h-8 px-3"
                      onClick={() => setActiveLanguage("en")}
                    >
                      EN
                    </Button>
                  </div>
                </div>
                <Input
                  id={`name.${activeLanguage}`}
                  name={`name.${activeLanguage}`}
                  value={formik.values.name[activeLanguage]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder={
                    activeLanguage === "ar"
                      ? "أدخل اسم الشركة بالعربية"
                      : "Enter company name in English"
                  }
                />
                {formik.touched.name?.[activeLanguage] &&
                  formik.errors.name?.[activeLanguage] && (
                    <div className="text-sm text-red-500">
                      {formik.errors.name[activeLanguage]}
                    </div>
                  )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">الشعار</Label>
                <div className="flex items-center gap-4">
                  {BrandData.logo && !formik.values.logo && (
                    <img 
                      src={BrandData.logo} 
                      alt="Company logo" 
                      className="h-12 w-12 object-cover rounded-md"
                    />
                  )}
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      if (event.currentTarget.files) {
                        formik.setFieldValue("logo", event.currentTarget.files[0]);
                      }
                    }}
                    onBlur={formik.handleBlur}
                    className="file:ml-2 file:rounded-md file:border-0 file:bg-primary file:text-primary-foreground"
                  />
                </div>
                {formik.touched.logo && formik.errors.logo && (
                  <div className="text-sm text-red-500">{formik.errors.logo}</div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="description">وصف الشركة *</Label>
                <div className="flex border rounded-md">
                  <Button
                    type="button"
                    variant={activeLanguage === "ar" ? "default" : "ghost"}
                    size="sm"
                    className="h-8 px-3"
                    onClick={() => setActiveLanguage("ar")}
                  >
                    AR
                  </Button>
                  <Button
                    type="button"
                    variant={activeLanguage === "en" ? "default" : "ghost"}
                    size="sm"
                    className="h-8 px-3"
                    onClick={() => setActiveLanguage("en")}
                  >
                    EN
                  </Button>
                </div>
              </div>
              <Textarea
                id={`description.${activeLanguage}`}
                name={`description.${activeLanguage}`}
                value={formik.values.description[activeLanguage]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={
                  activeLanguage === "ar"
                    ? "أدخل وصف الشركة بالعربية"
                    : "Enter company description in English"
                }
                rows={3}
              />
              {formik.touched.description?.[activeLanguage] &&
                formik.errors.description?.[activeLanguage] && (
                  <div className="text-sm text-red-500">
                    {formik.errors.description[activeLanguage]}
                  </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category_id">التصنيف *</Label>
                <Select
                  value={formik.values.category_id}
                  onValueChange={(value) => {
                    formik.setFieldValue("category_id", value);
                    formik.setFieldTouched("category_id", true, false);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر تصنيف" />
                  </SelectTrigger>
                  <SelectContent>
                    {CategoriesRequests?.map((category: any) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formik.touched.category_id && formik.errors.category_id && (
                  <div className="text-sm text-red-500">
                    {formik.errors.category_id}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">الكود *</Label>
                <div className="flex flex-col">
                  <PhoneInput
                    international
                    defaultCountry="SA"
                    value={formik.values.code}
                    onChange={(value) => formik.setFieldValue("code", value)}
                    onBlur={() => formik.setFieldTouched("code", true)}
                    className="border rounded-md p-2"
                  />
                </div>
                {formik.touched.code && formik.errors.code && (
                  <div className="text-sm text-red-500">
                    {formik.errors.code}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>الدول المتاحة *</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {CountriesRequests?.map((country: any) => (
                <div key={country.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`country-${country.id}`}
                    checked={formik.values.countries.includes(country.id)}
                    onCheckedChange={() => handleCountryToggle(country.id)}
                  />
                  <label
                    htmlFor={`country-${country.id}`}
                    className="text-sm ps-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {country.name}
                  </label>
                </div>
              ))}
            </div>
            {formik.touched.countries && formik.errors.countries && (
              <div className="mt-2 text-sm text-red-500">
                {formik.errors.countries}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>معلومات التواصل</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="company@example.com"
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="text-sm text-red-500">
                    {formik.errors.email}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف *</Label>
                <div className="flex flex-col">
                  <Input
                    id="phone"
                    name="phone"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="أدخل رقم الشركة"
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <div className="text-sm text-red-500">
                      {formik.errors.phone}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="google_drive_url">رابط جوجل درايف</Label>
              <Input
                id="google_drive_url"
                name="google_drive_url"
                value={formik.values.google_drive_url}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="https://drive.google.com/..."
                type="url"
              />
              {formik.touched.google_drive_url &&
                formik.errors.google_drive_url && (
                  <div className="text-sm text-red-500">
                    {formik.errors.google_drive_url}
                  </div>
                )}
            </div>
          </CardContent>
        </Card>

        <Separator />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/companies")}
          >
            إلغاء
          </Button>
          <Button
            type="submit"
            className="gap-2"
            disabled={isSubmitting}
          >
            <Save className="w-4 h-4" />
            حفظ التعديلات
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditCompanyPage;