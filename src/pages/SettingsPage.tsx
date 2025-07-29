import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {  Save, Globe, FileText, Wallet } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">الإعدادات العامة</h1>
        <p className="text-muted-foreground mt-1">إعدادات النظام والتطبيق العامة</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* إعدادات العمولة */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              إعدادات السحب
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">الحد الأدنى للسحب (ريال)</label>
              <Input defaultValue="100" className="mt-1" />
            </div>
            <Button>
              <Save className="h-4 w-4 ml-2" />
              حفظ التغييرات
            </Button>
          </CardContent>
        </Card>

        {/* روابط التواصل الاجتماعي */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              روابط التواصل الاجتماعي
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <label className="text-sm font-medium">تويتر</label>
                  <Input defaultValue="https://twitter.com/tasweeqi" className="mt-1" />
                </div>
                <Switch defaultChecked className="mr-3" />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <label className="text-sm font-medium">انستقرام</label>
                  <Input defaultValue="https://instagram.com/tasweeqi" className="mt-1" />
                </div>
                <Switch defaultChecked className="mr-3" />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <label className="text-sm font-medium">فيسبوك</label>
                  <Input defaultValue="" placeholder="https://facebook.com/tasweeqi" className="mt-1" />
                </div>
                <Switch className="mr-3" />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <label className="text-sm font-medium">لينكد إن</label>
                  <Input defaultValue="" placeholder="https://linkedin.com/company/tasweeqi" className="mt-1" />
                </div>
                <Switch className="mr-3" />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <label className="text-sm font-medium">يوتيوب</label>
                  <Input defaultValue="" placeholder="https://youtube.com/@tasweeqi" className="mt-1" />
                </div>
                <Switch className="mr-3" />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <label className="text-sm font-medium">تيك توك</label>
                  <Input defaultValue="" placeholder="https://tiktok.com/@tasweeqi" className="mt-1" />
                </div>
                <Switch className="mr-3" />
              </div>
            </div>
            <Button>
              <Save className="h-4 w-4 ml-2" />
              حفظ التغييرات
            </Button>
          </CardContent>
        </Card>

        {/* إدارة الصفحات الأساسية */}
        <Card className="dashboard-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              إدارة الصفحات الأساسية
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium">الشروط والأحكام</label>
                <Textarea 
                  placeholder="اكتب الشروط والأحكام هنا..."
                  className="min-h-40 mt-1"
                  defaultValue="شروط وأحكام استخدام تطبيق تسويقي..."
                />
              </div>
              <div>
                <label className="text-sm font-medium">سياسة الخصوصية</label>
                <Textarea 
                  placeholder="اكتب سياسة الخصوصية هنا..."
                  className="min-h-40 mt-1"
                  defaultValue="سياسة الخصوصية وحماية البيانات..."
                />
              </div>
            </div>
            <Button>
              <Save className="h-4 w-4 ml-2" />
              حفظ التغييرات
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}