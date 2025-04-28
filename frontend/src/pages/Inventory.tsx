import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
  GridSlotProps,
  Toolbar,
  ToolbarButton,
} from "@mui/x-data-grid";
import { randomTraderName, randomId } from "@mui/x-data-grid-generator";
import Sidebar from "../components/Fragments/Sidebar";
import { TextField } from "@mui/material";
import { useDebounce } from "../hooks/useDebounce";

const initialRows: GridRowsProp = [
  {
    id: randomId(),
    name: randomTraderName(),
    description: "lorem ipsum",
    price: 200000,
    stock: 20,
    warehouse : 'A'
  },
  {
    id: randomId(),
    name: randomTraderName(),
    description: "lorem ipsum",
    price: 200000,
    stock: 20,
    warehouse : 'A'
  },
  {
    id: randomId(),
    name: randomTraderName(),
    description: "lorem ipsum",
    price: 200000,
    stock: 20,
    warehouse : 'B'
  },
  {
    id: randomId(),
    name: randomTraderName(),
    description: "lorem ipsum",
    price: 200000,
    stock: 20,
    warehouse : 'C'
  },
  {
    id: randomId(),
    name: randomTraderName(),
    description: "lorem ipsum",
    price: 200000,
    stock: 20,
    warehouse : 'D'
  },
  {
    id: randomId(),
    name: randomTraderName(),
    description: "lorem ipsum",
    price: 200000,
    stock: 20,
    warehouse : 'E'
  },
];

declare module "@mui/x-data-grid" {
  interface ToolbarPropsOverrides {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setFilteredRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
      newModel: (oldModel: GridRowModesModel) => GridRowModesModel
    ) => void;
    clearSearch: () => void;
  }
}

function EditToolbar(props: GridSlotProps["toolbar"]) {
  const { setRows, setFilteredRows, setRowModesModel, clearSearch } = props;

  const handleClick = () => {
    clearSearch();

    const id = randomId();
    const newRow = {
      id,
      name: "",
      description: "",
      price: "",
      stock: "",
      warehouse:''
    };

    setRows((oldRows) => [...oldRows, newRow]);
    setFilteredRows((oldRows) => [...oldRows, newRow]);

    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
  };

  return (
    <Toolbar>
      <Tooltip title="Add record">
        <ToolbarButton onClick={handleClick}>
          <AddIcon fontSize="small" />
        </ToolbarButton>
      </Tooltip>
    </Toolbar>
  );
}


const InventoryPage = () => {
  const [rows, setRows] = useState(initialRows);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [searchText, setSearchText] = useState("");
  const [filteredRows, setFilteredRows] = useState<GridRowsProp>(initialRows);

  const columns: GridColDef[] = [
    { field: "id", headerName: "SKU", flex: 1 },
    { field: "name", headerName: "Name", flex: 2, editable: true },
    {
      field: "description",
      headerName: "Description",
      type: "string",
      flex: 2,
      align: "left",
      headerAlign: "left",
      editable: true,
    },
    {
      field: "price",
      headerName: "Price",
      type: "number",
      headerAlign: "left",
      align: "left",
      flex: 1,
      editable: true,
      valueFormatter: (params) => {
        if (params == null || params === "") return "";
        return Intl.NumberFormat("id", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(params);
      },
    },
    {
      field: "stock",
      headerName: "Stock",
      flex: 1,
      editable: true,
      headerAlign: "left",
      align: "left",
      type: "number",
    },
    {
      field: "warehouse",
      headerName: "Warehouse",
      flex: 1,
      editable: true,
      headerAlign: "left",
      align: "left",
      type: "singleSelect",
      valueOptions:["A", "B", "C"],
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              material={{
                sx: {
                  color: "primary.main",
                },
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  const debouncedSearchText = useDebounce(searchText, 300);

  useEffect(() => {
    if (debouncedSearchText === "") {
      setFilteredRows(rows);
    } else {
      const filteredData = rows.filter((row) => {
        return String(row.name)
          .toLowerCase()
          .includes(debouncedSearchText.toLowerCase());
      });
      setFilteredRows(filteredData);
    }
  }, [debouncedSearchText, rows]);

  const clearSearch = () => {
    setSearchText("");
    setFilteredRows(rows);
  };

  const clear = (newRows: GridRowsProp) => {
    if (searchText) {
      const newFilteredRows = newRows.filter((row) =>
        String(row.name).toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredRows(newFilteredRows);
    } else {
      setFilteredRows(newRows);
    }
  };

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    const newRows = rows.filter((row) => row.id !== id);
    setRows(newRows);

    clear(newRows);
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow && editedRow.name === "") {
      const newRows = rows.filter((row) => row.id !== id);
      setRows(newRows);
      setFilteredRows(filteredRows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow };
    const newRows = rows.map((row) =>
      row.id === newRow.id ? updatedRow : row
    );
    setRows(newRows);

    clear(newRows);

    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  return (
    <Sidebar>
      <Box
        sx={{
          height: 530,
          width: "100%",
          "& .actions": {
            color: "text.secondary",
          },
          "& .textPrimary": {
            color: "text.primary",
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <TextField
            sx={{ backgroundColor: "white", borderRadius: 1 }}
            variant="outlined"
            size="small"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by name.."
          />
        </Box>
        <DataGrid
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5, 10]}
          sx={{ paddingInline: 2 }}
          rows={filteredRows}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          slots={{ toolbar: EditToolbar }}
          slotProps={{
            toolbar: {
              setRows,
              setFilteredRows,
              setRowModesModel,
              clearSearch,
            },
          }}
          showToolbar
        />
      </Box>
    </Sidebar>
  );
}

export default InventoryPage;