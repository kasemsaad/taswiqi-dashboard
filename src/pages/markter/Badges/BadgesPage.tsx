import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building } from "lucide-react";
import { Input } from "@/components/ui/input";
import { GeneralTable } from "@/components/ui/tableCustom";
import { TableColumn } from "@/components/ui/tableCustom";
import {
  GetAllpadges,
  GetBadgeNumbers,
  deleteBadges,
} from "@/services/userService";
import { Users } from "@/components/interfaces/Interfaces";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Delete from "@/assets/icons/delete.svg";
import { toast } from "@/hooks/use-toast";
import Eye from "@/assets/icons/eye.svg";

export default function MarketersPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [Badge, setBadge] = useState([] as Users[]);

  const [BadgeNumbers, setBadgeNumbers] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchBadgeData = async () => {
    try {

      setLoading(true);
      const response = await GetAllpadges({
        page,
        per_page: perPage,
        searchTerm: searchTerm || undefined,
        // filter:
        //   statusFilter !== "all" || categoryFilter !== "all"
        //     ? {
        //         is_active: statusFilter ?? null,
        //         category_id: categoryFilter ?? null,
        //       }
        //     : undefined,
      });
      const Badgepage = response as any;
      const BadgeData = response.data as Users[];
      setBadge(BadgeData);
      setPage(Badgepage.meta.current_page);
      setPerPage(Badgepage.meta.per_page);
      setTotalItems(Badgepage.meta.total);
    } catch (error) {
      console.error("Error fetching Badge data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBadgeNumbers = async () => {
    try {
      const response = await GetBadgeNumbers();
      const BadgeData = response.data as any;
      setBadgeNumbers(BadgeData);
    } catch (error) {
      console.error("Error fetching country data:", error);
    }
  };

  const deleteBadgesFunction = async (id) => {
    try {
      await deleteBadges(id);
      fetchBadgeData();

      toast({
        title: " الحذف تم",
        description: "تم حذف الشارة بنجاح",
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: "خطأ في الحذف",
        description: "حدث خطأ أثناء حذف الشارة",

        variant: "destructive",
      });
      console.error("Error fetching Categories:", error);
    }
  };
  useEffect(() => {
    fetchBadgeData();
    fetchBadgeNumbers();
  }, [page, perPage, searchTerm,]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPage(1);
  };

  // const handleViewProfile = (marketer: any) => {
  //   navigate(`/marketers/${marketer.id}`);
  // };

  const marketersColumns: TableColumn[] = [

      {
      key: "name",
      header: "أسم الشارة ",
      render: (marketer) => (
        <div className="space-y-1">
          <div className="text-sm">{marketer.name}</div>
        </div>
      ),
    },
    {
      key: "image",
      header: "الأيقونة",
      render: (marketer) => (
        <div>
          <div className="font-medium ">
            {/* <a href={`/companies/${marketer.id}`}> */}
              <img width={70} height={70} src={marketer.image} alt="company" />
            {/* </a> */}
          </div>
        </div>
      ),
    },
 
    {
      key: "no_clients_from",
      header: "نطاق العملاء",
      render: (marketer) => (
        <div className="space-y-1">
          <div className="text-sm">{"من"+" "+marketer.no_clients_from+" "+"الي"+" "+marketer.no_clients_to}</div>
        </div>
      ),
    },
    {
      key: "description",
      header: "الوصف",
      render: (marketer) => (
        <div className="space-y-1">
          <div className="text-sm">{marketer.description}</div>
        </div>
      ),
    },
    {
      key: "id",
      header: "اجراءات",
      render: (marketer) => (
        <div className="font-medium  gap-4 flex">
            <button
            onClick={() => navigate(`edit/${marketer.id}`)}
            className="text-muted-foreground hover:text-destructive"
          >
            <img src={Eye} alt="view" />
          </button>
          <button
            onClick={() => {
              deleteBadgesFunction(marketer.id);
            }}
            className="text-muted-foreground hover:text-destructive"
          >
            <img src={Delete} alt="company" />
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
          <h1 className="text-xl md:text-3xl font-bold text-foreground">نظام الشارات</h1>
          <p className="text-muted-foreground mt-1">
            قائمة بجميع الشارات والإنجازات
          </p>
        </div>
        <Link to="/badges/add" className="">
          <Button>
            <Building className="h-4 w-4 ml-2" />
            إضافة شارة جديدة{" "}
          </Button>
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 overflow-y-auto h-[27vh] gap-4">
        {BadgeNumbers?.padges_info?.map((badge, index) => (
          <Card key={index} className="dashboard-card">
            <CardContent className="pt-6 flex flex-col items-center text-center space-y-2">
              <img
                src={badge.image}
                alt={badge.padge}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="text-lg font-semibold">{badge.padge}</div>
              <div className="text-2xl font-bold">{badge.no_customers}</div>
              <p className="text-muted-foreground text-sm">عدد المسوقين</p>
            </CardContent>
          </Card>
        ))}
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
                  placeholder="البحث..."
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
          <CardTitle>قائمة الشركات</CardTitle>
        </CardHeader>
        <GeneralTable
          data={Badge}
          columns={marketersColumns}
          loading={loading}
          // actions={{
          //   view: handleViewProfile,
          // }}
          pagination={{
            page,
            perPage,
            total: totalItems,
            onPageChange: setPage,
            onPerPageChange: (newPerPage) => {
              setPerPage(newPerPage);
              setPage(1);
            },
          }}
        />
      </Card>
    </div>
  );
}
