import { useContext, useEffect } from 'react';
import { toast } from 'sonner';
import { verifyEmail } from '@/apis/authApi.ts';
import { useNavigate, useSearchParams } from 'react-router';
import CustomLoading from '@/components/elements/CustomLoading.tsx';
import { UserDetailContext } from '@/contexts/userDetailContext.ts';
import { useTranslation } from 'react-i18next';
import LoadingAnimation from '@/components/elements/LoadingAnimation.tsx';

export function VerifyEmail() {
  const { t } = useTranslation();
  const { setUserDetails } = useContext(UserDetailContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    toast
      .promise(verifyEmail(searchParams.get('token')), {
        loading: CustomLoading(t('emailVerification.toast.loading')),
        success: () => {
          navigate('/login');
          return t('emailVerification.toast.success');
        },
        error: () => {
          navigate('/');
          return t('emailVerification.toast.error');
        },
      })
      .unwrap()
      .then((r) => {
        setUserDetails(r);
      });
  }, [t, navigate, searchParams, setUserDetails]);

  return (
    <LoadingAnimation />
  );
}
