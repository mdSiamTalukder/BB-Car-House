import InquiryDetail from '@/components/admin/InquiryDetail'

export const metadata = {
  title: 'Enquiry',
}

export default async function AdminInquiryDetailPage(
  props: PageProps<'/admin/inquiries/[id]'>,
) {
  const { id } = await props.params

  return <InquiryDetail inquiryId={id} />
}
