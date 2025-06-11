import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Course } from '@/types/course';

interface CoursePreviewPaneProps {
  course: Course;
}

export const CoursePreviewPane: React.FC<CoursePreviewPaneProps> = ({ course }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Course Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">{course.title}</h3>
            <p className="text-muted-foreground">{course.description}</p>
          </div>
          <div>
            <h4 className="font-medium">Duration</h4>
            <p>{course.duration}</p>
          </div>
          <div>
            <h4 className="font-medium">Level</h4>
            <p>{course.level}</p>
          </div>
          <div>
            <h4 className="font-medium">Price</h4>
            <p>{course.price ? `₹${course.price.toLocaleString()}` : 'Contact for pricing'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};