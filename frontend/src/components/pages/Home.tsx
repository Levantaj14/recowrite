import BlogCard from '@/components/elements/BlogCard';
import { useQuery } from '@tanstack/react-query';
import { BlogType, fetchAllBlogs } from '@/apis/blogApi.ts';
import { Center, Spinner } from '@chakra-ui/react';
import { fetchAllUsers } from '@/apis/userApi.ts';
import { useEffect } from 'react';

function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const blogData = await fetchAllBlogs();
      const userData = await fetchAllUsers();
      return { blogData, userData };
    },
  });

  useEffect(() => {
    document.title = 'recowrite';
  }, [data]);

  function loadingScreen() {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  function blogList() {
    return (
      <>
        {data?.blogData.map((blog: BlogType, index) => (
          <BlogCard
            key={blog.id}
            imageUrl={blog.banner}
            title={blog.title}
            description={new Date(blog.date) > new Date() ? "This blog is not yet published" : blog.description}
            author={data?.userData.find((u) => u.id === blog.author)?.name ?? 'unknown'}
            href={`/blog/${blog.id}`}
            index={index}
          />
        ))}
      </>
    );
  }

  return isLoading ? loadingScreen() : blogList();
}

export default Home;
