import { Box, Typography, TextField } from "@mui/material";

export default function RegexPreview({ value }) {
  return (
    <Box sx={{ width: "100%", maxWidth: 600 }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Generated Regex
      </Typography>
      <TextField fullWidth size="small" value={value} InputProps={{ readOnly: true }} />
    </Box>
  );
}
