/* eslint-disable @typescript-eslint/no-explicit-any */
import { Stack, TextField, TextFieldVariants } from "@mui/material";
import { Control, Controller, FieldValues } from "react-hook-form";

type FormInputProps = {
  name: string;
  label: string;
  control: Control<FieldValues, any, FieldValues>;
  type?: React.HTMLInputTypeAttribute;
  variant?: TextFieldVariants;
};

const FormInput = ({
  name,
  label,
  control,
  type = "text",
  variant = "outlined",
}: FormInputProps) => {
  return (
    <Stack mb={2}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            autoComplete="off"
            variant={variant}
            label={label}
            type={type}
            required
          />
        )}
      />
    </Stack>
  );
};

export default FormInput;
