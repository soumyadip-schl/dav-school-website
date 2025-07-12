import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import type { MenuItem } from "@shared/schema";

export default function MenuBuilder() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: menuItems = [] } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"],
  });

  const createMenuMutation = useMutation({
    mutationFn: async (menuData: any) => {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/menu-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(menuData)
      });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success!", description: "Menu item created successfully." });
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
      setIsDialogOpen(false);
    },
  });

  const updateMenuMutation = useMutation({
    mutationFn: async ({ id, ...menuData }: any) => {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/menu-items/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(menuData)
      });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success!", description: "Menu item updated successfully." });
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
      setEditingItem(null);
      setIsDialogOpen(false);
    },
  });

  const deleteMenuMutation = useMutation({
    mutationFn: async (id: number) => {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/menu-items/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success!", description: "Menu item deleted successfully." });
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
    },
  });

  const MenuDialog = () => {
    const [formData, setFormData] = useState({
      title: editingItem?.title || "",
      url: editingItem?.url || "",
      order: editingItem?.order || 0,
      isExternal: editingItem?.isExternal || false,
      isVisible: editingItem?.isVisible ?? true
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (editingItem) {
        updateMenuMutation.mutate({ id: editingItem.id, ...formData });
      } else {
        createMenuMutation.mutate(formData);
      }
    };

    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Edit Menu Item" : "Create Menu Item"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Menu Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => setFormData({...formData, url: e.target.value})}
                placeholder="/page-url or https://external-site.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="external"
                checked={formData.isExternal}
                onCheckedChange={(checked) => setFormData({...formData, isExternal: checked})}
              />
              <Label htmlFor="external">External Link</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="visible"
                checked={formData.isVisible}
                onCheckedChange={(checked) => setFormData({...formData, isVisible: checked})}
              />
              <Label htmlFor="visible">Visible</Label>
            </div>
            <Button type="submit" className="w-full bg-dav-saffron hover:bg-dav-orange text-white">
              {editingItem ? "Update Menu Item" : "Create Menu Item"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-dav-maroon">Navigation Menu</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-dav-saffron hover:bg-dav-orange text-white">
              <i className="fas fa-plus mr-2"></i>
              Add Menu Item
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {menuItems.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold">{item.title}</h3>
                    <Badge variant={item.isVisible ? "default" : "secondary"}>
                      {item.isVisible ? "Visible" : "Hidden"}
                    </Badge>
                    {item.isExternal && (
                      <Badge variant="outline">External</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    URL: {item.url}
                  </p>
                  <p className="text-sm text-gray-500">
                    Order: {item.order}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => {
                      setEditingItem(item);
                      setIsDialogOpen(true);
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <i className="fas fa-edit"></i>
                  </Button>
                  <Button
                    onClick={() => deleteMenuMutation.mutate(item.id)}
                    variant="destructive"
                    size="sm"
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <MenuDialog />
    </div>
  );
}