import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  MoreHorizontal,
  Eye,
  MessageSquare,
  Ban,
  Upload,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useState } from "react";

export interface TableColumn {
  key: string;
  header: string;
  render?: (data: any) => React.ReactNode;
  className?: string;
}

interface GeneralTableProps {
  data: any[];
  columns: TableColumn[];
  actions?: {
    view?: (item: any) => void;
    message?: (item: any) => void;
    block?: (item: any) => void;
    customActions?: {
      label: string;
      icon: React.ReactNode;
      action: (item: any) => void;
      className?: string;
    }[];
  };
  loading?: boolean;
  rtl?: boolean;
  className?: string;
  pagination?: {
    page: number;
    perPage: number;
    total: number;
    onPageChange: (page: number) => void;
    onPerPageChange: (perPage: number) => void;
  };
  showActions?: boolean;
}

export const GeneralTable = ({
  data,
  columns,
  actions,
  loading = false,
  rtl = true,
  className = "",
  pagination,
  showActions = true,
}: GeneralTableProps) => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationImage, setNotificationImage] = useState<File | null>(null);
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);

  const totalPages = pagination ? Math.ceil(pagination.total / pagination.perPage) : 1;
  const startItem = pagination ? (pagination.page - 1) * pagination.perPage + 1 : 1;
  const endItem = pagination 
    ? Math.min(pagination.page * pagination.perPage, pagination.total)
    : data?.length;

  const handleSendNotification = () => {
    if (actions?.message && selectedItem) {
      actions.message({
        item: selectedItem,
        message: notificationMessage,
        image: notificationImage,
      });
    }
    setNotificationMessage("");
    setNotificationImage(null);
  };

  const handleBlockAccount = () => {
    if (actions?.block && selectedItem) {
      actions.block(selectedItem);
    }
    setIsBlockDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className={`overflow-x-auto ${className}`}>
        <Table className={rtl ? "rtl-table" : ""}>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
              {showActions && actions && <TableHead>الإجراءات</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  {columns.map((column) => (
                    <TableCell key={`${column.key}-${index}`}>
                      <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                  ))}
                  {showActions && (
                    <TableCell>
                      <Skeleton className="h-4 w-[50px]" />
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : data?.length > 0 ? (
              data?.map((item) => (
                <TableRow key={item.id}>
                  {columns.map((column) => (
                    <TableCell key={`${column.key}-${item.id}`} className={column.className}>
                      {column.render ? column.render(item) : item[column.key]}
                    </TableCell>
                  ))}
                  {showActions && actions && (
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {actions.view && (
                            <DropdownMenuItem onClick={() => actions.view?.(item)}>
                              <Eye className="h-4 w-4 ml-2" />
                              عرض الملف الشخصي
                            </DropdownMenuItem>
                          )}
                          {actions.message && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => {
                                    e.preventDefault();
                                    setSelectedItem(item);
                                  }}
                                >
                                  <MessageSquare className="h-4 w-4 ml-2" />
                                  إرسال رسالة
                                </DropdownMenuItem>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>إرسال إشعار</DialogTitle>
                                  <DialogDescription>
                                    اكتب رسالة الإشعار التي تريد إرسالها إلى {item.name}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="notification">نص الإشعار</Label>
                                    <Textarea
                                      id="notification"
                                      placeholder="اكتب رسالة الإشعار هنا..."
                                      value={notificationMessage}
                                      onChange={(e) => setNotificationMessage(e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="image">صورة (اختياري)</Label>
                                    <div className="flex items-center gap-2">
                                      <Input
                                        id="image"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                          setNotificationImage(e.target.files?.[0] || null)
                                        }
                                        className="flex-1"
                                      />
                                      <Upload className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button onClick={handleSendNotification}>إرسال الإشعار</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          )}
                          {actions.block && (
                            <Dialog
                              open={isBlockDialogOpen}
                              onOpenChange={setIsBlockDialogOpen}
                            >
                              <DialogTrigger asChild>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onSelect={(e) => {
                                    e.preventDefault();
                                    setSelectedItem(item);
                                    setIsBlockDialogOpen(true);
                                  }}
                                >
                                  <Ban className="h-4 w-4 ml-2" />
                                  إيقاف الحساب
                                </DropdownMenuItem>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>تأكيد حظر الحساب</DialogTitle>
                                  <DialogDescription>
                                    هل أنت متأكد من أنك تريد حظر حساب {item.name}؟ هذا الإجراء سيمنع
                                    المستخدم من الوصول إلى حسابه.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button
                                    variant="outline"
                                    onClick={() => setIsBlockDialogOpen(false)}
                                  >
                                    إلغاء
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={handleBlockAccount}
                                  >
                                    تأكيد الحظر
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + (showActions ? 1 : 0)} className="text-center">
                  لا توجد بيانات متاحة
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

          
      {pagination && (
        <div className="flex flex-col px-5 sm:flex-row items-center justify-between gap-4 py-2">
          <div className="text-sm text-muted-foreground">
            عرض {startItem}-{endItem} من {pagination.total} عنصر
          </div>
          <div className="flex items-center gap-4 px-5 py-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">عناصر لكل صفحة:</span>
              <Select
                value={pagination.perPage.toString()}
                onValueChange={(value) => pagination.onPerPageChange(Number(value))}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={pagination.perPage} />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 30, 40, 50].map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 ">
              <Button
                variant="outline"
                size="sm"
                onClick={() => pagination.onPageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-1">
                {pagination.page > 2 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => pagination.onPageChange(1)}
                  >
                    1
                  </Button>
                )}
                {pagination.page > 3 && <span className="px-2">...</span>}
                
                {pagination.page > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => pagination.onPageChange(pagination.page - 1)}
                  >
                    {pagination.page - 1}
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary"
                >
                  {pagination.page}
                </Button>
                
                {pagination.page < totalPages && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => pagination.onPageChange(pagination.page + 1)}
                  >
                    {pagination.page + 1}
                  </Button>
                )}
                
                {pagination.page < totalPages - 2 && <span className="px-2">...</span>}
                {pagination.page < totalPages - 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => pagination.onPageChange(totalPages)}
                  >
                    {totalPages}
                  </Button>
                )}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => pagination.onPageChange(pagination.page + 1)}
                disabled={pagination.page >= totalPages}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};