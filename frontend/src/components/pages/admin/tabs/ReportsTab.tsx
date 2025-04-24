import {
  Avatar,
  Badge,
  CloseButton,
  DataList,
  Dialog,
  HStack,
  Link,
  Portal,
  Table,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { dismissReport, getAllReports, giveStrike, ReportType, revokeStrike } from '@/apis/adminApi.ts';
import { fetchAllUsers, UserType } from '@/apis/userApi.ts';
import { BlogType, fetchAllBlogs } from '@/apis/blogApi.ts';
import LoadingAnimation from '@/components/elements/LoadingAnimation.tsx';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button.tsx';
import { toast } from 'sonner';
import CustomLoading from '@/components/elements/CustomLoading.tsx';
import { useTranslation } from 'react-i18next';

type Props = {
  setIsAuthorized: (isAuthorized: boolean) => void;
};

export default function ReportsTab({ setIsAuthorized }: Props) {
  const { t } = useTranslation();
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);
  const [selectedReportedUser, setSelectedReportedUser] = useState<UserType | undefined>(undefined);
  const [selectedReportedByUser, setSelectedReportedByUser] = useState<UserType | undefined>(undefined);
  const [selectedBlog, setSelectedBlog] = useState<BlogType | undefined>(undefined);
  const [blockButtons, setBlockButtons] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      try {
        const reports = await getAllReports();
        const users = await fetchAllUsers();
        const blogs = await fetchAllBlogs();
        return { reports, users, blogs };
      } catch {
        setIsAuthorized(false);
      }
    },
  });

  const badges = {
    OPEN: { color: 'green', label: t('admin.report.status.open') },
    DISMISSED: { color: 'orange', label: t('admin.report.status.dismissed') },
    STRIKE_GIVEN: { color: 'red', label: t('admin.report.status.strike') },
  };

  function pressedDismiss() {
    if (selectedReport) {
      setBlockButtons(true);
      toast.promise(dismissReport(selectedReport.id), {
        loading: CustomLoading(t('admin.toast.report.loading')),
        success: async () => {
          await queryClient.invalidateQueries({
            queryKey: ['reports'],
          });
          setBlockButtons(false);
          setSelectedReport(null);
          return t('admin.toast.report.success');
        },
        error: () => {
          setBlockButtons(false);
          return t('admin.toast.report.error');
        },
      });
    }
  }

  function pressedStrike() {
    if (selectedReport) {
      setBlockButtons(true);
      toast.promise(giveStrike(selectedReport.id), {
        loading: CustomLoading(t('admin.toast.giveStrike.loading')),
        success: async () => {
          await queryClient.invalidateQueries({
            queryKey: ['reports'],
          });
          setBlockButtons(false);
          setSelectedReport(null);
          return t('admin.toast.giveStrike.success');
        },
        error: () => {
          setBlockButtons(false);
          return t('admin.toast.giveStrike.error');
        },
      });
    }
  }

  function pressedRevoke() {
    if (selectedReport) {
      setBlockButtons(true);
      toast.promise(revokeStrike(selectedReport.id), {
        loading: CustomLoading(t('admin.toast.revokeStrike.loading')),
        success: async () => {
          await queryClient.invalidateQueries({
            queryKey: ['reports'],
          });
          setBlockButtons(false);
          setSelectedReport(null);
          return t('admin.toast.revokeStrike.success');
        },
        error: () => {
          setBlockButtons(false);
          return t('admin.toast.revokeStrike.error');
        },
      });
    }
  }

  function content() {
    return (
      <Table.ScrollArea borderWidth="1px" rounded="sm" height="calc(100vh - 300px)">
        <Table.Root size="sm" stickyHeader interactive>
          <Table.Header>
            <Table.Row bg="bg.subtle">
              <Table.ColumnHeader>ID</Table.ColumnHeader>
              <Table.ColumnHeader>{t('admin.report.table.header.reportedUser')}</Table.ColumnHeader>
              <Table.ColumnHeader>{t('admin.report.table.header.status')}</Table.ColumnHeader>
              <Table.ColumnHeader>{t('admin.report.table.header.blog')}</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {data?.reports.map((report) => (
              <Table.Row
                key={report.id}
                onClick={() => {
                  setSelectedReport(report);
                  setSelectedReportedUser(data?.users.find((u) => u.id === report.reportedUserId));
                  setSelectedBlog(data?.blogs.find((b) => Number(b.id) === report.blogId));
                  setSelectedReportedByUser(data?.users.find((u) => u.id === report.reporterId));
                }}
              >
                <Table.Cell>{report.id}</Table.Cell>
                <Table.Cell>{data?.users.find((u) => u.id === report.reportedUserId)?.name ?? 'unknown'}</Table.Cell>
                <Table.Cell>
                  <Badge colorPalette={badges[report.status].color}>{badges[report.status].label}</Badge>
                </Table.Cell>
                <Table.Cell>{data?.blogs.find((b) => Number(b.id) === report.blogId)?.title ?? 'unknown'}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
    );
  }

  return (
    <>
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
                          new Date(selectedReport.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                      </DataList.ItemValue>
                    </DataList.Item>
                  </DataList.Root>

                  <Textarea placeholder={t('admin.report.table.dialog.adminNotes')} mt="8" disabled={selectedReport?.status !== 'OPEN'} />
                </Dialog.Body>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" onClick={() => setSelectedReport(null)} disabled={blockButtons} />
                </Dialog.CloseTrigger>
                {selectedReport?.status === 'OPEN' && (
                  <Dialog.Footer>
                    <Button variant="outline" disabled={blockButtons} onClick={pressedDismiss}>
                      {t('buttons.dismiss')}
                    </Button>
                    <Button colorPalette="red" disabled={blockButtons} onClick={pressedStrike}>
                      {t('buttons.giveStrike')}
                    </Button>
                  </Dialog.Footer>
                )}
                {selectedReport?.status === 'STRIKE_GIVEN' && (
                  <Dialog.Footer>
                    <Button variant="outline" disabled={blockButtons} onClick={pressedRevoke}>
                      {t('buttons.revokeStrike')}
                    </Button>
                  </Dialog.Footer>
                )}
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
      </VStack>
      {isLoading ? <LoadingAnimation /> : content()}
    </>
  );
}
