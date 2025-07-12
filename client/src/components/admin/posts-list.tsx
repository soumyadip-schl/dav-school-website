import { useQuery } from "@tanstack/react-query";
import type { Post } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PostsList() {
  const { data: posts = [], isLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-dav-saffron"></div>
        <p className="mt-2 text-gray-600">Loading posts...</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <i className="fas fa-inbox text-4xl mb-4"></i>
        <p>No posts yet. Create your first post!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{post.title}</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Unknown date'}
                </p>
              </div>
              <Badge variant="outline" className="capitalize">
                {post.category}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">{post.content}</p>
            {post.images && post.images.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Post image ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}