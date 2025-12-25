import { Chip, TextField, Box, Typography } from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import SegmentContextMenu from "./SegmentContextMenu";

export default function SortableChip({
  segment,
  isEditing,
  editingValue,
  setEditingValue,
  onDoubleClick,
  onChangeType,
  onDelete,
  saveEdit,
  handleKeyDown,
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: segment.id });

  const [menuAnchor, setMenuAnchor] = useState(null);

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  if (isEditing && segment.type === "fixed") {
    return (
      <TextField
        id={segment.id}
        value={editingValue}
        onChange={(e) => setEditingValue(e.target.value)}
        onBlur={saveEdit}
        onKeyDown={handleKeyDown}
        autoFocus
        size="small"
        sx={{
          width: 58,
          height: 32,
          "& .MuiInputBase-root": { height: 32, fontSize: "0.75rem" },
          "& input": { textAlign: "center", padding: 0 },
        }}
      />
    );
  }

  const label =
    segment.type === "fixed"
      ? segment.config.value
      : segment.type === "digits"
      ? `Digits {${segment.config.min}-${segment.config.max}}`
      : segment.type === "letters"
      ? `Letters {${segment.config.min}-${segment.config.max}}`
      : segment.type === "alphanumeric"
      ? `Alphanumeric {${segment.config.min}-${segment.config.max}}`
      : "Custom";

  return (
    <>
      <Box
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        className="regex-segment-chip"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          ...style,
        }}
      >
        <div
          id={segment.id}
          className={`regex-segment ${segment.type}`}
          variant="outlined"
          onDoubleClick={() => onDoubleClick(segment)}
          onContextMenu={(e) => {
            e.preventDefault();
            setMenuAnchor(e.currentTarget);
          }}
          sx={{
            height: 32,
            px: 0,
            fontSize: "0.75rem",
            borderRadius: 1,
            cursor: "pointer",
            backgroundColor: "action.hover",
          }}
        >
          <Typography variant="caption">{label}</Typography>
        </div>

      </Box>

      <SegmentContextMenu
        anchorEl={menuAnchor}
        onClose={() => setMenuAnchor(null)}
        onSelect={(type) => {
          if (type === "delete") onDelete(segment.id);
          else onChangeType(segment.id, type);
          setMenuAnchor(null);
        }}
      />
    </>
  );
}
