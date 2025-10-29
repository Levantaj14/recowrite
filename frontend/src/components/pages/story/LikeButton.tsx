import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { Button } from '@chakra-ui/react';
import { BlogType } from '@/apis/blogApi.ts';
import { useContext, useState } from 'react';
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

  const [prevUserDetails, setPrevUserDetails] = useState(userDetails);
  if (prevUserDetails !== userDetails) {
    setPrevUserDetails(userDetails);
    if (userDetails === null) {
      setLocalLiked(false);
    }
  }

  const available = blogData?.date ? new Date(blogData.date) <= new Date() : false;

  async function clickedLike(){
    setLocalLiked(!localLiked);
    if (localLikeCount !== undefined) {
      if (localLiked) {
        setLocalLikeCount(localLikeCount - 1);
      } else {
        setLocalLikeCount(localLikeCount + 1);
      }
    }
    await changeLike(blogData?.id);
  }

  // Only show the button if the blog is available
  return available && (
    <Tooltip
      content={userDetails === null && t('content.story.like.noLogin')}
      disabled={userDetails !== null}
      openDelay={100}
      closeDelay={100}
      positioning={{ placement: 'top' }}
    >
      <Button variant="ghost" disabled={userDetails === null} onClick={clickedLike}>
        {localLiked ? <FaHeart /> : <FaRegHeart />}
        {localLikeCount !== undefined && <NumberFlow value={localLikeCount} />}
      </Button>
    </Tooltip>
  );
}