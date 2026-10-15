import CarForm from '@/components/admin/CarForm'

export const metadata = {
  title: 'Edit Car',
}

export default async function AdminEditCarPage(
  props: PageProps<'/admin/cars/[id]'>,
) {
  const { id } = await props.params

  return <CarForm mode="edit" carId={id} />
}
