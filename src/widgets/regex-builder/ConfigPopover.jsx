import {
  Popover,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
} from "@mui/material";

export default function ConfigPopover({
  anchorEl,
  segment,
  onChange,
  onSave,
  onClose,
}) {
  if (!segment) return null;

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
    >
      <Stack gap={1} sx={{ p: 3, minWidth: 220 }}>
        {["digits", "letters", "alphanumeric"].includes(segment.type) && (
          <Stack direction={"row"} gap={2}>
            <TextField
              type="number"
              label="Min"
              value={segment.config.min}
              onChange={(e) => onChange("min", +e.target.value)}
              size="small"
            />
            <TextField
              type="number"
              label="Max"
              value={segment.config.max}
              onChange={(e) => onChange("max", +e.target.value)}
              size="small"
            />
          </Stack>
        )}

        {segment.type === "letters" && (
          <FormControl size="small">
            <InputLabel>Case</InputLabel>
            <Select
              value={segment.config.case}
              label="Case"
              onChange={(e) => onChange("case", e.target.value)}
            >
              <MenuItem value="any">Any</MenuItem>
              <MenuItem value="upper">Upper</MenuItem>
              <MenuItem value="lower">Lower</MenuItem>
            </Select>
          </FormControl>
        )}

        {segment.type === "custom" && (
          <TextField
            label="Regex"
            value={segment.config.regex}
            onChange={(e) => onChange("regex", e.target.value)}
            size="small"
          />
        )}

        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={segment.optional}
                onChange={(e) => onChange("optional", e.target.checked)}
              />
            }
            label="Optional"
          />
        </FormGroup>

        <Button variant="contained" disableElevation onClick={onSave}>
          Save
        </Button>
      </Stack>
    </Popover>
  );
}
