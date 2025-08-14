import { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EditCategory, GetCategoryById } from "@/services/userService";

const validationSchema = Yup.object().shape({
  name: Yup.object().shape({
    ar: Yup.string().required("اسم التصنيف بالعربية مطلوب"),
    en: Yup.string().required("Category name in English is required"),
  }),
  image: Yup.mixed().nullable(),
});

const EditCategoryPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const [activeLanguage, setActiveLanguage] = useState<"ar" | "en">("ar");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [initialImage, setInitialImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formik = useFormik({
    initialValues: {
      name: { ar: "", en: "" },
      image: null as File | null,
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const formData = new FormData();
        formData.append("name[ar]", values.name.ar);
        formData.append("name[en]", values.name.en);
        formData.append("_method", "put");
        
        // Only append image if it's a new file
        if (values.image instanceof File) {
          formData.append("image", values.image);
        }

        await EditCategory(id!, formData);

        toast({
          title: "تم بنجاح",
          description: "تم تعديل التصنيف بنجاح",
          variant: "success",
        });
        navigate("/categories");
      } catch (error) {
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء تعديل التصنيف",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await GetCategoryById(id!);
        const category = response.data as any;
        
        formik.setValues({
          name: {
            ar: category.name.ar,
            en: category.name.en,
          },
          image: null,
        });
        
        if (category.image) {
          setInitialImage(category.image);
          setPreviewImage(category.image);
        }
      } catch (error) {
        toast({
          title: "خطأ",
          description: "حدث خطأ أثناء جلب بيانات التصنيف",
          variant: "destructive",
        });
        navigate("/categories");
      }
    };

    if (id) {
      fetchCategory();
    }
  }, [id]);

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
      if (reader.readyState === 2) {
        setPreviewImage(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const removeImage = () => {
    setPreviewImage(initialImage);
    formik.setFieldValue("image", null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/categories")}
          className="gap-2"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          العودة إلى التصنيفات
        </Button>
        <h1 className="text-2xl font-bold">تعديل التصنيف</h1>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>معلومات التصنيف</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* حقل الاسم متعدد اللغات */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>اسم التصنيف *</Label>
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
                name={`name.${activeLanguage}`}
                value={formik.values.name[activeLanguage]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={
                  activeLanguage === "ar"
                    ? "أدخل اسم التصنيف بالعربية"
                    : "Enter category name in English"
                }
              />
              {formik.touched.name?.[activeLanguage] &&
                formik.errors.name?.[activeLanguage] && (
                  <div className="text-sm text-red-500">
                    {formik.errors.name[activeLanguage]}
                  </div>
                )}
            </div>

            {/* حقل اختيار الصورة */}
            <div className="space-y-2">
              <Label htmlFor="image">صورة التصنيف</Label>
              <div className="flex flex-col gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={triggerFileInput}
                  className="w-full"
                >
                  تغيير الصورة
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
                
                {(previewImage || initialImage) && (
                  <div className="relative mt-2">
                    <div className="border rounded-md p-2 flex flex-col items-center">
                      <img
                        src={previewImage || initialImage || ""}
                        alt="معاينة الصورة"
                        className="h-40 w-auto object-contain rounded-md"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="mt-2 text-destructive gap-1"
                        onClick={removeImage}
                      >
                        <X className="w-4 h-4" />
                        إزالة الصورة
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* أزرار الحفظ */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/categories")}
          >
            إلغاء
          </Button>
          <Button type="submit" className="gap-2" disabled={isSubmitting}>
            <Save className="w-4 h-4" />
            حفظ التغييرات
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditCategoryPage;