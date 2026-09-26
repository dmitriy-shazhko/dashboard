import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import InputAdornment from "@mui/material/InputAdornment";
import { useCustomerOptions } from "hooks/useCustomers";
import { Controller } from "react-hook-form";
import MenuItem from "@mui/material/MenuItem";
import { Autocomplete } from "@mui/material";

const CreateOrderForm = ({ onSubmit, register, control, errors }) => {
  const { data: customers = [], isLoading: isLoadingCustomers } = useCustomerOptions();

  return (
    <form onSubmit={onSubmit}>
      <Stack spacing={3}>
        <Controller
          name="customerId"
          control={control}
          defaultValue={null}
          render={({ field: { onChange, value } }) => (
            <Autocomplete
              options={customers}
              getOptionLabel={(customer) => customer.name}
              isOptionEqualToValue={(option, val) => option.id === val?.id}
              loading={isLoadingCustomers}
              value={customers.find((c) => c.id === value) ?? null}
              onChange={(_, selected) => onChange(selected?.id ?? "")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Покупатель"
                  required
                  error={!!errors?.customerId}
                  helperText={errors?.customerId?.message}
                />
              )}
            />
          )}
        ></Controller>
        <TextField
          id="product-name"
          label="Товар"
          variant="outlined"
          {...register("productName")}
          required
          error={!!errors?.productName}
          helperText={errors?.productName?.message}
        />

        <TextField
          id="price"
          label="Цена"
          variant="outlined"
          type="number"
          {...register("price")}
          required
          error={!!errors?.price}
          helperText={errors?.price?.message}
          InputProps={{
            endAdornment: <InputAdornment position="end">₽</InputAdornment>,
          }}
        />

        <TextField
          id="quantity"
          label="Количство"
          variant="outlined"
          type="number"
          {...register("quantity")}
          required
          error={!!errors?.quantity}
          helperText={errors?.quantity?.message}
        />
        <Button type="submit" variant="contained" color="success">
          Добавить
        </Button>
      </Stack>
    </form>
  );
};

CreateOrderForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  control: PropTypes.object.isRequired,
  errors: PropTypes.object,
};

export default CreateOrderForm;
