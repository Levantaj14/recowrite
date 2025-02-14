import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { Button } from '@chakra-ui/react';
import { BlogType } from '@/apis/blogApi.ts';
import { useContext, useEffect, useState } from 'react';
import { UserDetailContext } from '@/contexts/userDetailContext.ts';
import { Tooltip } from '@/components/ui/tooltip.tsx';
import { changeLike, LikeCountType, LikedType } from '@/apis/likesApi.ts';
import NumberFlow from '@number-flow/react';

type Props = {
  blogData: BlogType | undefined;
  liked: LikedType | undefined;
  likeCount: LikeCountType | undefined;
}

export default function LikeButton({ blogData, liked, likeCount }: Props) {
  const { userDetails } = useContext(UserDetailContext);
  const [localLiked, setLocalLiked] = useState(liked?.liked);
  const [localLikeCount, setLocalLikeCount] = useState(likeCount?.count);

  const clickedLike = async () => {
    setLocalLiked(!localLiked);
    if (localLikeCount !== undefined) {
      if (localLiked) {
        setLocalLikeCount(localLikeCount - 1);
      } else {
        setLocalLikeCount(localLikeCount + 1);
      }
    }
    await changeLike(blogData?.id);
  };

  useEffect(() => {
    if (userDetails === null) {
      setLocalLiked(false);
    }
  }, [userDetails]);

  return (
    <Tooltip content={'You must be logged in'} disabled={userDetails !== null} openDelay={100} closeDelay={100}
             positioning={{ placement: 'top' }}>
      <Button variant="ghost" disabled={userDetails === null} onClick={clickedLike}>
        {localLikeCount !== undefined && <NumberFlow value={localLikeCount} />}
        {localLiked ? <FaHeart /> : <FaRegHeart />}
      </Button>
    </Tooltip>
  );
}