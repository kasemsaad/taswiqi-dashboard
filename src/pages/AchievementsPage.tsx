import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, Star, Trophy, Target, Users, TrendingUp, Edit, Upload, Medal, Crown, Coins } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const badgesData = [
  {
    id: 1,
    name: "المسوق المبتدئ",
    description: "إتمام أول عملية بيع بنجاح",
    icon: "🏆",
    level: "برونزي",
    conditions: "إتمام أول عملية بيع",
    earnedBy: 289,
    color: "bg-amber-600",
    minRequirement: 1,
    maxRequirement: 10,
    sortOrder: 1,
    isActive: true,
    reward: 50
  },
  {
    id: 2,
    name: "نجم التسويق",
    description: "تحقيق 10 مبيعات في شهر واحد",
    icon: "⭐",
    level: "فضي",
    conditions: "10 مبيعات في شهر واحد",
    earnedBy: 156,
    color: "bg-gray-400",
    minRequirement: 11,
    maxRequirement: 30,
    sortOrder: 2,
    isActive: true,
    reward: 100
  },
  {
    id: 3,
    name: "بطل المبيعات",
    description: "تحقيق 50 مبيعة والوصول للمرتبة الأولى",
    icon: "🥇",
    level: "ذهبي",
    conditions: "50 مبيعة والمرتبة الأولى",
    earnedBy: 45,
    color: "bg-yellow-500",
    minRequirement: 31,
    maxRequirement: 60,
    sortOrder: 3,
    isActive: true,
    reward: 250
  },
  {
    id: 4,
    name: "سفير العلامة التجارية",
    description: "العمل مع 5 شركات مختلفة بنجاح",
    icon: "🎖️",
    level: "بلاتيني",
    conditions: "العمل مع 5 شركات مختلفة",
    earnedBy: 23,
    color: "bg-slate-400",
    minRequirement: 61,
    maxRequirement: 100,
    sortOrder: 4,
    isActive: true,
    reward: 500
  },
  {
    id: 5,
    name: "أسطورة التسويق",
    description: "تحقيق أكثر من 100,000 ريال عمولة",
    icon: "👑",
    level: "ماسي",
    conditions: "تحقيق 100,000 ريال عمولة",
    earnedBy: 8,
    color: "bg-purple-600",
    minRequirement: 101,
    maxRequirement: null,
    sortOrder: 5,
    isActive: true,
    reward: 1000
  },
  {
    id: 6,
    name: "محرك المجتمع",
    description: "الحصول على 100 إعجاب في منشورات المجتمع",
    icon: "💪",
    level: "فضي",
    conditions: "100 إعجاب في المنشورات",
    earnedBy: 78,
    color: "bg-gray-400",
    minRequirement: 100,
    maxRequirement: null,
    sortOrder: 6,
    isActive: true,
    reward: 75
  }
];

const leaderboardData = [
  { rank: 1, name: "أحمد محمد العلي", badges: 5, totalReward: 1925, avatar: "👤" },
  { rank: 2, name: "فاطمة خالد السعد", badges: 4, totalReward: 925, avatar: "👤" },
  { rank: 3, name: "عبدالله صالح القحطاني", badges: 3, totalReward: 425, avatar: "👤" },
  { rank: 4, name: "نورا عبدالرحمن", badges: 3, totalReward: 400, avatar: "👤" },
  { rank: 5, name: "محمد سعد الدوسري", badges: 2, totalReward: 150, avatar: "👤" }
];

const recentAchievements = [
  {
    marketerName: "أحمد محمد العلي",
    badgeName: "بطل المبيعات",
    earnedDate: "منذ ساعة",
    level: "ذهبي"
  },
  {
    marketerName: "فاطمة خالد السعد",
    badgeName: "نجم التسويق",
    earnedDate: "منذ 3 ساعات",
    level: "فضي"
  },
  {
    marketerName: "عبدالله صالح القحطاني",
    badgeName: "المسوق المبتدئ",
    earnedDate: "منذ يوم",
    level: "برونزي"
  },
  {
    marketerName: "نورا عبدالرحمن",
    badgeName: "محرك المجتمع",
    earnedDate: "منذ يومين",
    level: "فضي"
  }
];

