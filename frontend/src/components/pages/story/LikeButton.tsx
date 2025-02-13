import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { Button } from '@chakra-ui/react';
import { BlogType } from '@/apis/blogApi.ts';
import { UserType } from '@/apis/userApi.ts';
import { useContext, useEffect, useState } from 'react';
import { UserDetailContext } from '@/contexts/userDetailContext.ts';
import { Tooltip } from '@/components/ui/tooltip.tsx';
import { useQuery } from '@tanstack/react-query';
import { changeLike, getLikes } from '@/apis/likesApi.ts';
import NumberFlow from '@number-flow/react';

type Props = {
  blogData: BlogType | undefined;
  userData: UserType | undefined;
}

export default function LikeButton({ blogData }: Props) {
  const { userDetails } = useContext(UserDetailContext);
  const [liked, setLiked] = useState(false);

  const { data } = useQuery({
    queryKey: ['likes', blogData?.id],
    queryFn: () => getLikes(blogData?.id),
  });

  useEffect(() => {
    setLiked(data?.liked !== undefined && data.liked && userDetails !== null);
  }, [data?.liked, userDetails]);

  const clickedLike = async () => {
    setLiked(!liked);
    changeLike(blogData?.id);
    if (blogData) {
      if (liked) {
        blogData.likeCount--;
      } else {
        blogData.likeCount++;
      }
    }
  };

  return (
    <Tooltip content={'You must be logged in'} disabled={userDetails !== null} openDelay={100} closeDelay={100}
             positioning={{ placement: 'top' }}>
      <Button variant="ghost" disabled={userDetails === null} onClick={clickedLike}>
        {blogData !== undefined && <NumberFlow value={blogData.likeCount} />}
        {liked ? <FaHeart /> : <FaRegHeart />}
      </Button>
    </Tooltip>
  );
}