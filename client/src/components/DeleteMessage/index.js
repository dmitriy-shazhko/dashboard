import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";

const DeleteMessage = ({ onAgree, onDisagree }) => {
  return (
    <div>
      <Stack spacing={3}>
        <Typography>Вы уверены?</Typography>
        <div>
          <Button onClick={onAgree}>Да</Button>
          <Button onClick={onDisagree}>Нет</Button>
        </div>
      </Stack>
    </div>
  );
};

DeleteMessage.propTypes = {
  onAgree: PropTypes.func.isRequired,
  onDisagree: PropTypes.func.isRequired,
};

export default DeleteMessage;
