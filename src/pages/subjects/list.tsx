import { useMemo, useState } from "react";
import { useTable } from "@refinedev/react-table";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { Search } from "lucide-react";
import { DEPARTMENT_OPTIONS } from "@/constants";
import { Subject } from "@/types";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent,
  SelectItem, SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/refine-ui/data-table/data-table";


export default function SubjectsList () {
  const [ searchQuery, setSearchQuery ] = useState('')
  const [ selectedDepartment, setSelectedDepartment ] = useState('all')

  const departmentFilters = selectedDepartment === 'all'
    ? []
    : [{
      field: 'department',
      operator: 'eq' as const,
      value: selectedDepartment
    }]
  const searchFilters = searchQuery
    ? [{
      field: 'name',
      operator: 'contains' as const,
      value: searchQuery
    }]
    : []
  
  // refine hook that lets us fetch data according to sorts, filters and pagination states and diplay that data accordingly inside the table -> built atop react-table/tanstack-table 
  const subjectTable = useTable<Subject>({
    // use useMemo to prevent recreating every column during re-renders
    columns: useMemo<ColumnDef<Subject>[]>(() => [
      {
        id: 'code',
        accessorKey: 'code',
        size: 100,
        header: () => <p className="column-title ml-2">Code</p>,
        cell: ({ getValue }) => <Badge>{ getValue<string>() }</Badge>
      },
      {
        id: 'name',
        accessorKey: 'name',
        size: 200,
        header: () => <p className="column-title">Name</p>,
        cell: ({ getValue }) => <span className="text-foreground">{ getValue<string>() }</span>,
        filterFn: 'includesString'
      },
      {
        id: 'department',
        accessorKey: 'department.name',
        size: 150,
        header: () => <p className="column-title">Department</p>,
        cell: ({ getValue }) => <Badge variant='secondary'>{ getValue<string>() }</Badge>,
        filterFn: 'includesString'
      },
      {
        id: 'description',
        accessorKey: 'description',
        size: 300,
        header: () => <p className="column-title">Description</p>,
        cell: ({ getValue }) => <span className="truncate line-clamp-2">{ getValue<string>() }</span>,
        filterFn: 'includesString'
      }
    ], []),
    refineCoreProps: {
      resource: 'subjects',
      pagination: {
        pageSize: 10,
        mode: 'server'
      },
      filters: {
        permanent: [...departmentFilters, ...searchFilters]
      },
      sorters: {
        initial: [
          { field: 'id', order: 'desc' }
        ]
      }
    }
  })


  return (
    <ListView>
      <Breadcrumb />

      <h1 className="page-title">Subjects</h1>

      <div className="intro-row">
        <p>Quick acces to essential metrics and management tools.</p>

        <div className="actions-row">
          <div className="search-field">
            <Search className="search-icon" />
            <Input
              type="text"
              placeholder="Search by name..."
              className="pl-10 w-full"
              value={ searchQuery }
              onChange={
                (e) => setSearchQuery(e.target.value)
              }
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Select
              value={selectedDepartment}
              onValueChange={setSelectedDepartment}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  All Departments
                </SelectItem>
                {
                  DEPARTMENT_OPTIONS.map(
                    department => (
                      <SelectItem
                        key={department.value}
                        value={department.value}
                      >
                        { department.label }
                      </SelectItem>
                    )
                  )
                }
              </SelectContent>
            </Select>

            {/* A create btn provided by refine that directs the user to the create page as defined in the app recources -> App.tsx */}
            <CreateButton />
          </div>
        </div>
      </div>

      {/* refine DataTable -> handles all common table functionality: sorting, pagination, filtering and action buttons */}
      <DataTable table={subjectTable} />
    </ListView>
  );
}