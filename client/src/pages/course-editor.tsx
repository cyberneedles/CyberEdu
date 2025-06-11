import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { EnhancedCourseForm } from '@/components/enhanced-course-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useLocation } from "wouter";
import { CoursePreviewPane } from "@/components/course-preview-pane";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function CourseEditor() {
  const [, setLocation] = useLocation();
  const [showPreview, setShowPreview] = useState(true);
  const navigate = useNavigate();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const response = await apiRequest('/api/courses');
      return response.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiRequest('/api/courses', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return response.data;
    },
    onSuccess: () => {
      setIsCreateOpen(false);
      toast({
        title: 'Success',
        description: 'Course created successfully'
      });
    }
  });

  const editMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiRequest(`/api/courses/${selectedCourse?.id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      return response.data;
    },
    onSuccess: () => {
      setIsEditOpen(false);
      toast({
        title: 'Success',
        description: 'Course updated successfully'
      });
    }
  });

  const onSubmit = (data: any) => {
    createMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => setLocation("/admin")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Admin
              </Button>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Create New Course
              </h1>
            </div>
            
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2"
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showPreview ? "Hide Preview" : "Show Preview"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`grid ${showPreview ? "grid-cols-2" : "grid-cols-1"} gap-8 h-[calc(100vh-8rem)]`}>
          {/* Form Section */}
          <div className="overflow-y-auto">
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Course Details</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input id="name" value={selectedCourse?.name} onChange={(e) => setSelectedCourse({ ...selectedCourse, name: e.target.value })} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Input id="description" value={selectedCourse?.description} onChange={(e) => setSelectedCourse({ ...selectedCourse, description: e.target.value })} className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={() => onSubmit(selectedCourse)}>Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Preview Section */}
          {showPreview && (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Live Preview</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">See how your course will look to students</p>
              </div>
              <div className="h-full overflow-y-auto">
                {/* Preview content will be injected here via the enhanced form */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}