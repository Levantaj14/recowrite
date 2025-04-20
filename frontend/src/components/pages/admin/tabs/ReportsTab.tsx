import {
  Avatar,
  Badge,
  CloseButton,
  DataList,
  Dialog,
  HStack, Link,
  Portal,
  Table,
  Textarea, VStack,
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

type Props = {
  setIsAuthorized: (isAuthorized: boolean) => void;
}

export default function ReportsTab({ setIsAuthorized }: Props) {
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
    OPEN: { color: 'green', label: 'Open' },
    DISMISSED: { color: 'orange', label: 'Dismissed' },
    STRIKE_GIVEN: { color: 'red', label: 'Strike Given' },
  };

  function pressedDismiss() {
    if (selectedReport) {
      setBlockButtons(true);
      toast.promise(dismissReport(selectedReport.id), {
        loading: CustomLoading('Dismissing report...'),
        success: async () => {
          await queryClient.invalidateQueries({
            queryKey: ['reports'],
          });
          setBlockButtons(false);
          setSelectedReport(null);
          return 'Report dismissed';
        },
        error: () => {
          setBlockButtons(false);
          return 'Error dismissing report';
        },
      });
    }
  }

  function pressedStrike() {
    if (selectedReport) {
      setBlockButtons(true);
      toast.promise(giveStrike(selectedReport.id), {
        loading: CustomLoading('Giving strike...'),
        success: async () => {
          await queryClient.invalidateQueries({
            queryKey: ['reports'],
          });
          setBlockButtons(false);
          setSelectedReport(null);
          return 'Strike given';
        },
        error: () => {
          setBlockButtons(false);
          return 'Error giving strike';
        },
      });
    }
  }

  function pressedRevoke() {
    if (selectedReport) {
      setBlockButtons(true);
      toast.promise(revokeStrike(selectedReport.id), {
        loading: CustomLoading('Revoking strike...'),
        success: async () => {
          await queryClient.invalidateQueries({
            queryKey: ['reports'],
          });
          setBlockButtons(false);
          setSelectedReport(null);
          return 'Strike revoked';
        },
        error: () => {
          setBlockButtons(false);
          return 'Error revoking strike';
        },
      });
    }
  }

  function content() {
    return (
      <Table.ScrollArea borderWidth="1px" rounded="sm" height="calc(100vh - 350px)">
        <Table.Root size="sm" stickyHeader interactive>
          <Table.Header>
            <Table.Row bg="bg.subtle">
              <Table.ColumnHeader>ID</Table.ColumnHeader>
              <Table.ColumnHeader>Reported User</Table.ColumnHeader>
              <Table.ColumnHeader>Status</Table.ColumnHeader>
              <Table.ColumnHeader>Blog</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {data?.reports.map((report) => (
              <Table.Row key={report.id} onClick={() => {
                setSelectedReport(report);
                setSelectedReportedUser(data?.users.find((u) => u.id === report.reportedUserId));
                setSelectedBlog(data?.blogs.find((b) => Number(b.id) === report.blogId));
                setSelectedReportedByUser(data?.users.find((u) => u.id === report.reporterId));
              }}>
                <Table.Cell>{report.id}</Table.Cell>
                <Table.Cell>
                  {data?.users.find((u) => u.id === report.reportedUserId)?.name ?? 'unknown'}
                </Table.Cell>
                <Table.Cell>
                  <Badge colorPalette={badges[report.status].color}>
                    {badges[report.status].label}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  {data?.blogs.find((b) => Number(b.id) === report.blogId)?.title ?? 'unknown'}
                </Table.Cell>
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
                  <Dialog.Title>Report Details</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body pb="8">
                  <DataList.Root orientation="horizontal">
                    <DataList.Item>
                      <DataList.ItemLabel>Reported User</DataList.ItemLabel>
                      <DataList.ItemValue>
                        <HStack>
                          <Avatar.Root size="xs">
                            <Avatar.Image
                              src={`data:image;base64,${selectedReportedUser?.avatar ?? ''}`} />
                            <Avatar.Fallback
                              name={selectedReportedUser?.name ?? ''} />
                          </Avatar.Root>
                          {selectedReportedUser?.name ?? ''}
                        </HStack>
                      </DataList.ItemValue>
                    </DataList.Item>

                    <DataList.Item>
                      <DataList.ItemLabel>Reported By</DataList.ItemLabel>
                      <DataList.ItemValue>
                        <HStack>
                          <Avatar.Root size="xs">
                            <Avatar.Image
                              src={`data:image;base64,${selectedReportedByUser?.avatar ?? ''}`} />
                            <Avatar.Fallback
                              name={selectedReportedByUser?.name ?? ''} />
                          </Avatar.Root>
                          {selectedReportedByUser?.name ?? ''}
                        </HStack>
                      </DataList.ItemValue>
                    </DataList.Item>


                    <DataList.Item>
                      <DataList.ItemLabel>Status</DataList.ItemLabel>
                      <DataList.ItemValue>
                        {selectedReport && (
                          <Badge colorPalette={badges[selectedReport.status].color}>
                            {badges[selectedReport.status].label}
                          </Badge>
                        )}
                      </DataList.ItemValue>
                    </DataList.Item>

                    <DataList.Item>
                      <DataList.ItemLabel>Blog title</DataList.ItemLabel>
                      <DataList.ItemValue>
                        <Link onClick={() => navigate(`/blog/${selectedBlog?.id}`)}>
                          {selectedBlog?.title ?? 'unknown'}
                        </Link>
                      </DataList.ItemValue>
                    </DataList.Item>

                    <DataList.Item>
                      <DataList.ItemLabel>Reason</DataList.ItemLabel>
                      <DataList.ItemValue>{selectedReport?.reason}</DataList.ItemValue>
                    </DataList.Item>

                    <DataList.Item>
                      <DataList.ItemLabel>Reported on</DataList.ItemLabel>
                      <DataList.ItemValue>
                        {selectedReport?.date && new Date(selectedReport.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </DataList.ItemValue>
                    </DataList.Item>
                  </DataList.Root>

                  <Textarea placeholder="Admin notes" mt="8" disabled={selectedReport?.status !== 'OPEN'}/>
                </Dialog.Body>
                <Dialog.CloseTrigger asChild>
                  <CloseButton size="sm" onClick={() => setSelectedReport(null)} disabled={blockButtons} />
                </Dialog.CloseTrigger>
                {selectedReport?.status === 'OPEN' && (
                  <Dialog.Footer>
                    <Button variant="outline" disabled={blockButtons} onClick={pressedDismiss}>Dismiss</Button>
                    <Button colorPalette="red" disabled={blockButtons} onClick={pressedStrike}>Give a strike</Button>
                  </Dialog.Footer>
                )}
                {selectedReport?.status === 'STRIKE_GIVEN' && (
                  <Dialog.Footer>
                    <Button variant="outline" disabled={blockButtons} onClick={pressedRevoke}>Revoke strike</Button>
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