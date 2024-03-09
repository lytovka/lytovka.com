import type { Payment } from "~/components/columns";
import { columns } from "~/components/columns"
import { DataTable } from "~/components/data-table"
import MainLayout from "~/components/main-layout";

const data: Array<Payment> = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "728ed52f",
    amount: 200,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "728ed52f",
    amount: 300,
    status: "pending",
    email: "m@example.com",
  },
]

export default function DemoPage() {
  return (
    <MainLayout>
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={data} />
      </div>
    </MainLayout>
  )
}

