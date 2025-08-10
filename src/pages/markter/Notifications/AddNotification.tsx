import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Notifications, GetAllCustomersNotMeta } from "@/services/userService";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";

const NotificationsPage = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [formData, setFormData] = useState({
    "title[ar]": "",
    "title[en]": "",
    "body[ar]": "",
    "body[en]": "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await GetAllCustomersNotMeta();
        if (response.data) {
          setUsers((response.data as any));
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleUserSelect = (userId: number) => {
    setSelectedUserIds(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
    setSelectAll(false);
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedUserIds([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Append text fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      
      // Append target based on selection
      if (selectAll) {
        formDataToSend.append("target", "all_users");
      } else if (selectedUserIds.length > 0) {
        selectedUserIds.forEach(id => {
           formDataToSend.append("target", "given_ids");
          formDataToSend.append("users[]", id.toString());
        });
      } else {
        toast({
          title: "خطأ",
          description: "يجب اختيار مستخدمين أو تحديد 'إرسال للجميع'",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Append image file if exists
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      await Notifications(formDataToSend);
      
      toast({
        title: "تمت الإضافة بنجاح",
        description: "تم إنشاء الإشعار بنجاح",
        variant: "success",
      });
      
      // Reset form after successful submission
      setFormData({
        "title[ar]": "",
        "title[en]": "",
        "body[ar]": "",
        "body[en]": "",
      });
      setSelectedUserIds([]);
      setSelectAll(false);
      setImageFile(null);
      
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إنشاء الإشعار",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">إضافة إشعار</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>أدخل بيانات الإشعار</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Arabic Title */}
              <div className="space-y-2">
                <Label htmlFor="title-ar">العنوان (العربية)</Label>
                <Input
                  id="title-ar"
                  name="title[ar]"
                  value={formData["title[ar]"]}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* English Title */}
              <div className="space-y-2">
                <Label htmlFor="title-en">العنوان (الإنجليزية)</Label>
                <Input
                  id="title-en"
                  name="title[en]"
                  value={formData["title[en]"]}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Arabic Body */}
              <div className="space-y-2 ">
                <Label htmlFor="body-ar">المحتوى (العربية)</Label>
                <textarea
                  id="body-ar"
                  name="body[ar]"
                  value={formData["body[ar]"]}
                  onChange={handleInputChange}
                  className="flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                />
              </div>

              {/* English Body */}
              <div className="space-y-2 ">
                <Label htmlFor="body-en">المحتوى (الإنجليزية)</Label>
                <textarea
                  id="body-en"
                  name="body[en]"
                  value={formData["body[en]"]}
                  onChange={handleInputChange}
                  className="flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                />
              </div>

              {/* User Selection */}
              <div className="space-y-2 ">
               

                {!selectAll && (
                  <>
                    <Label>اختيار مستخدمين محددين</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المستخدمين">
                          {selectedUserIds.length > 0 
                            ? `تم اختيار ${selectedUserIds.length} مستخدم` 
                            : "اختر المستخدمين"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="p-0">
                        <Command shouldFilter={false}>
                          <CommandInput
                            placeholder="ابحث عن مستخدم..."
                            value={searchTerm}
                            onValueChange={setSearchTerm}
                          />
                          <CommandList>
                            <CommandEmpty>لا توجد نتائج</CommandEmpty>
                            <CommandGroup>
                              {filteredUsers.map((user) => (
                                <CommandItem
                                  key={user.id}
                                  value={user.id.toString()}
                                  onSelect={() => handleUserSelect(user.id)}
                                >
                                  <div className="flex items-center gap-2">
                                    <Checkbox
                                      checked={selectedUserIds.includes(user.id)}
                                      onCheckedChange={() => handleUserSelect(user.id)}
                                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <span>{user.name}</span>
                                    {user.completed_profile ? (
                                      <span className="text-xs text-green-500">(مكتمل)</span>
                                    ):
                                    (
                                      <span className="text-xs text-red-600">( غير مكتمل )</span>
                                    )
                                    }
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </SelectContent>
                    </Select>
                    {selectedUserIds.length > 0 && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        تم اختيار {selectedUserIds.length} مستخدم
                      </div>
                    )}
                  </>
                )}
                 <div className="flex items-center space-x-2 mb-2">
                  <Checkbox
                    id="select-all"
                    checked={selectAll}
                    onCheckedChange={handleSelectAll}
                  />
                  <Label className="px-2" htmlFor="select-all">إرسال الإشعار لجميع المستخدمين</Label>
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-2 ">
                <Label htmlFor="image">صورة الإشعار (اختياري)</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {imageFile && (
                  <div className="mt-2">
                    <p className="text-sm">تم اختيار: {imageFile.name}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="submit"
            className="bg-primary gap-2 hover:bg-primary"
            disabled={isLoading || (!selectAll && selectedUserIds.length === 0)}
          >
            {isLoading ? "جاري الحفظ..." : (
              <>
                <Save className="w-4 h-4" />
                حفظ الإشعار
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NotificationsPage;