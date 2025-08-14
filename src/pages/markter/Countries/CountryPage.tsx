import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { GeneralTable } from "@/components/ui/tableCustom";
import { TableColumn } from "@/components/ui/tableCustom";
import { GetCountries, DeleteCountry } from "@/services/userService";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import Delete from "@/assets/icons/delete.svg";
import countryIcon from "@/assets/icons/eye.svg";

export default function CountriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastPage, setLastPage] = useState(1);

  const fetchCountriesData = async () => {
    try {
      setLoading(true);
      const response = await GetCountries({
        page,
        per_page: perPage,
        searchTerm: searchTerm || undefined,
      });
      setCountries(response.data as any);
      setTotalItems(response.meta?.total ||1);
      setLastPage(response.meta?.last_page || 1);
      setPage(response.meta?.current_page || 1);
      setPerPage(response.meta?.per_page || perPage);
      
    } catch (error) {
      console.error("Error fetching countries data:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء جلب بيانات الدول",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteCountry = async (id: number) => {
    try {
      await DeleteCountry(`${id}`);
      toast({
        title: "تم بنجاح",
        description: "تم حذف الدولة بنجاح",
        variant: "success",
      });
      
      // Check if we need to go back a page when deleting the last item
      if (countries.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchCountriesData(); // Just refresh current page
      }
      
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف الدولة",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchCountriesData();
  }, [page, perPage, searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPage(1); // Reset to first page when searching
  };

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setPage(1); // Reset to first page when changing items per page
  };

  const countriesColumns: TableColumn[] = [
    {
      key: "flag_column",
      header: "العلم",
      render: (country) => (
        <div className="font-medium">
          <img 
            width={40} 
            height={40} 
            src={country.image} 
            alt="country flag" 
            className="rounded-md object-cover"
          />
        </div>
      ),
    },
    {
      key: "name",
      header: "اسم الدولة",
      render: (country) => (
        <div className="space-y-1">
          <div className="text-sm font-medium">{country.name}</div>
        </div>
      ),
    },
    {
      key: "code",
      header: "كود الدولة",
      render: (country) => (
        <div className="space-y-1">
          <div className="text-sm">+{country.code}</div>
        </div>
      ),
    },

    {
      key: "actions_column",
      header: "إجراءات",
      render: (country) => (
           <div className="font-medium ps-5 flex gap-3">
          <Link to={`/countries/edit/${country.id}`}>
          <button
            onClick={() => deleteCountry(country.id)}
            className="text-muted-foreground hover:text-destructive"
            >
            <img src={countryIcon} alt="edit" width={20} />
          </button>
            </Link>
          <button
            onClick={() => deleteCountry(country.id)}
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
            إدارة الدول
          </h1>
          <p className="text-muted-foreground">قائمة بجميع الدول المتاحة</p>
        </div>
        <Link to="/countries/add" className="">
          <Button>
            <Building className="h-4 w-4 ml-2" />
            إضافة دولة جديدة
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
                  placeholder="البحث باسم الدولة أو الكود..."
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
          <CardTitle>قائمة الدول</CardTitle>
        </CardHeader>
        <GeneralTable
          data={countries}
          columns={countriesColumns}
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