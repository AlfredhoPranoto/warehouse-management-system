import { useState } from "react";
import Box from "@mui/material/Box";
import Sidebar from "../components/Fragments/Sidebar";
import {
  Button,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Form from "../components/Fragments/Form";
import FormInput from "../components/Widgets/FormInput";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const CreateProductPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    warehouse: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleOnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${BASE_URL}/api/inventory`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      navigate("/inventory");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
        <Typography variant="h5" mb={2}>
          Create Product
        </Typography>
        <Form onSubmit={handleOnSubmit}>
          <FormInput
            label="Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleOnChange}
            disabled={loading}
          />

          <FormInput
            label="Description"
            name="description"
            type="text"
            value={formData.description}
            onChange={handleOnChange}
            disabled={loading}
          />
          <FormInput
            label="Price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleOnChange}
            disabled={loading}
          />
          <FormInput
            label="Stock"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleOnChange}
            disabled={loading}
          />
          <InputLabel id="demo-simple-select-label">Warehouse</InputLabel>
          <Select
            sx={{ marginBottom: 5 }}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Warehouse"
            value={formData.warehouse}
            name="warehouse"
            onChange={handleOnChange}
          >
            <MenuItem value="A">A</MenuItem>
            <MenuItem value="B">B</MenuItem>
            <MenuItem value="C">C</MenuItem>
          </Select>

          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? "Create..." : "Create"}
          </Button>
        </Form>
      </Box>
    </Sidebar>
  );
};

export default CreateProductPage;
