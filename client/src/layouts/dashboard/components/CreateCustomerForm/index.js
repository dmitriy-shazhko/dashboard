import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";

const CreateCustomerForm = ({ onSubmit, register }) => {
  return (
    <form onSubmit={onSubmit}>
      <Stack spacing={3}>
        <TextField
          id="customer-name"
          label="Имя"
          variant="outlined"
          {...register("name")}
          required
        />
        <TextField
          id="customer-birthdate"
          label="Дата рождения"
          variant="outlined"
          type="date"
          InputLabelProps={{ shrink: true }}
          {...register("birthDate")}
        />
        <Button type="submit" variant="contained" color="success">
          Добавить
        </Button>
      </Stack>
    </form>
  );
};

CreateCustomerForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
};

export default CreateCustomerForm;
