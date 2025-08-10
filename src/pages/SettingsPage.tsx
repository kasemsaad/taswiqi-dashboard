// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Switch } from "@/components/ui/switch";
// import {  Save, Globe, FileText, Wallet } from "lucide-react";

// export default function SettingsPage() {
//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold text-foreground">الإعدادات العامة</h1>
//         <p className="text-muted-foreground mt-1">إعدادات النظام والتطبيق العامة</p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* إعدادات العمولة */}
//         <Card className="dashboard-card">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Wallet className="h-5 w-5" />
//               إعدادات السحب
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div>
//               <label className="text-sm font-medium">الحد الأدنى للسحب (ريال)</label>
//               <Input defaultValue="100" className="mt-1" />
//             </div>
//             <Button>
//               <Save className="h-4 w-4 ml-2" />
//               حفظ التغييرات
//             </Button>
//           </CardContent>
//         </Card>

//         {/* روابط التواصل الاجتماعي */}
//         <Card className="dashboard-card">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Globe className="h-5 w-5" />
//               روابط التواصل الاجتماعي
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="space-y-3">
//               <div className="flex items-center justify-between p-3 border rounded-lg">
//                 <div className="flex-1">
//                   <label className="text-sm font-medium">تويتر</label>
//                   <Input defaultValue="https://twitter.com/tasweeqi" className="mt-1" />
//                 </div>
//                 <Switch defaultChecked className="mr-3" />
//               </div>
//               <div className="flex items-center justify-between p-3 border rounded-lg">
//                 <div className="flex-1">
//                   <label className="text-sm font-medium">انستقرام</label>
//                   <Input defaultValue="https://instagram.com/tasweeqi" className="mt-1" />
//                 </div>
//                 <Switch defaultChecked className="mr-3" />
//               </div>
//               <div className="flex items-center justify-between p-3 border rounded-lg">
//                 <div className="flex-1">
//                   <label className="text-sm font-medium">فيسبوك</label>
//                   <Input defaultValue="" placeholder="https://facebook.com/tasweeqi" className="mt-1" />
//                 </div>
//                 <Switch className="mr-3" />
//               </div>
//               <div className="flex items-center justify-between p-3 border rounded-lg">
//                 <div className="flex-1">
//                   <label className="text-sm font-medium">لينكد إن</label>
//                   <Input defaultValue="" placeholder="https://linkedin.com/company/tasweeqi" className="mt-1" />
//                 </div>
//                 <Switch className="mr-3" />
//               </div>
//               <div className="flex items-center justify-between p-3 border rounded-lg">
//                 <div className="flex-1">
//                   <label className="text-sm font-medium">يوتيوب</label>
//                   <Input defaultValue="" placeholder="https://youtube.com/@tasweeqi" className="mt-1" />
//                 </div>
//                 <Switch className="mr-3" />
//               </div>
//               <div className="flex items-center justify-between p-3 border rounded-lg">
//                 <div className="flex-1">
//                   <label className="text-sm font-medium">تيك توك</label>
//                   <Input defaultValue="" placeholder="https://tiktok.com/@tasweeqi" className="mt-1" />
//                 </div>
//                 <Switch className="mr-3" />
//               </div>
//             </div>
//             <Button>
//               <Save className="h-4 w-4 ml-2" />
//               حفظ التغييرات
//             </Button>
//           </CardContent>
//         </Card>

//         {/* إدارة الصفحات الأساسية */}
//         <Card className="dashboard-card lg:col-span-2">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <FileText className="h-5 w-5" />
//               إدارة الصفحات الأساسية
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <div>
//                 <label className="text-sm font-medium">الشروط والأحكام</label>
//                 <Textarea 
//                   placeholder="اكتب الشروط والأحكام هنا..."
//                   className="min-h-40 mt-1"
//                   defaultValue="شروط وأحكام استخدام تطبيق تسويقي..."
//                 />
//               </div>
//               <div>
//                 <label className="text-sm font-medium">سياسة الخصوصية</label>
//                 <Textarea 
//                   placeholder="اكتب سياسة الخصوصية هنا..."
//                   className="min-h-40 mt-1"
//                   defaultValue="سياسة الخصوصية وحماية البيانات..."
//                 />
//               </div>
//             </div>
//             <Button>
//               <Save className="h-4 w-4 ml-2" />
//               حفظ التغييرات
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GetAllSettings, EditSetting } from "@/services/userService";

interface Setting {
  key: string;
  value: string;
  originalValue?: string;
}

