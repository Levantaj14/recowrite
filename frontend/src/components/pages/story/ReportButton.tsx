import { BlogType } from '@/apis/blogApi.ts';
import { useTranslation } from 'react-i18next';
import { useContext, useEffect, useState } from 'react';
import { UserDetailContext } from '@/contexts/userDetailContext.ts';
import { Button, Fieldset, RadioGroup, VStack } from '@chakra-ui/react';
import { Tooltip } from '@/components/ui/tooltip.tsx';
import { FiAlertTriangle } from 'react-icons/fi';
import {
  DialogActionTrigger,
  DialogBody, DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader, DialogRoot,
  DialogTitle,
} from '@/components/ui/dialog.tsx';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { sendReport } from '@/apis/reportApi.ts';
import CustomLoading from '@/components/elements/CustomLoading';

type Props = {
  blogData: BlogType | undefined;
}

export default function ReportButton({ blogData }: Props) {
  const { t } = useTranslation();
  const { userDetails } = useContext(UserDetailContext);
  const [available, setAvailable] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schema = z.object({
    selected: z.string().nonempty(t('story.report.emptyError')),
  });

  const items = [
    {value: 'Spam', label: t('story.report.options.spam')},
    {value: 'Hate speech or abusive content', label: t('story.report.options.hate')},
    {value: 'Harassment or bullying', label: t('story.report.options.bully')},
    {value: 'Sexual or explicit content', label: t('story.report.options.explicit')},
    {value: 'Violent or graphic content', label: t('story.report.options.violent')},
    {value: 'Misinformation', label: t('story.report.options.misinformation')},
    {value: 'Copyright infringement', label: t('story.report.options.copyright')},
    {value: 'Plagiarism', label: t('story.report.options.plagiarism')}
  ];

  type FormFields = z.infer<typeof schema>;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    setIsSubmitting(true);
    toast.promise(sendReport(Number(blogData?.id), data.selected), {
      loading: CustomLoading(t('story.report.toast.loading')),
      success: () => {
        setOpen(false);
        setIsSubmitting(false);
        return t('story.report.toast.success');
      },
      error: () => {
        setIsSubmitting(false);
        return t('story.report.toast.error');
      },
    })
  };

  useEffect(() => {
    if (blogData?.date) {
      const date = new Date(blogData.date);
      setAvailable(date <= new Date());
    }
  }, [blogData]);

  useEffect(() => {
    reset({
      selected: '',
    });
  }, [reset, open]);


  return available && (
    <>
      <DialogRoot placement="center" open={open} onOpenChange={(e) => setOpen(e.open)}>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>{t('story.report.title')}</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <Fieldset.Root>
                <Controller
                  name="selected"
                  control={control}
                  render={({ field }) => (
                    <>
                    <RadioGroup.Root
                      name={field.name}
                      value={field.value}
                      onValueChange={({ value }) => {
                        field.onChange(value)
                      }}
                    >
                      <VStack gap="6" align="start">
                        {items.map((item) => (
                          <RadioGroup.Item key={item.value} value={item.value}>
                            <RadioGroup.ItemHiddenInput onBlur={field.onBlur} />
                            <RadioGroup.ItemIndicator />
                            <RadioGroup.ItemText>{item.label}</RadioGroup.ItemText>
                          </RadioGroup.Item>
                        ))}
                      </VStack>
                    </RadioGroup.Root>
                    </>
                  )}
                />
                {errors.selected && (
                  <Fieldset.ErrorText>{errors.selected?.message}</Fieldset.ErrorText>
                )}
              </Fieldset.Root>
            </DialogBody>
            <DialogFooter>
              <DialogActionTrigger asChild>
                <Button variant="outline" disabled={isSubmitting}>
                  {t('buttons.cancel')}
                </Button>
              </DialogActionTrigger>
              <Button type="submit" disabled={isSubmitting}>
                {t('buttons.report')}
              </Button>
            </DialogFooter>
            <DialogCloseTrigger />
          </form>
        </DialogContent>
      </DialogRoot>
      <Tooltip
        content={userDetails === null && t('story.like.noLogin')}
        disabled={userDetails !== null}
        openDelay={100}
        closeDelay={100}
        positioning={{ placement: 'top' }}
      >
        <Button variant="ghost" disabled={userDetails === null} onClick={() => setOpen(true)}>
          <FiAlertTriangle />
          {t('buttons.report')}
        </Button>
      </Tooltip>
    </>
  );
}