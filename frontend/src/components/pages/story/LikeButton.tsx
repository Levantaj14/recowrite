import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { Button } from '@chakra-ui/react';
import { BlogType } from '@/apis/blogApi.ts';
import { useContext, useEffect, useState } from 'react';
import { UserDetailContext } from '@/contexts/userDetailContext.ts';
import { Tooltip } from '@/components/ui/tooltip.tsx';
import { changeLike, LikeCountType, LikedType } from '@/apis/likesApi.ts';
import NumberFlow from '@number-flow/react';
import { useTranslation } from 'react-i18next';

type Props = {
  blogData: BlogType | undefined;
  liked: LikedType | undefined;
  likeCount: LikeCountType | undefined;
};

export default function LikeButton({ blogData, liked, likeCount }: Props) {
  const { t } = useTranslation();
  const { userDetails } = useContext(UserDetailContext);
  const [localLiked, setLocalLiked] = useState(liked?.liked);
  const [localLikeCount, setLocalLikeCount] = useState(likeCount?.count);
  const [available, setAvailable] = useState<boolean>(false);

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

  useEffect(() => {
    if (blogData?.date) {
      const date = new Date(blogData.date);
      setAvailable(date <= new Date());
    }
  }, [blogData]);

  return (
    <Tooltip
      content={userDetails === null ? t('story.like.noLogin') : available ? "" : t('story.like.unavailable')}
      disabled={userDetails !== null && available}
      openDelay={100}
      closeDelay={100}
      positioning={{ placement: 'top' }}
    >
      <Button variant="ghost" disabled={userDetails === null || !available} onClick={clickedLike}>
        {localLikeCount !== undefined && <NumberFlow value={localLikeCount} />}
        {localLiked ? <FaHeart /> : <FaRegHeart />}
      </Button>
    </Tooltip>
  );
}
