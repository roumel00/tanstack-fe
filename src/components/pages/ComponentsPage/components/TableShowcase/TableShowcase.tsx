import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  ColumnDef,
  RowSelectionState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Product {
  id: string
  name: string
  category: string
  sku: string
  price: number
  stock: number
  supplier: string
  location: string
  status: "in-stock" | "low-stock" | "out-of-stock"
}

const fakeData: Product[] = [
  { id: "1", name: "Wireless Keyboard", category: "Electronics", sku: "WK-001", price: 49.99, stock: 142, supplier: "TechCorp", location: "Warehouse A", status: "in-stock" },
  { id: "2", name: "Ergonomic Mouse", category: "Electronics", sku: "EM-002", price: 34.99, stock: 8, supplier: "TechCorp", location: "Warehouse A", status: "low-stock" },
  { id: "3", name: "Standing Desk", category: "Furniture", sku: "SD-003", price: 599.00, stock: 23, supplier: "OfficePro", location: "Warehouse B", status: "in-stock" },
  { id: "4", name: "Monitor Arm", category: "Accessories", sku: "MA-004", price: 89.99, stock: 0, supplier: "MountIt", location: "Warehouse C", status: "out-of-stock" },
  { id: "5", name: "USB-C Hub", category: "Electronics", sku: "UH-005", price: 64.99, stock: 56, supplier: "ConnectAll", location: "Warehouse A", status: "in-stock" },
  { id: "6", name: "Noise-Cancelling Headphones", category: "Electronics", sku: "NC-006", price: 199.99, stock: 5, supplier: "AudioMax", location: "Warehouse B", status: "low-stock" },
  { id: "7", name: "Webcam HD", category: "Electronics", sku: "WC-007", price: 79.99, stock: 31, supplier: "VisionTech", location: "Warehouse A", status: "in-stock" },
  { id: "8", name: "Desk Lamp", category: "Accessories", sku: "DL-008", price: 44.99, stock: 0, supplier: "BrightCo", location: "Warehouse C", status: "out-of-stock" },
  { id: "9", name: "Cable Management Kit", category: "Accessories", sku: "CM-009", price: 19.99, stock: 200, supplier: "TidyDesk", location: "Warehouse B", status: "in-stock" },
  { id: "10", name: "Laptop Stand", category: "Accessories", sku: "LS-010", price: 54.99, stock: 3, supplier: "OfficePro", location: "Warehouse A", status: "low-stock" },
]

const statusConfig = {
  "in-stock": { label: "In Stock", className: "bg-green-100 text-green-700" },
  "low-stock": { label: "Low Stock", className: "bg-yellow-100 text-yellow-700" },
  "out-of-stock": { label: "Out of Stock", className: "bg-red-100 text-red-700" },
}

const columns: ColumnDef<Product>[] = [
  {
    id: "select",
    meta: { sticky: "left" },
    size: 48,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Product",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "sku",
    header: "SKU",
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Price
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const price = row.getValue<number>("price")
      return `$${price.toFixed(2)}`
    },
  },
  {
    accessorKey: "stock",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Stock
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue<Product["status"]>("status")
      const config = statusConfig[status]
      return (
        <Badge variant="secondary" className={config.className}>
          {config.label}
        </Badge>
      )
    },
  },
  {
    accessorKey: "supplier",
    header: "Supplier",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    id: "actions",
    size: 48,
    meta: { sticky: "right" },
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Duplicate</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

export function TableShowcase() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const table = useReactTable({
    data: fakeData,
    columns,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting, rowSelection },
  })

  return (
    <div>
      <div className="overflow-hidden rounded-md border">
        <Table className="min-w-[900px]">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const sticky = (header.column.columnDef.meta as { sticky?: string })?.sticky
                const size = header.column.columnDef.size
                return (
                  <TableHead
                    key={header.id}
                    data-sticky={sticky || undefined}
                    className={cn(
                      sticky === "left" && "sticky left-0 z-10 bg-card px-2 !pr-2 text-center",
                      sticky === "right" && "sticky right-0 z-10 bg-card"
                    )}
                    style={size ? { width: size } : undefined}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => {
                const sticky = (cell.column.columnDef.meta as { sticky?: string })?.sticky
                const size = cell.column.columnDef.size
                return (
                  <TableCell
                    key={cell.id}
                    data-sticky={sticky || undefined}
                    className={cn(
                      "py-3",
                      sticky === "left" && "sticky left-0 z-10 bg-card px-2 !pr-2 text-center",
                      sticky === "right" && "sticky right-0 z-10 bg-card"
                    )}
                    style={size ? { width: size } : undefined}
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
      <div className="text-muted-foreground flex-1 text-sm py-4">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
    </div>
  )
}
