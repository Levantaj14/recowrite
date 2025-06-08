import { Avatar, Badge, CloseButton, DataList, Dialog, HStack, Link, Portal, Textarea, VStack } from '@chakra-ui/react';
import { Button } from '@/components/ui/button.tsx';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { ReportType, StatusType } from '@/apis/adminApi.ts';
import { UserType } from '@/apis/userApi.ts';
import { BlogType } from '@/apis/blogApi.ts';

type Props = {
  selectedReport: ReportType | null;
  setSelectedReport: (report: ReportType | null) => void;
  selectedReportedUser: UserType | undefined;
  selectedReportedByUser: UserType | undefined;
  selectedBlog: BlogType | undefined;
  adminNotes: string | null;
  setAdminNotes: (notes: string) => void;
  blockButtons: boolean;
  buttonPressed: (status: StatusType, key: string) => void;
}

export default function ReportDetailsDialog({
                                              selectedReport,
                                              setSelectedReport,
                                              selectedReportedUser,
                                              selectedBlog,
                                              buttonPressed,
                                              blockButtons,
                                              selectedReportedByUser,
                                              setAdminNotes,
                                              adminNotes,
                                            }: Props) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const badges = {
    OPEN: { color: 'green', label: t('admin.report.status.open') },
    DISMISSED: { color: 'orange', label: t('admin.report.status.dismissed') },
    STRIKE_GIVEN: { color: 'red', label: t('admin.report.status.strike') },
  };

  return (
    <VStack alignItems="start">
      <Dialog.Root open={selectedReport !== null}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>{t('admin.report.table.dialog.title')}</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body pb="8">
                <DataList.Root orientation="horizontal">
                  <DataList.Item>
                    <DataList.ItemLabel>{t('admin.report.table.dialog.reported')}</DataList.ItemLabel>
                    <DataList.ItemValue>
                      <HStack>
                        <Avatar.Root size="xs">
                          <Avatar.Image src={`data:image;base64,${selectedReportedUser?.avatar ?? ''}`} />
                          <Avatar.Fallback name={selectedReportedUser?.name ?? ''} />
                        </Avatar.Root>
                        {selectedReportedUser?.name ?? ''}
                      </HStack>
                    </DataList.ItemValue>
                  </DataList.Item>

                  <DataList.Item>
                    <DataList.ItemLabel>{t('admin.report.table.dialog.reportedBy')}</DataList.ItemLabel>
                    <DataList.ItemValue>
                      <HStack>
                        <Avatar.Root size="xs">
                          <Avatar.Image src={`data:image;base64,${selectedReportedByUser?.avatar ?? ''}`} />
                          <Avatar.Fallback name={selectedReportedByUser?.name ?? ''} />
                        </Avatar.Root>
                        {selectedReportedByUser?.name ?? ''}
                      </HStack>
                    </DataList.ItemValue>
                  </DataList.Item>

                  <DataList.Item>
                    <DataList.ItemLabel>{t('admin.report.table.dialog.status')}</DataList.ItemLabel>
                    <DataList.ItemValue>
                      {selectedReport && (
                        <Badge colorPalette={badges[selectedReport.status].color}>
                          {badges[selectedReport.status].label}
                        </Badge>
                      )}
                    </DataList.ItemValue>
                  </DataList.Item>

                  <DataList.Item>
                    <DataList.ItemLabel>{t('admin.report.table.dialog.blogTitle')}</DataList.ItemLabel>
                    <DataList.ItemValue>
                      <Link onClick={() => navigate(`/blog/${selectedBlog?.id}`)}>
                        {selectedBlog?.title ?? 'unknown'}
                      </Link>
                    </DataList.ItemValue>
                  </DataList.Item>

                  <DataList.Item>
                    <DataList.ItemLabel>{t('admin.report.table.dialog.reason')}</DataList.ItemLabel>
                    <DataList.ItemValue>{selectedReport?.reason}</DataList.ItemValue>
                  </DataList.Item>

                  <DataList.Item>
                    <DataList.ItemLabel>{t('admin.report.table.dialog.date')}</DataList.ItemLabel>
                    <DataList.ItemValue>
                      {selectedReport?.date &&
                        new Date(selectedReport.date).toLocaleDateString(i18n.language, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                    </DataList.ItemValue>
                  </DataList.Item>
                </DataList.Root>

                <Textarea placeholder={t('admin.report.table.dialog.adminNotes')} mt="8"
                          disabled={selectedReport?.status !== 'OPEN'} value={adminNotes ?? ''}
                          onChange={(e) => setAdminNotes(e.target.value)} />
              </Dialog.Body>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" onClick={() => setSelectedReport(null)} disabled={blockButtons} />
              </Dialog.CloseTrigger>
              {selectedReport?.status === 'OPEN' && (
                <Dialog.Footer>
                  <Button variant="outline" disabled={blockButtons}
                          onClick={() => buttonPressed('DISMISSED', 'report')}>
                    {t('buttons.dismiss')}
                  </Button>
                  <Button colorPalette="red" disabled={blockButtons}
                          onClick={() => buttonPressed('STRIKE_GIVEN', 'revokeStrike')}>
                    {t('buttons.giveStrike')}
                  </Button>
                </Dialog.Footer>
              )}
              {selectedReport?.status === 'DISMISSED' && (
                <Dialog.Footer>
                  <Button variant="outline" disabled={blockButtons}
                          onClick={() => buttonPressed('OPEN', 'reopen')}>
                    {t('buttons.reopen')}
                  </Button>
                </Dialog.Footer>
              )}
              {selectedReport?.status === 'STRIKE_GIVEN' && (
                <Dialog.Footer>
                  <Button variant="outline" disabled={blockButtons}
                          onClick={() => buttonPressed('OPEN', 'revokeStrike')}>
                    {t('buttons.revokeStrike')}
                  </Button>
                </Dialog.Footer>
              )}
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </VStack>
  );
}