import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Form } from "@shared/schema";

export default function FormBuilder() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingForm, setEditingForm] = useState<Form | null>(null);
  const [formFields, setFormFields] = useState([
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'message', label: 'Message', type: 'textarea', required: true }
  ]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: forms = [] } = useQuery<Form[]>({
    queryKey: ["/api/forms"],
  });

  const createFormMutation = useMutation({
    mutationFn: async (formData: any) => {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success!", description: "Form created successfully." });
      queryClient.invalidateQueries({ queryKey: ["/api/forms"] });
      setIsDialogOpen(false);
    },
  });

  const FormDialog = () => {
    const [formData, setFormData] = useState({
      name: editingForm?.name || "",
      title: editingForm?.title || "",
      description: editingForm?.description || "",
      fields: editingForm?.fields || JSON.stringify(formFields, null, 2),
      isActive: editingForm?.isActive ?? true
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      createFormMutation.mutate(formData);
    };

    const addField = () => {
      const newField = {
        name: `field_${formFields.length + 1}`,
        label: 'New Field',
        type: 'text',
        required: false
      };
      setFormFields([...formFields, newField]);
      setFormData({
        ...formData,
        fields: JSON.stringify([...formFields, newField], null, 2)
      });
    };

    const removeField = (index: number) => {
      const updatedFields = formFields.filter((_, i) => i !== index);
      setFormFields(updatedFields);
      setFormData({
        ...formData,
        fields: JSON.stringify(updatedFields, null, 2)
      });
    };

    const updateField = (index: number, field: any) => {
      const updatedFields = formFields.map((f, i) => i === index ? field : f);
      setFormFields(updatedFields);
      setFormData({
        ...formData,
        fields: JSON.stringify(updatedFields, null, 2)
      });
    };

    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingForm ? "Edit Form" : "Create Form"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Form Name (ID)</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="contact-form"
                  required
                />
              </div>
              <div>
                <Label htmlFor="title">Form Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Contact Us"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Form description"
                rows={2}
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-4">
                <Label>Form Fields</Label>
                <Button
                  type="button"
                  onClick={addField}
                  variant="outline"
                  size="sm"
                >
                  <i className="fas fa-plus mr-2"></i>
                  Add Field
                </Button>
              </div>
              
              <div className="space-y-4">
                {formFields.map((field, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label>Field Name</Label>
                        <Input
                          value={field.name}
                          onChange={(e) => updateField(index, {...field, name: e.target.value})}
                          placeholder="field_name"
                        />
                      </div>
                      <div>
                        <Label>Label</Label>
                        <Input
                          value={field.label}
                          onChange={(e) => updateField(index, {...field, label: e.target.value})}
                          placeholder="Field Label"
                        />
                      </div>
                      <div>
                        <Label>Type</Label>
                        <Select value={field.type} onValueChange={(value) => updateField(index, {...field, type: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="tel">Phone</SelectItem>
                            <SelectItem value="textarea">Textarea</SelectItem>
                            <SelectItem value="select">Select</SelectItem>
                            <SelectItem value="checkbox">Checkbox</SelectItem>
                            <SelectItem value="radio">Radio</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={field.required}
                          onCheckedChange={(checked) => updateField(index, {...field, required: checked})}
                        />
                        <Label>Required</Label>
                        <Button
                          type="button"
                          onClick={() => removeField(index)}
                          variant="destructive"
                          size="sm"
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
              />
              <Label htmlFor="active">Active</Label>
            </div>

            <Button type="submit" className="w-full bg-dav-saffron hover:bg-dav-orange text-white">
              {editingForm ? "Update Form" : "Create Form"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-dav-maroon">Custom Forms</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-dav-saffron hover:bg-dav-orange text-white">
              <i className="fas fa-plus mr-2"></i>
              Create Form
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {forms.map((form) => (
          <Card key={form.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{form.title}</CardTitle>
                  <p className="text-sm text-gray-600">Form ID: {form.name}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={form.isActive ? "default" : "secondary"}>
                    {form.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    {form.description}
                  </p>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(form.createdAt!).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => {
                      setEditingForm(form);
                      setIsDialogOpen(true);
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <i className="fas fa-edit mr-1"></i>
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <FormDialog />
    </div>
  );
}