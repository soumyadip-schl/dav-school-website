import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import type { Page, PageComponent } from "@shared/schema";

export default function PageBuilder() {
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isComponentDialogOpen, setIsComponentDialogOpen] = useState(false);
  const [editingComponent, setEditingComponent] = useState<PageComponent | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pages = [] } = useQuery<Page[]>({
    queryKey: ["/api/pages"],
  });

  const { data: pageComponents = [] } = useQuery<PageComponent[]>({
    queryKey: ["/api/pages", selectedPage?.id, "components"],
    enabled: !!selectedPage,
  });

  const createPageMutation = useMutation({
    mutationFn: async (pageData: any) => {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(pageData)
      });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success!", description: "Page created successfully." });
      queryClient.invalidateQueries({ queryKey: ["/api/pages"] });
      setIsCreateDialogOpen(false);
    },
  });

  const updatePageMutation = useMutation({
    mutationFn: async ({ id, ...pageData }: any) => {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/pages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(pageData)
      });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success!", description: "Page updated successfully." });
      queryClient.invalidateQueries({ queryKey: ["/api/pages"] });
    },
  });

  const deletePageMutation = useMutation({
    mutationFn: async (id: number) => {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/pages/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success!", description: "Page deleted successfully." });
      queryClient.invalidateQueries({ queryKey: ["/api/pages"] });
      setSelectedPage(null);
    },
  });

  const createComponentMutation = useMutation({
    mutationFn: async (componentData: any) => {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/page-components', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(componentData)
      });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success!", description: "Component added successfully." });
      queryClient.invalidateQueries({ queryKey: ["/api/pages", selectedPage?.id, "components"] });
      setIsComponentDialogOpen(false);
    },
  });

  const updateComponentMutation = useMutation({
    mutationFn: async ({ id, ...componentData }: any) => {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/page-components/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(componentData)
      });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success!", description: "Component updated successfully." });
      queryClient.invalidateQueries({ queryKey: ["/api/pages", selectedPage?.id, "components"] });
      setEditingComponent(null);
    },
  });

  const deleteComponentMutation = useMutation({
    mutationFn: async (id: number) => {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/page-components/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success!", description: "Component deleted successfully." });
      queryClient.invalidateQueries({ queryKey: ["/api/pages", selectedPage?.id, "components"] });
    },
  });

  const CreatePageDialog = () => {
    const [formData, setFormData] = useState({
      title: "",
      slug: "",
      content: "",
      layout: "default",
      metaTitle: "",
      metaDescription: "",
      isPublished: true,
      order: 0
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      createPageMutation.mutate(formData);
    };

    return (
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-dav-saffron hover:bg-dav-orange text-white">
            <i className="fas fa-plus mr-2"></i>
            Create New Page
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Page</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Page Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  placeholder="page-url"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="content">Page Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                rows={4}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="layout">Layout</Label>
                <Select value={formData.layout} onValueChange={(value) => setFormData({...formData, layout: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="fullwidth">Full Width</SelectItem>
                    <SelectItem value="sidebar">With Sidebar</SelectItem>
                  </SelectContent>
                </Select>
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
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={formData.isPublished}
                onCheckedChange={(checked) => setFormData({...formData, isPublished: checked})}
              />
              <Label htmlFor="published">Published</Label>
            </div>
            <Button type="submit" className="w-full bg-dav-saffron hover:bg-dav-orange text-white">
              Create Page
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  const ComponentDialog = () => {
    const [componentData, setComponentData] = useState({
      componentType: "text",
      componentData: JSON.stringify({
        title: "",
        content: "",
        buttonText: "",
        buttonUrl: "",
        imageUrl: "",
        alignment: "left"
      }),
      order: 0,
      isVisible: true
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const data = {
        ...componentData,
        pageId: selectedPage?.id
      };
      
      if (editingComponent) {
        updateComponentMutation.mutate({ id: editingComponent.id, ...data });
      } else {
        createComponentMutation.mutate(data);
      }
    };

    return (
      <Dialog open={isComponentDialogOpen} onOpenChange={setIsComponentDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingComponent ? "Edit Component" : "Add Component"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="componentType">Component Type</Label>
              <Select value={componentData.componentType} onValueChange={(value) => setComponentData({...componentData, componentType: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text Block</SelectItem>
                  <SelectItem value="hero">Hero Section</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="gallery">Image Gallery</SelectItem>
                  <SelectItem value="button">Button</SelectItem>
                  <SelectItem value="form">Contact Form</SelectItem>
                  <SelectItem value="video">Video Embed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="componentData">Component Configuration (JSON)</Label>
              <Textarea
                id="componentData"
                value={componentData.componentData}
                onChange={(e) => setComponentData({...componentData, componentData: e.target.value})}
                rows={6}
                placeholder='{"title": "Your Title", "content": "Your content here"}'
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="order">Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={componentData.order}
                  onChange={(e) => setComponentData({...componentData, order: parseInt(e.target.value)})}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="visible"
                  checked={componentData.isVisible}
                  onCheckedChange={(checked) => setComponentData({...componentData, isVisible: checked})}
                />
                <Label htmlFor="visible">Visible</Label>
              </div>
            </div>
            <Button type="submit" className="w-full bg-dav-saffron hover:bg-dav-orange text-white">
              {editingComponent ? "Update Component" : "Add Component"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-dav-maroon">Page Builder</h2>
        <CreatePageDialog />
      </div>

      <Tabs defaultValue="pages" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pages">All Pages</TabsTrigger>
          <TabsTrigger value="editor">Page Editor</TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="space-y-4">
          <div className="grid gap-4">
            {pages.map((page) => (
              <Card key={page.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{page.title}</CardTitle>
                      <p className="text-sm text-gray-600">/{page.slug}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={page.isPublished ? "default" : "secondary"}>
                        {page.isPublished ? "Published" : "Draft"}
                      </Badge>
                      <Badge variant="outline">{page.layout}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                      Created: {new Date(page.createdAt!).toLocaleDateString()}
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => setSelectedPage(page)}
                        variant="outline"
                        size="sm"
                      >
                        <i className="fas fa-edit mr-1"></i>
                        Edit
                      </Button>
                      <Button
                        onClick={() => deletePageMutation.mutate(page.id)}
                        variant="destructive"
                        size="sm"
                      >
                        <i className="fas fa-trash mr-1"></i>
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="editor" className="space-y-4">
          {selectedPage ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Editing: {selectedPage.title}</span>
                    <Button
                      onClick={() => setIsComponentDialogOpen(true)}
                      className="bg-dav-saffron hover:bg-dav-orange text-white"
                    >
                      <i className="fas fa-plus mr-2"></i>
                      Add Component
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pageComponents.map((component) => (
                      <Card key={component.id} className="border-l-4 border-dav-saffron">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <Badge variant="outline" className="mb-2">
                                {component.componentType}
                              </Badge>
                              <p className="text-sm text-gray-600">
                                Order: {component.order} | 
                                {component.isVisible ? " Visible" : " Hidden"}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                onClick={() => {
                                  setEditingComponent(component);
                                  setIsComponentDialogOpen(true);
                                }}
                                variant="outline"
                                size="sm"
                              >
                                <i className="fas fa-edit"></i>
                              </Button>
                              <Button
                                onClick={() => deleteComponentMutation.mutate(component.id)}
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
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <i className="fas fa-file-alt text-4xl mb-4"></i>
              <p>Select a page to edit its components</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <ComponentDialog />
    </div>
  );
}