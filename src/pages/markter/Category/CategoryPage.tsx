import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { GeneralTable } from "@/components/ui/tableCustom";
import { TableColumn } from "@/components/ui/tableCustom";
import { GetCategories, DeleteCategory } from "@/services/userService";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import Delete from "@/assets/icons/delete.svg";
import categoryIcon from "@/assets/icons/eye.svg";

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [categories, setCategories] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [lastPage, setLastPage] = useState(1);

  const fetchCategoriesData = async () => {
    try {
      setLoading(true);
      const response = await GetCategories({
        page,
        per_page: perPage,
        searchTerm: searchTerm || undefined,
      });

      setCategories( response.data );
      setTotalItems(response.meta?.total ?? 0);
      setLastPage(response.meta?.last_page ?? 1);
      setPage(response.meta?.current_page ?? 1);
      setPerPage(response.meta?.per_page ?? 10);
      
    } catch (error) {
      console.error("Error fetching categories data:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء جلب بيانات التصنيفات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await DeleteCategory(id);
      toast({
        title: "تم بنجاح",
        description: "تم حذف التصنيف بنجاح",
        variant: "success",
      });
      // Refetch data but stay on current page
      fetchCategoriesData();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف التصنيف",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchCategoriesData();
  }, [page, perPage, searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPage(1); // Reset to first page when searching
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setPage(1); // Reset to first page when changing items per page
  };

  const categoriesColumns: TableColumn[] = [
    {
      key: "image_column",
      header: "الصورة",
      render: (category) => (
        <div className="font-medium">
          {category.image ? (
            <img 
              width={40} 
              height={40} 
              src={category.image} 
              alt="category" 
              className="rounded-md object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
              <span className="text-xs text-gray-500">لا يوجد صورة</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "name",
      header: "اسم التصنيف",
      render: (category) => (
        <div className="space-y-1">
          <div className="text-sm font-medium">{category.name}</div>
        </div>
      ),
    },
    {
      key: "created_at",
      header: "تاريخ الإضافة",
      render: (category) => (
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">
            {new Date(category.created_at).toLocaleDateString()}
          </div>
        </div>
      ),
    },
    {
      key: "delete_column",
      header: "إجراءات",
      render: (category) => (
        <div className="font-medium ps-5 flex gap-3 ">
          <Link to={`/categories/edit/${category.id}`}>
          <button
            onClick={() => deleteCategory(category.id)}
            className="text-muted-foreground hover:text-destructive"
          >
            <img src={categoryIcon} alt="edit" width={20} />
          </button>
          </Link>
          <button
            onClick={() => deleteCategory(category.id)}
            className="text-muted-foreground hover:text-destructive"
          >
            <img src={Delete} alt="delete" width={20} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="md:flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-3xl font-bold text-foreground">
            إدارة التصنيفات
          </h1>
          <p className="text-muted-foreground">قائمة بجميع التصنيفات المتاحة</p>
        </div>
        <Link to="/categories/add" className="">
          <Button>
            <Building className="h-4 w-4 ml-2" />
            إضافة تصنيف جديد
          </Button>
        </Link>
      </div>

      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>البحث والتصفية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="البحث باسم التصنيف..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pr-9"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>قائمة التصنيفات</CardTitle>
        </CardHeader>
        <GeneralTable
          data={categories}
          columns={categoriesColumns}
          loading={loading}
          pagination={{
            page,
            perPage,
            total: totalItems,
            lastPage,
            onPageChange: setPage,
            onPerPageChange: handlePerPageChange,
          }}
        />
      </Card>
    </div>
  );
}