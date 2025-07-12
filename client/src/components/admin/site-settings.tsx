import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import type { SiteSettings } from "@shared/schema";

interface SettingsFormData {
  [key: string]: string;
}

export default function SiteSettingsManager() {
  const [formData, setFormData] = useState<SettingsFormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings = [] } = useQuery<SiteSettings[]>({
    queryKey: ["/api/settings"],
  });

  useEffect(() => {
    if (settings.length > 0) {
      const initialData: SettingsFormData = {};
      settings.forEach(setting => {
        initialData[setting.key] = setting.value;
      });
      setFormData(initialData);
    }
  }, [settings]);

  const updateSettingsMutation = useMutation({
    mutationFn: async (settingsToUpdate: any[]) => {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settingsToUpdate)
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Settings updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = (category: string) => {
    setIsSubmitting(true);
    
    const settingsToUpdate = Object.entries(formData)
      .filter(([key]) => {
        const setting = settings.find(s => s.key === key);
        return setting?.category === category;
      })
      .map(([key, value]) => ({
        key,
        value,
        category
      }));

    updateSettingsMutation.mutate(settingsToUpdate);
  };

  const getDefaultSettings = () => {
    const defaults = {
      // Theme settings
      'theme.primary_color': '#FF9933',
      'theme.secondary_color': '#8B1538',
      'theme.accent_color': '#FF6B35',
      'theme.font_family': 'Inter',
      
      // Contact settings
      'contact.school_name': 'DAV Public School',
      'contact.address': 'Sector 12, Asansol - 713301',
      'contact.phone': '+91 341 234 5678',
      'contact.email': 'info@davpublicschoolasansol.edu.in',
      
      // Content settings
      'content.hero_title': 'Excellence in Education',
      'content.hero_subtitle': 'Nurturing young minds for a brighter tomorrow',
      'content.principal_name': 'Dr. Priya Sharma',
      'content.principal_message': 'Welcome to DAV Public School, Asansol!',
      
      // Social media
      'social.facebook': '#',
      'social.twitter': '#',
      'social.instagram': '#',
      'social.youtube': '#',
    };

    return defaults;
  };

  const initializeDefaultSettings = () => {
    const defaults = getDefaultSettings();
    const settingsToCreate = Object.entries(defaults).map(([key, value]) => {
      const category = key.split('.')[0];
      return { key, value, category };
    });

    updateSettingsMutation.mutate(settingsToCreate);
  };

  if (settings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">No settings found. Initialize default settings?</p>
        <Button
          onClick={initializeDefaultSettings}
          className="bg-dav-saffron hover:bg-dav-orange text-white"
        >
          Initialize Default Settings
        </Button>
      </div>
    );
  }

  return (
    <Tabs defaultValue="theme" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="theme">Theme & Colors</TabsTrigger>
        <TabsTrigger value="contact">Contact Info</TabsTrigger>
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="social">Social Media</TabsTrigger>
      </TabsList>

      <TabsContent value="theme">
        <Card>
          <CardHeader>
            <CardTitle>Theme & Color Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primary_color">Primary Color</Label>
                <Input
                  id="primary_color"
                  type="color"
                  value={formData['theme.primary_color'] || '#FF9933'}
                  onChange={(e) => handleInputChange('theme.primary_color', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="secondary_color">Secondary Color</Label>
                <Input
                  id="secondary_color"
                  type="color"
                  value={formData['theme.secondary_color'] || '#8B1538'}
                  onChange={(e) => handleInputChange('theme.secondary_color', e.target.value)}
                />
              </div>
            </div>
            <Button
              onClick={() => handleSubmit('theme')}
              disabled={isSubmitting}
              className="bg-dav-saffron hover:bg-dav-orange text-white"
            >
              {isSubmitting ? "Updating..." : "Update Theme"}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="contact">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="school_name">School Name</Label>
              <Input
                id="school_name"
                value={formData['contact.school_name'] || ''}
                onChange={(e) => handleInputChange('contact.school_name', e.target.value)}
                placeholder="DAV Public School"
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData['contact.address'] || ''}
                onChange={(e) => handleInputChange('contact.address', e.target.value)}
                placeholder="School address"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData['contact.phone'] || ''}
                  onChange={(e) => handleInputChange('contact.phone', e.target.value)}
                  placeholder="+91 341 234 5678"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData['contact.email'] || ''}
                  onChange={(e) => handleInputChange('contact.email', e.target.value)}
                  placeholder="info@school.edu.in"
                />
              </div>
            </div>
            <Button
              onClick={() => handleSubmit('contact')}
              disabled={isSubmitting}
              className="bg-dav-saffron hover:bg-dav-orange text-white"
            >
              {isSubmitting ? "Updating..." : "Update Contact Info"}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="content">
        <Card>
          <CardHeader>
            <CardTitle>Website Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="hero_title">Hero Section Title</Label>
              <Input
                id="hero_title"
                value={formData['content.hero_title'] || ''}
                onChange={(e) => handleInputChange('content.hero_title', e.target.value)}
                placeholder="Excellence in Education"
              />
            </div>
            <div>
              <Label htmlFor="hero_subtitle">Hero Section Subtitle</Label>
              <Input
                id="hero_subtitle"
                value={formData['content.hero_subtitle'] || ''}
                onChange={(e) => handleInputChange('content.hero_subtitle', e.target.value)}
                placeholder="Nurturing young minds for a brighter tomorrow"
              />
            </div>
            <div>
              <Label htmlFor="principal_name">Principal Name</Label>
              <Input
                id="principal_name"
                value={formData['content.principal_name'] || ''}
                onChange={(e) => handleInputChange('content.principal_name', e.target.value)}
                placeholder="Dr. Priya Sharma"
              />
            </div>
            <div>
              <Label htmlFor="principal_message">Principal Message</Label>
              <Textarea
                id="principal_message"
                value={formData['content.principal_message'] || ''}
                onChange={(e) => handleInputChange('content.principal_message', e.target.value)}
                placeholder="Welcome message from the principal"
                rows={4}
              />
            </div>
            <Button
              onClick={() => handleSubmit('content')}
              disabled={isSubmitting}
              className="bg-dav-saffron hover:bg-dav-orange text-white"
            >
              {isSubmitting ? "Updating..." : "Update Content"}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="social">
        <Card>
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="facebook">Facebook URL</Label>
                <Input
                  id="facebook"
                  value={formData['social.facebook'] || ''}
                  onChange={(e) => handleInputChange('social.facebook', e.target.value)}
                  placeholder="https://facebook.com/yourschool"
                />
              </div>
              <div>
                <Label htmlFor="twitter">Twitter URL</Label>
                <Input
                  id="twitter"
                  value={formData['social.twitter'] || ''}
                  onChange={(e) => handleInputChange('social.twitter', e.target.value)}
                  placeholder="https://twitter.com/yourschool"
                />
              </div>
              <div>
                <Label htmlFor="instagram">Instagram URL</Label>
                <Input
                  id="instagram"
                  value={formData['social.instagram'] || ''}
                  onChange={(e) => handleInputChange('social.instagram', e.target.value)}
                  placeholder="https://instagram.com/yourschool"
                />
              </div>
              <div>
                <Label htmlFor="youtube">YouTube URL</Label>
                <Input
                  id="youtube"
                  value={formData['social.youtube'] || ''}
                  onChange={(e) => handleInputChange('social.youtube', e.target.value)}
                  placeholder="https://youtube.com/yourschool"
                />
              </div>
            </div>
            <Button
              onClick={() => handleSubmit('social')}
              disabled={isSubmitting}
              className="bg-dav-saffron hover:bg-dav-orange text-white"
            >
              {isSubmitting ? "Updating..." : "Update Social Media"}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}