export default function AchievementsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    minRequirement: "",
    maxRequirement: "",
    level: "",
    sortOrder: "",
    isActive: true,
    reward: ""
  });

  const handleEdit = (badge) => {
    setEditingBadge(badge);
    setFormData({
      name: badge.name,
      description: badge.description,
      minRequirement: badge.minRequirement.toString(),
      maxRequirement: badge.maxRequirement?.toString() || "",
      level: badge.level,
      sortOrder: badge.sortOrder.toString(),
      isActive: badge.isActive,
      reward: badge.reward.toString()
    });
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingBadge(null);
    setFormData({
      name: "",
      description: "",
      minRequirement: "",
      maxRequirement: "",
      level: "",
      sortOrder: "",
      isActive: true,
      reward: ""
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    // هنا يتم حفظ البيانات
    console.log(editingBadge ? "تعديل الشارة:" : "إضافة شارة جديدة:", formData);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">الشارات والإنجازات</h1>
          <p className="text-muted-foreground mt-1">إدارة نظام التحفيز والمكافآت للمسوقين</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd}>
              <Award className="h-4 w-4 ml-2" />
              إضافة شارة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingBadge ? "تعديل الشارة" : "إضافة شارة جديدة"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">اسم الشارة</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="مثل: الذهبية، الماسية، شارة الأبطال..."
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="تمثل هذه الشارة التزامك وجذبك لأكثر من 60 عميل"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="minRequirement">الحد الأدنى للحصول على الشارة</Label>
                  <Input
                    id="minRequirement"
                    type="number"
                    value={formData.minRequirement}
                    onChange={(e) => setFormData({...formData, minRequirement: e.target.value})}
                    placeholder="مثل: 11"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="maxRequirement">الحد الأعلى (اختياري)</Label>
                  <Input
                    id="maxRequirement"
                    type="number"
                    value={formData.maxRequirement}
                    onChange={(e) => setFormData({...formData, maxRequirement: e.target.value})}
                    placeholder="مثل: 30"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="level">مستوى الشارة</Label>
                <Select value={formData.level} onValueChange={(value) => setFormData({...formData, level: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر مستوى الشارة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="برونزي">برونزي</SelectItem>
                    <SelectItem value="فضي">فضي</SelectItem>
                    <SelectItem value="ذهبي">ذهبي</SelectItem>
                    <SelectItem value="بلاتيني">بلاتيني</SelectItem>
                    <SelectItem value="ماسي">ماسي</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="reward">مكافأة الشارة (ريال سعودي)</Label>
                <Input
                  id="reward"
                  type="number"
                  value={formData.reward}
                  onChange={(e) => setFormData({...formData, reward: e.target.value})}
                  placeholder="مثل: 250"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="badgeIcon">رفع أيقونة الشارة</Label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 ml-2" />
                    اختر صورة
                  </Button>
                  <span className="text-sm text-muted-foreground">PNG, SVG (حتى 2MB)</span>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="sortOrder">ترتيب الظهور</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({...formData, sortOrder: e.target.value})}
                  placeholder="مثل: 1"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="isActive">تفعيل الشارة</Label>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} className="flex-1">
                  {editingBadge ? "حفظ التعديلات" : "إضافة الشارة"}
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  إلغاء
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="dashboard-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100">
                <Trophy className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">6</div>
                <p className="text-muted-foreground text-sm">إجمالي الشارات</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">599</div>
                <p className="text-muted-foreground text-sm">شارات محققة</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">45</div>
                <p className="text-muted-foreground text-sm">إنجازات هذا الأسبوع</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="dashboard-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">8</div>
                <p className="text-muted-foreground text-sm">شارات ماسية</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="badges" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="badges">إدارة الشارات</TabsTrigger>
          <TabsTrigger value="leaderboard">المتصدرين</TabsTrigger>
          <TabsTrigger value="rewards">الجوائز والمكافآت</TabsTrigger>
        </TabsList>

        <TabsContent value="badges" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Badges Management */}
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  إدارة الشارات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {badgesData.map((badge) => (
                    <div key={badge.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full ${badge.color} flex items-center justify-center text-white text-xl`}>
                          {badge.icon}
                        </div>
                        <div>
                          <h4 className="font-medium">{badge.name}</h4>
                          <p className="text-sm text-muted-foreground">{badge.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={
                              badge.level === "ماسي" ? "bg-purple-100 text-purple-800" :
                              badge.level === "ذهبي" ? "bg-yellow-100 text-yellow-800" :
                              badge.level === "فضي" ? "bg-gray-100 text-gray-800" :
                              badge.level === "بلاتيني" ? "bg-slate-100 text-slate-800" :
                              "bg-amber-100 text-amber-800"
                            }>
                              {badge.level}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              حصل عليها {badge.earnedBy} مسوق
                            </span>
                            <Badge variant="outline" className="text-green-600">
                              +{badge.reward} ريال
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(badge)}>
                        <Edit className="h-4 w-4 ml-1" />
                        تعديل
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  الإنجازات الأخيرة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAchievements.map((achievement, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Trophy className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{achievement.marketerName}</p>
                          <p className="text-sm text-muted-foreground">
                            حصل على شارة "{achievement.badgeName}"
                          </p>
                        </div>
                      </div>
                      <div className="text-left">
                        <Badge className={
                          achievement.level === "ذهبي" ? "bg-yellow-100 text-yellow-800" :
                          achievement.level === "فضي" ? "bg-gray-100 text-gray-800" :
                          "bg-amber-100 text-amber-800"
                        }>
                          {achievement.level}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">{achievement.earnedDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Medal className="h-5 w-5" />
                تقرير المتصدرين في الشارات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المرتبة</TableHead>
                    <TableHead>المسوق</TableHead>
                    <TableHead>عدد الشارات</TableHead>
                    <TableHead>إجمالي المكافآت</TableHead>
                    <TableHead>أحدث شارة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboardData.map((marketer) => (
                    <TableRow key={marketer.rank}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {marketer.rank === 1 && <Crown className="h-4 w-4 text-yellow-500" />}
                          {marketer.rank === 2 && <Medal className="h-4 w-4 text-gray-400" />}
                          {marketer.rank === 3 && <Medal className="h-4 w-4 text-amber-600" />}
                          <span className="font-medium">#{marketer.rank}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            {marketer.avatar}
                          </div>
                          <span className="font-medium">{marketer.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{marketer.badges} شارة</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Coins className="h-4 w-4 text-yellow-600" />
                          <span className="font-medium">{marketer.totalReward} ريال</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">أسطورة التسويق</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-6">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5" />
                الجوائز والمكافآت لكل شارة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {badgesData.map((badge) => (
                  <div key={badge.id} className="p-4 border border-border rounded-lg bg-gradient-to-br from-background to-muted/50">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-full ${badge.color} flex items-center justify-center text-white text-xl`}>
                        {badge.icon}
                      </div>
                      <div>
                        <h4 className="font-medium">{badge.name}</h4>
                        <Badge className={
                          badge.level === "ماسي" ? "bg-purple-100 text-purple-800" :
                          badge.level === "ذهبي" ? "bg-yellow-100 text-yellow-800" :
                          badge.level === "فضي" ? "bg-gray-100 text-gray-800" :
                          badge.level === "بلاتيني" ? "bg-slate-100 text-slate-800" :
                          "bg-amber-100 text-amber-800"
                        }>
                          {badge.level}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2">
                          <Coins className="h-5 w-5 text-green-600" />
                          <span className="font-medium text-green-800">مكافأة نقدية</span>
                        </div>
                        <span className="font-bold text-green-700">{badge.reward} ريال</span>
                      </div>
                      
                      <div className="text-sm space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">الشرط:</span>
                          <span>{badge.conditions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">حصل عليها:</span>
                          <span>{badge.earnedBy} مسوق</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">إجمالي المدفوع:</span>
                          <span className="font-medium">{(badge.reward * badge.earnedBy).toLocaleString()} ريال</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
                <div className="flex items-center gap-3 mb-3">
                  <Trophy className="h-6 w-6 text-primary" />
                  <h3 className="font-medium text-lg">إحصائيات المكافآت</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {badgesData.reduce((sum, badge) => sum + (badge.reward * badge.earnedBy), 0).toLocaleString()}
                    </div>
                    <p className="text-sm text-muted-foreground">إجمالي المكافآت المدفوعة (ريال)</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {badgesData.reduce((sum, badge) => sum + badge.earnedBy, 0)}
                    </div>
                    <p className="text-sm text-muted-foreground">إجمالي الشارات المحققة</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {Math.round(badgesData.reduce((sum, badge) => sum + (badge.reward * badge.earnedBy), 0) / badgesData.reduce((sum, badge) => sum + badge.earnedBy, 0))}
                    </div>
                    <p className="text-sm text-muted-foreground">متوسط المكافأة (ريال)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Badge Conditions */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>شروط الحصول على الشارات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badgesData.map((badge) => (
              <div key={badge.id} className="p-4 border border-border rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-8 h-8 rounded-full ${badge.color} flex items-center justify-center text-white text-sm`}>
                    {badge.icon}
                  </div>
                  <h4 className="font-medium">{badge.name}</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{badge.conditions}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{badge.level}</Badge>
                  <span className="text-xs text-muted-foreground">{badge.earnedBy} مسوق</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}