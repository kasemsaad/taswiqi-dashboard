import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Plus, Trash2, Edit, List } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  GetAllpagesTerms, 
  GetpageById, 
  DeletepageId, 
  Createpage, 
  UpdatePage 
} from "@/services/userService";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

interface Page {
  id: number;
  title: string;
  key: string;
  content?: {
    html: string;
  };
  created_at: string;
}

export default function PagesManagement() {
  const { toast } = useToast();
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page | null>(null);
  const [mode, setMode] = useState<"list" | "add" | "edit">("list");
  const [formData, setFormData] = useState({
    title: "",
    key: "",
    content: ""
  });

  // جلب جميع الصفحات
  const fetchPages = async () => {
    try {
      const response = await GetAllpagesTerms();
      if (response.status && response.data) {
        const data = response.data as any;
        setPages(data);
      }
    } catch (error) {
      console.error("Error fetching pages:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء جلب الصفحات",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  // جلب صفحة محددة للتعديل
  const fetchPageForEdit = async (id: number) => {
    try {
      const response = await GetpageById(id.toString());
      if (response.status && response.data) {
        const data = response.data as any;
        setCurrentPage(data);
        setFormData({
          title: data.title ,
          key: data.key,
          content: data.content?.html || ""
        });
        setMode("edit");
      }
    } catch (error) {
      console.error("Error fetching page:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء جلب بيانات الصفحة",
        variant: "destructive",
      });
    }
  };

  // حذف صفحة
  const handleDeletePage = async (id: number) => {
    try {
      const response = await DeletepageId(id.toString());
      if (response.status) {
        toast({
          title: "تم الحذف",
          description: "تم حذف الصفحة بنجاح",
          variant: "success",
        });
        fetchPages(); // إعادة تحميل القائمة
      }
    } catch (error) {
      console.error("Error deleting page:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف الصفحة",
        variant: "destructive",
      });
    }
  };

  // حفظ الصفحة (إضافة أو تعديل)
  const handleSavePage = async () => {
    setIsSaving(true);
    try {
      let response;
      
      if (mode === "add") {
        response = await Createpage(formData);
      } else if (mode === "edit" && currentPage) {
        response = await UpdatePage(currentPage.id, {
          title: formData.title,
          // key: formData.key,
          content: formData.content,
          _method: "put",
          // id: currentPage.id
        });
      }

      if (response && response.status) {
        toast({
          title: "تم الحفظ",
          description: mode === "add" ? "تم إضافة الصفحة بنجاح" : "تم تحديث الصفحة بنجاح",
          variant: "success",
        });
        setMode("list");
        fetchPages(); // إعادة تحميل القائمة
      }
    } catch (error) {
      console.error("Error saving page:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ الصفحة",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // إعادة تعيين النموذج
  const resetForm = () => {
    setFormData({
      title: "",
      key: "",
      content: ""
    });
    setCurrentPage(null);
  };

  // عرض قائمة الصفحات
  const renderPagesList = () => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>قائمة الصفحات</CardTitle>
        <Button onClick={() => { resetForm(); setMode("add"); }}>
          <Plus className="h-4 w-4 ml-2" />
          إضافة صفحة جديدة
        </Button>
      </CardHeader>
      <CardContent>
        {pages.length === 0 ? (
          <p className="text-center py-4">لا توجد صفحات</p>
        ) : (
          <div className="space-y-4">
            {pages.map((page) => (
              <div key={page.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h3 className="font-medium">{page.title}</h3>
                  <p className="text-sm text-muted-foreground">{page.key}</p>
                  <p className="text-xs text-muted-foreground">{page.created_at}</p>
                </div>
                <div className="flex space-x-2 gap-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => fetchPageForEdit(page.id)}
                  >
                    <Edit className="h-4 w-4 ml-1" />
                    تعديل
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDeletePage(page.id)}
                  >
                    <Trash2 className="h-4 w-4 ml-1" />
                    حذف
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  // عرض نموذج إضافة/تعديل الصفحة
  const renderPageForm = () => (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === "add" ? "إضافة صفحة جديدة" : "تعديل الصفحة"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium block">عنوان الصفحة</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="أدخل عنوان الصفحة"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium block">مفتاح الصفحة (Key)</label>
            <Input
              value={formData.key}
              onChange={(e) => setFormData({...formData, key: e.target.value})}
              placeholder="أدخل مفتاح الصفحة"
              disabled={mode === "edit"}
            />
          </div>

          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium block">محتوى الصفحة</label>
            <div className="border rounded-md">
              <CKEditor
                editor={ClassicEditor as any}
                data={formData.content}
                onChange={(_event, editor) => {
                  const data = editor.getData();
                  setFormData({...formData, content: data});
                }}
              />
            </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6 gap-3">
          <Button 
            variant="outline" 
            onClick={() => setMode("list")}
          >
            <List className="h-4 w-4 ml-2" />
            العودة للقائمة
          </Button>
          <Button 
            onClick={handleSavePage} 
            disabled={isSaving}
          >
            <Save className="h-4 w-4 ml-2" />
            {isSaving ? "جاري الحفظ..." : "حفظ الصفحة"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <p>جاري تحميل الصفحات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">إدارة الصفحات</h1>
        <p className="text-muted-foreground mt-1">
          إضافة وتعديل وحذف صفحات الموقع
        </p>
      </div>

      {mode === "list" ? renderPagesList() : renderPageForm()}
    </div>
  );
}