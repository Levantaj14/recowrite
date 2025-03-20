import { Flex, Text } from '@chakra-ui/react';
import NumberFlow, { NumberFlowGroup } from '@number-flow/react';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { LikeCountType, LikedType } from '@/apis/likesApi.ts';
import { UserType } from '@/apis/userApi.ts';
import { BlogType } from '@/apis/blogApi.ts';

type Props = {
  data: {
    blogData: BlogType
    userData: UserType
    liked: LikedType
    likeCount: LikeCountType
  } | undefined;
  setDate: (date: Date) => void;
}

export default function PostOpening({ data, setDate }: Props) {
  const { t } = useTranslation();
  const { blogId } = useParams();
  const queryClient = useQueryClient();
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (data?.blogData.date) {
      const timer = setInterval(() => {
        const diff = new Date(data.blogData.date).getTime() - Date.now();
        if (diff <= 0) {
          clearInterval(timer);
          setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          queryClient.invalidateQueries({
            queryKey: ['blog', blogId],
          });
          return;
        }
        const totalSecs = Math.floor(diff / 1000);
        const days = Math.floor(totalSecs / 86400);
        const hours = Math.floor((totalSecs % 86400) / 3600);
        const minutes = Math.floor((totalSecs % 3600) / 60);
        const seconds = totalSecs % 60;
        setCountdown({ days, hours, minutes, seconds });
      }, 1000);
      setDate(new Date(data.blogData.date));
      return () => clearInterval(timer);
    }
  }, [blogId, data?.blogData.date, queryClient, setDate]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = data?.blogData.title ?? 'Loading...';
  }, [data?.blogData.title]);

  return (
    <Flex mt={5} flexDirection="column" alignItems="center">
      <Text fontSize="2xl">{t('story.unavailable')}</Text>
      <Flex flexDirection="row" alignItems="center">
        <NumberFlowGroup>
          <Text fontSize="2xl" fontWeight="semibold">
            <NumberFlow trend={-1} value={countdown.days} format={{ minimumIntegerDigits: 2 }} />
          </Text>
          <Text fontSize="2xl" fontWeight="semibold">
            <NumberFlow prefix=":" trend={-1} value={countdown.hours} format={{ minimumIntegerDigits: 2 }} />
          </Text>
          <Text fontSize="2xl" fontWeight="semibold">
            <NumberFlow prefix=":" trend={-1} value={countdown.minutes} format={{ minimumIntegerDigits: 2 }} />
          </Text>
          <Text fontSize="2xl" fontWeight="semibold">
            <NumberFlow prefix=":" trend={-1} value={countdown.seconds} format={{ minimumIntegerDigits: 2 }} />
          </Text>
        </NumberFlowGroup>
      </Flex>
    </Flex>
  );
}