export default function SettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Setting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const fetchSettings = async () => {
    try {
      const response = await GetAllSettings();
      const dataArray = Array.isArray(response?.data) ? response.data : [];
      const settingsWithOriginal = dataArray.map((setting: Setting) => ({
        ...setting,
        originalValue: setting.value,
      }));
      setSettings(settingsWithOriginal);
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء جلب الإعدادات",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSettingChange = (index: number, value: string) => {
    const updatedSettings = [...settings];
    updatedSettings[index].value = value;
    setSettings(updatedSettings);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      let hasChanges = false;

      // إضافة الإعدادات المعدلة
      settings.forEach((setting, index) => {
        if (setting.value !== setting.originalValue) {
          formData.append(`settings[${index}][key]`, setting.key);
          formData.append(`settings[${index}][value]`, setting.value);
          hasChanges = true;
        }
      });

      // إضافة ملف الـ logo (يعتبر تغييرًا دائمًا حتى لو لم تتغير الإعدادات الأخرى)
      if (logoFile) {
        formData.append("logo", logoFile);
        hasChanges = true;
      }

      if (!hasChanges) {
        toast({
          title: "لا يوجد تغييرات",
          description: "لم تقم بإجراء أي تغييرات للحفظ",
          variant: "default",
        });
        return;
      }

      // إرسال البيانات إلى الخادم
      
      const res=await EditSetting(formData);
      console.log("awite",res)
      if(!res.status)
        throw new Error(res.message || "Failed to save settings");

      
      // إعادة تحميل الإعدادات بعد الحفظ
      await fetchSettings();
      toast({
        title: "تم الحفظ بنجاح",
        description: "تم تحديث الإعدادات بنجاح",
        variant: "success",
      });
      setLogoFile(null);
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ الإعدادات",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <p>جاري تحميل الإعدادات...</p>
        </div>
      </div>
    );
  }

  const getSettingValue = (key: string) => {
    return settings.find((s) => s.key === key)?.value || "";
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">الإعدادات العامة</h1>
        <p className="text-muted-foreground mt-1">إعدادات النظام والتطبيق العامة</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>تعديل الإعدادات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* اسم الموقع (عربي) */}
            <div className="space-y-2">
              <label className="text-sm font-medium block">اسم الموقع (عربي)</label>
              <Input
                value={getSettingValue("site_name_ar")}
                onChange={(e) => {
                  const index = settings.findIndex((s) => s.key === "site_name_ar");
                  if (index !== -1) handleSettingChange(index, e.target.value);
                }}
              />
            </div>

            {/* اسم الموقع (إنجليزي) */}
            <div className="space-y-2">
              <label className="text-sm font-medium block">اسم الموقع (إنجليزي)</label>
              <Input
                value={getSettingValue("site_name_en")}
                onChange={(e) => {
                  const index = settings.findIndex((s) => s.key === "site_name_en");
                  if (index !== -1) handleSettingChange(index, e.target.value);
                }}
              />
            </div>

            {/* البريد الإلكتروني */}
            <div className="space-y-2">
              <label className="text-sm font-medium block">البريد الإلكتروني</label>
              <Input
                value={getSettingValue("site_email")}
                onChange={(e) => {
                  const index = settings.findIndex((s) => s.key === "site_email");
                  if (index !== -1) handleSettingChange(index, e.target.value);
                }}
              />
            </div>

            {/* اللغة الافتراضية */}
            <div className="space-y-2">
              <label className="text-sm font-medium block">اللغة الافتراضية</label>
              <Input
                value={getSettingValue("default_language")}
                onChange={(e) => {
                  const index = settings.findIndex((s) => s.key === "default_language");
                  if (index !== -1) handleSettingChange(index, e.target.value);
                }}
              />
            </div>
  {/*   إصدار ios */}
            <div className="space-y-2">
              <label className="text-sm font-medium block"> إصدار Ios</label>
              <Input
                value={getSettingValue("ios_app_version")}
                onChange={(e) => {
                  const index = settings.findIndex(
                    (s) => s.key === "ios_app_version"
                  );
                  if (index !== -1) handleSettingChange(index, e.target.value);
                }}
              />
            </div>
            {/*   إصدار Android */}
            <div className="space-y-2">
              <label className="text-sm font-medium block"> إصدار Android</label>
              <Input
                value={getSettingValue("android_app_version")}
                onChange={(e) => {
                  const index = settings.findIndex(
                    (s) => s.key === "android_app_version"
                  );
                  if (index !== -1) handleSettingChange(index, e.target.value);
                }}
              />
            </div>
            {/* شعار الموقع */}
            <div className="space-y-2">
              <label className="text-sm font-medium block">شعار الموقع</label>
              <Input
                type="file"
                onChange={handleLogoChange}
                accept="image/*"
              />
              {!logoFile && getSettingValue("logo") && (
                <p className="text-sm text-muted-foreground mt-1">
                  الصورة الحالية:{" "}
                  <a
                    href={getSettingValue("logo")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    عرض
                  </a>

                </p>
              )}
            </div>
              

            {/* الحد الأقصى للسحب */}
            <div className="space-y-2">
              <label className="text-sm font-medium block">الحد الأقصى للسحب</label>
              <Input
                value={getSettingValue("max_withdraw_amount")}
                onChange={(e) => {
                  const index = settings.findIndex(
                    (s) => s.key === "max_withdraw_amount"
                  );
                  if (index !== -1) handleSettingChange(index, e.target.value);
                }}
              />
            </div>
          
          <div className="w-full flex justify-center">
              <img className="h-28 w-28" src={getSettingValue("logo")} alt="logo" />
              </div>
          </div>
          <div className="flex justify-end mt-6">
            <Button onClick={handleSaveSettings} disabled={isSaving}>
              <Save className="h-4 w-4 ml-2" />
              {isSaving ? "جاري الحفظ..." : "حفظ التغييرات"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}