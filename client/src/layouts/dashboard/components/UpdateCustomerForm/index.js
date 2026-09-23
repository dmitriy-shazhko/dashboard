import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";

const UpdateCustomerForm = ({ register, onSubmit }) => {
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
        <TextField
          id="customer-balance"
          label="Баланс"
          variant="outlined"
          type="number"
          InputLabelProps={{ shrink: true }}
          {...register("balance")}
        />
        <Button type="submit" variant="contained" color="success">
          Редактировать
        </Button>
      </Stack>
    </form>
  );
};

UpdateCustomerForm.propTypes = {
  register: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default UpdateCustomerForm;
