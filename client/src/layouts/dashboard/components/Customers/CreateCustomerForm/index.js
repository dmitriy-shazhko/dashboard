import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";

const CreateCustomerForm = ({ onSubmit, register, errors }) => {
  return (
    <form onSubmit={onSubmit}>
      <Stack spacing={3}>
        <TextField
          id="customer-name"
          label="Имя"
          variant="outlined"
          {...register("name")}
          required
          error={!!errors?.name}
          helperText={errors?.name?.message}
        />
        <TextField
          id="customer-birthdate"
          label="Дата рождения"
          variant="outlined"
          type="date"
          InputLabelProps={{ shrink: true }}
          {...register("birthDate")}
          error={!!errors?.birthDate}
          helperText={errors?.birthDate?.message}
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
  errors: PropTypes.object,
};

export default CreateCustomerForm;
