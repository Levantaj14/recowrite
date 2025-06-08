import { Badge, Table } from '@chakra-ui/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { changeStatus, getAllReports, ReportType, StatusType } from '@/apis/adminApi.ts';
import { fetchAllUsers, UserType } from '@/apis/userApi.ts';
import { BlogType, fetchAllBlogs } from '@/apis/blogApi.ts';
import LoadingAnimation from '@/components/elements/LoadingAnimation.tsx';
import { useState } from 'react';
import { toast } from 'sonner';
import CustomLoading from '@/components/elements/CustomLoading.tsx';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import ReportDetailsDialog from '@/components/pages/admin/tabs/ReportDetailsDialog.tsx';

type Props = {
  setIsAuthorized: (isAuthorized: boolean) => void;
};

export default function ReportsTab({ setIsAuthorized }: Props) {
  const { t } = useTranslation();
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);
  const [selectedReportedUser, setSelectedReportedUser] = useState<UserType | undefined>(undefined);
  const [selectedReportedByUser, setSelectedReportedByUser] = useState<UserType | undefined>(undefined);
  const [selectedBlog, setSelectedBlog] = useState<BlogType | undefined>(undefined);
  const [adminNotes, setAdminNotes] = useState<string | null>(null);
  const [blockButtons, setBlockButtons] = useState(false);
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

  function buttonPressed(status: StatusType, key: string) {
    if (selectedReport) {
      setBlockButtons(true);
      toast.promise(changeStatus({ reportId: selectedReport.id, reportStatus: status, note: '' }), {
        loading: CustomLoading(t(`admin.toast.${key}.loading`)),
        success: async () => {
          await queryClient.invalidateQueries({
            queryKey: ['reports'],
          });
          setBlockButtons(false);
          setSelectedReport(null);
          return t(`admin.toast.${key}.success`);
        },
        error: () => {
          setBlockButtons(false);
          return t(`admin.toast.${key}.error`);
        },
      });
    }
  }

  function content() {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}>
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
                    setAdminNotes(report.note);
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
      </motion.div>
    );
  }

  return (
    <>
      <ReportDetailsDialog selectedReport={selectedReport} setSelectedReport={setSelectedReport}
                           selectedReportedUser={selectedReportedUser} selectedReportedByUser={selectedReportedByUser}
                           selectedBlog={selectedBlog} adminNotes={adminNotes} setAdminNotes={setAdminNotes}
                           blockButtons={blockButtons} buttonPressed={buttonPressed} />
      {isLoading ? <LoadingAnimation /> : content()}
    </>
  );
}
