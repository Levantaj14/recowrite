import { useContext, useEffect } from 'react';
import { toast } from 'sonner';
import { verifyEmail } from '@/apis/authApi.ts';
import { useNavigate, useSearchParams } from 'react-router';
import CustomLoading from '@/components/elements/CustomLoading.tsx';
import { Center, Spinner } from '@chakra-ui/react';
import { UserDetailContext } from '@/contexts/userDetailContext.ts';

export function VerifyEmail() {
  const { setUserDetails } = useContext(UserDetailContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    toast.promise(verifyEmail(searchParams.get('token')), {
      loading: CustomLoading("Verifying your email..."),
      success: () => {
        navigate('/login')
        return "Email verified successfully.";
      },
      error: () => {
        navigate('/')
        return "Email verification failed";
      }
    }).unwrap().then(r => {
      setUserDetails(r);
    });
  }, [navigate, searchParams, setUserDetails]);

  return (
    <Center>
      <Spinner />
    </Center>
  )
}