import React from "react";
import { DataGrid as MuiDataGrid } from "@mui/x-data-grid";
import type {
  GridColDef,
  GridSortModel,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import { Box, Card, CardContent, Chip } from "@mui/material";
import SearchField from "./searchField";
import type { GridAlignment } from "@mui/x-data-grid";

export interface Column<T = any> {
  field: string;
  headerName: string;
  width?: number;
  minWidth?: number;
  flex?: number;
  sortable?: boolean;
  filterable?: boolean;
  align?: "left" | "center" | "right";
  headerAlign?: "left" | "center" | "right";
  renderCell?: (params: { value: any; row: T }) => React.ReactNode;
  valueFormatter?: (value: any) => string;
}

export interface DataGridProps<T = any> {
  columns: Column<T>[];
  rows: T[];
  rowCount: number;
  loading?: boolean;
  page?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  checkboxSelection?: boolean;
  autoHeight?: boolean;
  searchPlaceholder?: string;
  getRowId?: (row: T) => string;
  sortModel?: GridSortModel;
  rowSelectionModel?: GridRowSelectionModel;
  onRowSelectionChange?: (selection: string[]) => void;
  onPageChange?: (newPage: number) => void;
  onPageSizeChange?: (newPageSize: number) => void;
  onSortModelChange?: (sortModel: GridSortModel) => void;
  paginationMode?: 'client' | 'server';
  sortingMode?: 'client' | 'server';
  searchText?:string;
  onSearchChange?: (value: string) => void;
  renderRowActions?: (row: T) => React.ReactNode; // New: render action buttons per row
}

export function DataGrid<T extends { id?: string }>({
  columns,
  rows,
  rowCount,
  loading = false,
  page = 0,
  pageSize = 10,
  pageSizeOptions = [2,5, 10, 25, 50, 100],
  checkboxSelection = false,
  getRowId,
  onPageChange,
  onPageSizeChange,
  onSortModelChange,
  searchText,
  onSearchChange,
  onRowSelectionChange,
  rowSelectionModel,
  renderRowActions,
  paginationMode,
  sortingMode,
}: DataGridProps<T>) {

const mappedColumns: GridColDef[] = [
  ...(columns || []).map((col) => ({
    field: col.field,
    headerName: col.headerName,
    width: col.width,
    minWidth: col.minWidth,
    flex: col.flex,
    sortable: col.sortable ?? true,
    align: col.align as GridAlignment, // <-- cast here
    headerAlign: col.headerAlign as GridAlignment, // <-- cast here
    renderCell: col.renderCell
      ? (params: any) => col.renderCell!({ value: params.value, row: params.row as T })
      : undefined,
    valueFormatter: col.valueFormatter
      ? (params: any) => col.valueFormatter!(params.value)
      : undefined,
  })),
  ...(renderRowActions
    ? [
        {
          field: "__actions",
          headerName: "Actions",
          sortable: false,
          filterable: false,
          align: "center" as GridAlignment, // <-- cast here too
          headerAlign: "center" as GridAlignment,
          renderCell: (params: any) => renderRowActions(params.row as T),
          width: 120,
        },
      ]
    : []),
];

  const CustomToolbar = ({
    searchText,
    onSearchChange,
    searchPlaceholder = "Search...",
  }: {
    searchText?: string;
    onSearchChange?: (val: string) => void;
    searchPlaceholder?: string;
  }) => {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 1,
          width: "100%",
        }}
      >
        {onSearchChange && (
        <SearchField
          value={searchText}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
          fullWidth
        />
        )}
        <Box>{/* future toolbar buttons */}</Box>
      </Box>
    );
  };

  return (
    <>
    <Card>
        <CardContent sx={{ p: 0 }}>
    <CustomToolbar
            searchText={searchText}
            onSearchChange={onSearchChange}
          />
    <MuiDataGrid
      getRowHeight={() => "auto"}
      rows={rows}
      rowCount={rowCount}
      loading={loading}
      columns={mappedColumns}
      paginationModel={{ page: page ?? 0, pageSize: pageSize ?? 10  }}
      onPaginationModelChange={(model) => {
        onPageChange?.(model.page);
        onPageSizeChange?.(model.pageSize);
      }}
      pageSizeOptions={pageSizeOptions}
      paginationMode={paginationMode}
      sortingMode={sortingMode}
      checkboxSelection={checkboxSelection}
      getRowId={getRowId}
      onSortModelChange={onSortModelChange}
      disableColumnMenu={true}
      rowSelectionModel={rowSelectionModel}
      onRowSelectionModelChange={(selection) => {
        const selectedIds = Array.isArray(selection)
          ? selection.map((id) => id.toString())
          : [selection.toString()];
        onRowSelectionChange?.(selectedIds);
      }}
        sx={{
    '& .MuiDataGrid-cell': {
      py: 2,  // increase vertical padding
      lineHeight: '1.5 !important',
      fontSize: 14,
    },
    '& .MuiDataGrid-row': {
      minHeight: 50,  // increase min height if needed
    },
  }}
  density="comfortable"
    />
    </CardContent>
    </Card>
    </>
  );
}

//
// ✅ Helper functions for reusable columns
//
export const createStatusColumn = <T,>(
  field: string = "status",
  headerName: string = "Status"
): Column<T> => ({
  field,
  headerName,
  width: 130,
  renderCell: ({ value }) => {
    const status = value as string;
    const colorMap: Record<string, any> = {
      open: "info",
      "in progress": "warning",
      resolved: "success",
      closed: "default",
      pending: "warning",
      completed: "success",
      cancelled: "error",
    };
    return (
      <Chip
        label={status}
        color={colorMap[status.toLowerCase()] || "default"}
        size="small"
      />
    );
  },
});

export const createPriorityColumn = <T,>(
  field: string = "priority",
  headerName: string = "Priority"
): Column<T> => ({
  field,
  headerName,
  width: 120,
  renderCell: ({ value }) => {
    const priority = value as string;
    const colorMap: Record<string, any> = {
      critical: "error",
      high: "warning",
      medium: "info",
      low: "default",
    };
    return (
      <Chip
        label={priority}
        color={colorMap[priority.toLowerCase()] || "default"}
        size="small"
      />
    );
  },
});

export const createDateColumn = <T,>(
  field: string,
  headerName: string,
  width: number = 180
): Column<T> => ({
  field,
  headerName,
  width,
  valueFormatter: (value) => {
    if (!value) return "-";
    const date = new Date(value);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  },
});
