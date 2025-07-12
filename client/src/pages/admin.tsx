import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreatePost from "@/components/admin/create-post";
import PostsList from "@/components/admin/posts-list";
import CreateUser from "@/components/admin/create-user";
import SiteSettingsManager from "@/components/admin/site-settings";
import PageBuilder from "@/components/admin/page-builder";
import MenuBuilder from "@/components/admin/menu-builder";
import FormBuilder from "@/components/admin/form-builder";

export default function Admin() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [, setLocation] = useLocation();

  if (!isAuthenticated || !isAdmin) {
    setLocation("/admin/login");
    return null;
  }

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-dav-light">
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-dav-maroon">Admin Panel</h1>
            <p className="text-gray-600">Welcome, {user?.username}</p>
          </div>
          <div className="flex space-x-4">
            <Button
              onClick={() => setLocation("/")}
              variant="outline"
              className="border-dav-saffron text-dav-saffron hover:bg-dav-saffron hover:text-white"
            >
              <i className="fas fa-home mr-2"></i>
              View Website
            </Button>
            <Button
              onClick={handleLogout}
              variant="destructive"
            >
              <i className="fas fa-sign-out-alt mr-2"></i>
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="posts">Posts & Media</TabsTrigger>
            <TabsTrigger value="manage-posts">Manage Posts</TabsTrigger>
            <TabsTrigger value="pages">Page Builder</TabsTrigger>
            <TabsTrigger value="menu">Navigation</TabsTrigger>
            <TabsTrigger value="forms">Forms</TabsTrigger>
            <TabsTrigger value="settings">Website Settings</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-dav-maroon">
                  <i className="fas fa-plus-circle mr-2"></i>
                  Create New Post
                </CardTitle>
                <CardDescription>
                  Add new posts with images that will automatically appear in the gallery
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CreatePost />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage-posts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-dav-maroon">
                  <i className="fas fa-list mr-2"></i>
                  All Posts
                </CardTitle>
                <CardDescription>
                  View and manage all posts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PostsList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-dav-maroon">
                  <i className="fas fa-hammer mr-2"></i>
                  Page Builder
                </CardTitle>
                <CardDescription>
                  Create new pages, add components, buttons, and customize layouts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PageBuilder />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="menu" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-dav-maroon">
                  <i className="fas fa-bars mr-2"></i>
                  Navigation Menu
                </CardTitle>
                <CardDescription>
                  Add, edit, or remove navigation menu items and customize the website menu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MenuBuilder />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forms" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-dav-maroon">
                  <i className="fas fa-wpforms mr-2"></i>
                  Form Builder
                </CardTitle>
                <CardDescription>
                  Create custom forms with any fields you need - contact forms, applications, surveys
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormBuilder />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-dav-maroon">
                  <i className="fas fa-cog mr-2"></i>
                  Website Settings
                </CardTitle>
                <CardDescription>
                  Customize colors, contact information, content, and social media links
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SiteSettingsManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-dav-maroon">
                  <i className="fas fa-user-plus mr-2"></i>
                  Create New Admin User
                </CardTitle>
                <CardDescription>
                  Add new admin users who can create posts and manage content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CreateUser />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}