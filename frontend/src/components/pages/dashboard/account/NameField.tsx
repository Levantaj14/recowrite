import { Flex, Heading, Input } from '@chakra-ui/react';
import { Button } from '@/components/ui/button.tsx';
import { motion } from 'motion/react';
import { useContext, useState } from 'react';
import { UserDetailContext } from '@/contexts/userDetailContext.ts';
import { toast } from 'sonner';
import { updateName } from '@/apis/accountApi.ts';
import CustomLoading from '@/components/elements/CustomLoading.tsx';

export function NameField() {
  const { userDetails, setUserDetails } = useContext(UserDetailContext);
  const [name, setName] = useState(userDetails ? userDetails.name : '');
  const [disabled, setDisabled] = useState(false);

  const saveName = () => {
    setDisabled(true);
    toast.promise(updateName(name), {
      loading: CustomLoading('Saving...'),
      success: () => {
        if (userDetails) {
          setUserDetails({ ...userDetails, name });
        }
        setDisabled(false);
        return 'Name changed successfully';
      },
      error: () => {
        setDisabled(false);
        return 'Failed to update name';
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeInOut', delay: 0.04 }}
    >
      <Flex align="start" justifyContent="space-between" alignItems="center" mt="4">
        <Heading size="md">Name</Heading>
        <Flex align="start" alignItems="center" gap="2">
          <Input width="350px" value={name} onChange={(e) => setName(e.target.value)} />
          <Button size="sm" variant="outline" onClick={saveName} disabled={disabled}>Save</Button>
        </Flex>
      </Flex>
    </motion.div>
  );
}