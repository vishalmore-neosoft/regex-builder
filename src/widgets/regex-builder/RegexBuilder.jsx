import { useState, useMemo } from "react";
import { Box, Stack, IconButton, Typography, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { v4 as uuidv4 } from "uuid";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import SortableChip from "./SortableChip";
import ConfigPopover from "./ConfigPopover";

const escapeRegex = (v) => v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export default function RegexBuilder() {
  const [segments, setSegments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [configSeg, setConfigSeg] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const addSegment = () =>
    setSegments((s) => [
      ...s,
      { id: uuidv4(), type: "fixed", optional: false, config: { value: "FIXED" } },
    ]);

  const changeSegmentType = (id, type) =>
    setSegments((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        if (type === "fixed") return { ...s, type, config: { value: "FIXED" } };
        if (type === "digits") return { ...s, type, config: { min: 1, max: 4 } };
        if (type === "letters")
          return { ...s, type, config: { case: "any", min: 1, max: 3 } };
        if (type === "alphanumeric")
          return { ...s, type, config: { min: 1, max: 4 } };
        return { ...s, type, config: { regex: "" } };
      })
    );

  const regex = useMemo(
    () =>
      segments
        .map((s) => {
          let r = "";
          if (s.type === "fixed") r = escapeRegex(s.config.value);
          if (s.type === "digits") r = `\\d{${s.config.min},${s.config.max}}`;
          if (s.type === "letters") {
            const c =
              s.config.case === "upper"
                ? "A-Z"
                : s.config.case === "lower"
                ? "a-z"
                : "a-zA-Z";
            r = `[${c}]{${s.config.min},${s.config.max}}`;
          }
          if (s.type === "alphanumeric")
            r = `[a-zA-Z0-9]{${s.config.min},${s.config.max}}`;
          if (s.type === "custom") r = s.config.regex || "";
          return s.optional ? `(${r})?` : r;
        })
        .join(""),
    [segments]
  );

  return (
    <Box sx={{ height: "100vh", display: "grid", placeItems: "center", gap: 3 }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={({ active, over }) => {
          if (over && active.id !== over.id) {
            const oldIndex = segments.findIndex((s) => s.id === active.id);
            const newIndex = segments.findIndex((s) => s.id === over.id);
            setSegments((s) => arrayMove(s, oldIndex, newIndex));
          }
        }}
      >
        <SortableContext
          items={segments.map((s) => s.id)}
          strategy={horizontalListSortingStrategy}
        >
          <Stack direction="row" spacing={1} sx={{ minWidth: 200, border: "1px solid #ccc", p: 1, borderRadius: 2 }}>
            <Stack direction="row" flexGrow={1}>
              {segments.map((seg) => (
              <SortableChip
                key={seg.id}
                segment={seg}
                isEditing={editingId === seg.id}
                editingValue={editingValue}
                setEditingValue={setEditingValue}
                onDoubleClick={(s) => {
                  if (s.type === "fixed") {
                    setEditingId(s.id);
                    setEditingValue(s.config.value);
                  } else {
                    setConfigSeg(s);
                    setAnchorEl(document.getElementById(s.id));
                  }
                }}
                onChangeType={changeSegmentType}
                onDelete={(id) =>
                  setSegments((prev) => prev.filter((s) => s.id !== id))
                }
                saveEdit={() => {
                  setSegments((p) =>
                    p.map((x) =>
                      x.id === editingId
                        ? { ...x, config: { value: editingValue } }
                        : x
                    )
                  );
                  setEditingId(null);
                }}
                handleKeyDown={(e) => e.key === "Enter" && setEditingId(null)}
              />
            ))}
            </Stack>
            <IconButton onClick={addSegment}>
              <AddIcon />
            </IconButton>
          </Stack>
        </SortableContext>
      </DndContext>

      <Box sx={{ width: 600 }}>
        <Typography sx={{ mb: 1 }}>Generated Regex</Typography>
        <TextField fullWidth size="small" value={regex} InputProps={{ readOnly: true }} />
      </Box>

      <ConfigPopover
        anchorEl={anchorEl}
        segment={configSeg}
        onChange={(k, v) =>
          setConfigSeg((s) => ({ ...s, config: { ...s.config, [k]: v } }))
        }
        onSave={() => {
          setSegments((p) =>
            p.map((x) => (x.id === configSeg.id ? configSeg : x))
          );
          setAnchorEl(null);
        }}
        onClose={() => setAnchorEl(null)}
      />
    </Box>
  );
}
