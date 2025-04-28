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
import { randomId } from "@mui/x-data-grid-generator";
import Sidebar from "../components/Fragments/Sidebar";
import { TextField } from "@mui/material";
import { useDebounce } from "../hooks/useDebounce";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

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

// function EditToolbar(props: GridSlotProps["toolbar"]) {
//   const { setRows, setFilteredRows, setRowModesModel, clearSearch } = props;

//   const handleClick = () => {
//     clearSearch();

//     const id = randomId();
//     const newRow = {
//       id,
//       name: "",
//       description: "",
//       price: "",
//       stock: "",
//       warehouse: "",
//     };

//     setRows((oldRows) => [...oldRows, newRow]);
//     setFilteredRows((oldRows) => [...oldRows, newRow]);

//     setRowModesModel((oldModel) => ({
//       ...oldModel,
//       [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
//     }));
//   };

//   return (
//     <Toolbar>
//       <Tooltip title="Add record">
//         <ToolbarButton onClick={handleClick}>
//           <AddIcon fontSize="small" />
//         </ToolbarButton>
//       </Tooltip>
//     </Toolbar>
//   );
// }

const StaffPage = () => {
  const [rows, setRows] = useState();
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [searchText, setSearchText] = useState("");
  const [filteredRows, setFilteredRows] = useState<GridRowsProp>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${BASE_URL}/api/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // Transform the data to include id property
        const transformedData = data.data.map((item) => ({
          ...item,
          id: item._id, // Add id property based on _id
        }));

        setRows(transformedData);
        setFilteredRows(transformedData);
        setError("");
      } catch (err) {
        console.error("Error fetching inventory:", err);
        setError("Failed to load inventory data");
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  const columns: GridColDef[] = [
    { field: "id", headerName: "Id", flex: 1 },
    { field: "firstName", headerName: "First Name", flex: 1, editable: true },
    {
      field: "lastName",
      headerName: "Last Name",
      type: "string",
      flex: 1,
      editable: true,
    },
    {
      field: "fullName",
      headerName: "Full Name",
      type: "string",
      flex: 2,
      editable: false,
      valueGetter: (value, row) =>
        `${row.firstName || ""} ${row.lastName || ""}`,
    },
    {
      field: "age",
      headerName: "Age",
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
      type: "singleSelect",
      valueOptions: ["A", "B", "C"],
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
        const fullName = `${row.firstName} ${row.lastName}`.toLowerCase();
        return fullName.includes(debouncedSearchText.toLowerCase());
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
    return navigate(`/users/edit/${id}`);
    // setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  // const handleSaveClick = (id: GridRowId) => () => {
  //   setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  // };

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
        />
      </Box>
    </Sidebar>
  );
};

export default StaffPage;
