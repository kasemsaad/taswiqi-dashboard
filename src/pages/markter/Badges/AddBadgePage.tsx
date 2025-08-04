import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CreateBadge, GetHighestBadge } from "@/services/userService";

const AddBadgePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [HighestBadge, setHighestBadge] = useState<number>(0);
  const [activeLanguage, setActiveLanguage] = useState<"ar" | "en">("ar");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchHighestBadge = async () => {
    try {
      const response = await GetHighestBadge();
const highestBadge = Number((response.data as any)?.value ?? 0);
      setHighestBadge(Number(highestBadge));
      formik.setFieldValue("no_clients_from", Number(highestBadge));
    } catch (error) {
      console.error("Error fetching highest badge:", error);
    }
  };

  const validationSchema = Yup.object().shape({
    name: Yup.object()
      .shape({
        ar: Yup.string().required("اسم الشارة بالعربية مطلوب"),
        en: Yup.string().required("Badge name in English is required"),
      })
      .required("Name is required"),
    description: Yup.object()
      .shape({
        ar: Yup.string().required("وصف الشارة بالعربية مطلوب"),
        en: Yup.string().required("Badge description in English is required"),
      })
      .required("Description is required"),
    image: Yup.mixed()
      .required("صورة الشارة مطلوبة")
      .test("fileType", "يجب أن يكون الملف صورة", (value) => {
        if (!value) return true;
        if (value instanceof File) {
          return value.type.startsWith("image/");
        }
        return true;
      }),
    no_clients_to: Yup.number()
      .required("عدد العملاء إلى مطلوب")
      .min(
        HighestBadge + 1,
        `يجب أن يكون أكبر من ${HighestBadge} (أعلى شارة حالية)`
      )
      .integer("يجب أن يكون عدداً صحيحاً"),
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "خطأ",
        description: "الملف يجب أن يكون صورة",
        variant: "destructive",
      });
      return;
    }

    formik.setFieldValue("image", file);

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result as string);
    };
    reader.onerror = () => {
      console.error("حدث خطأ أثناء قراءة الصورة");
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحميل الصورة",
        variant: "destructive",
      });
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setPreviewImage(null);
    formik.setFieldValue("image", null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
      image: null as File | null,
      no_clients_from: HighestBadge,
      no_clients_to: null as number | null,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const formData = new FormData();

        formData.append("name[ar]", values.name.ar);
        formData.append("name[en]", values.name.en);
        formData.append("description[ar]", values.description.ar);
        formData.append("description[en]", values.description.en);
        if (values.image) formData.append("image", values.image);
        formData.append("no_clients_from", HighestBadge.toString());
        formData.append(
          "no_clients_to",
          values.no_clients_to?.toString() ?? ""
        );

        await CreateBadge(formData);

        toast({
          title: "تم بنجاح",
          description: "تم إضافة الشارة بنجاح",
          variant: "success",
        });
        navigate("/badges");
      } catch (error) {
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء إضافة الشارة",
          variant: "destructive",
        });
        console.error("Error adding badge:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  useEffect(() => {
    fetchHighestBadge();
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/badges")}
          className="gap-2"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          العودة إلى نظام الشارات
        </Button>
        <h1 className="text-2xl font-bold">إضافة شارة جديدة</h1>
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
                  <Label htmlFor="name">اسم الشارة *</Label>
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
                      ? "أدخل اسم الشارة بالعربية"
                      : "Enter badge name in English"
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
                <Label htmlFor="image">صورة الشارة *</Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={triggerFileInput}
                  className="w-full"
                >
                  اختر صورة
                </Button>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  onBlur={formik.handleBlur}
                  ref={fileInputRef}
                  className="hidden"
                />
                {previewImage && (
                  <div className="mt-4 flex flex-col items-center">
                    <img
                      src={previewImage}
                      alt="معاينة الصورة"
                      className="h-40 w-40 object-contain rounded-md border"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-destructive"
                      onClick={removeImage}
                    >
                      إزالة الصورة
                    </Button>
                  </div>
                )}
                {formik.touched.image && formik.errors.image && (
                  <div className="text-sm text-red-500">
                    {formik.errors.image}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="description">وصف الشارة *</Label>
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
                    ? "أدخل وصف الشارة بالعربية"
                    : "Enter badge description in English"
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
                <Label htmlFor="no_clients_from">عدد العملاء من *</Label>
                <Input
                  id="no_clients_from"
                  name="no_clients_from"
                  type="number"
                  value={HighestBadge}
                  disabled
                />
                <p className="text-sm text-muted-foreground">
                  يتم تعيينه تلقائياً بناءً على أعلى شارة موجودة ({HighestBadge})
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="no_clients_to">عدد العملاء إلى *</Label>
                <Input
                  id="no_clients_to"
                  name="no_clients_to"
                  type="number"
                  min={HighestBadge + 1}
                  value={formik.values.no_clients_to ?? ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder={`يجب أن يكون أكبر من ${HighestBadge}`}
                />
                {formik.touched.no_clients_to && formik.errors.no_clients_to && (
                  <div className="text-sm text-red-500">
                    {formik.errors.no_clients_to}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/badges")}
          >
            إلغاء
          </Button>
          <Button
            type="submit"
            className="gap-2"
            disabled={isSubmitting}
          >
            <Save className="w-4 h-4" />
            حفظ الشارة
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddBadgePage;