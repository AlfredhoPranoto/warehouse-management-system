import { Button, Typography } from "@mui/material";
import Form from "../components/Fragments/Form";
import { Link } from "react-router-dom";
import AuthLayout from "../components/Layouts/AuthLayout";
import FormInput from "../components/Widgets/FormInput";
import { useForm } from "react-hook-form";

const LoginPage = () => {
  const { control, handleSubmit } = useForm();
  return (
    <AuthLayout title="Login">
      <Form onSubmit={handleSubmit((data) => alert(JSON.stringify(data)))}>
        <FormInput control={control} label="Email" name="email" type="email" />
        <FormInput
          control={control}
          label="Password"
          name="password"
          type="password"
        />
        <Button fullWidth type="submit" variant="contained">
          Sign in
        </Button>
      </Form>
      <Typography textAlign="center" mt={2}>
        Don't have an account? <Link to={"/register"}>Sign up</Link>
      </Typography>
    </AuthLayout>
  );
};

export default LoginPage;
