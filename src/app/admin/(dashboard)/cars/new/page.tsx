import CarForm from '@/components/admin/CarForm'

export const metadata = {
  title: 'Add Car',
}

export default function AdminNewCarPage() {
  return <CarForm mode="create" />
}
