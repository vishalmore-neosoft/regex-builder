import { useState, useMemo } from "react";
import {
  Box,
  Stack,
  IconButton,
  TextField,
  Container,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
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
import RegexExamples from "./RegexExamples";

const escapeRegex = (v) => v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export default function RegexBuilder() {
  const [segments, setSegments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [configSeg, setConfigSeg] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [copied, setCopied] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const addSegment = () =>
    setSegments((s) => [...s, { id: uuidv4(), type: "fixed", optional: false, config: { value: "FIXED" } }]);

  const changeSegmentType = (id, type) =>
    setSegments((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        switch (type) {
          case "fixed":
            return { ...s, type, config: { value: "FIXED" } };
          case "digits":
            return { ...s, type, config: { min: 1, max: 4 } };
          case "letters":
            return { ...s, type, config: { case: "any", min: 1, max: 3 } };
          case "alphanumeric":
            return { ...s, type, config: { min: 1, max: 4 } };
          default:
            return { ...s, type, config: { regex: "" } };
        }
      })
    );

  const regex = useMemo(
    () =>
      segments
        .map((s) => {
          let r = "";
          switch (s.type) {
            case "fixed":
              r = escapeRegex(s.config.value);
              break;
            case "digits":
              r = `\\d{${s.config.min},${s.config.max}}`;
              break;
            case "letters": {
              const c = s.config.case === "upper" ? "A-Z" : s.config.case === "lower" ? "a-z" : "a-zA-Z";
              r = `[${c}]{${s.config.min},${s.config.max}}`;
              break;
            }
            case "alphanumeric":
              r = `[a-zA-Z0-9]{${s.config.min},${s.config.max}}`;
              break;
            case "custom":
              r = s.config.regex || "";
              break;
          }
          return s.optional ? `(${r})?` : r;
        })
        .join(""),
    [segments]
  );

  const handleSaveEdit = () => {
    if (editingId) {
      setSegments((p) =>
        p.map((x) => (x.id === editingId ? { ...x, config: { value: editingValue } } : x))
      );
      setEditingId(null);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(regex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Box sx={{ height: "100vh", display: "grid", placeItems: "center", gap: 3 }}>
      <Container>
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
          <SortableContext items={segments.map((s) => s.id)} strategy={horizontalListSortingStrategy}>
            <Stack direction="row" spacing={1} sx={{ minWidth: 200, border: "1px solid #ccc", p: 1, borderRadius: "6px 6px 6px 0" }}>
              <Stack direction="row" flexGrow={1} alignItems="center">
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
                    onDelete={(id) => setSegments((prev) => prev.filter((s) => s.id !== id))}
                    saveEdit={handleSaveEdit}
                    handleKeyDown={(e) => {
                      if(e.key === "Escape"){
                        setEditingId(null);
                      }else if(e.key === "Enter"){
                        handleSaveEdit()
                      }
                    }}
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
          <TextField
            fullWidth
            size="small"
            value={regex}
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title={copied ? "Copied!" : "Copy"}>
                    <IconButton edge="end" size="small" onClick={handleCopy} tabIndex={-1}>
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "0px 0px 6px 6px",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "1px solid #ccc",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  border: "1px solid #ccc",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: "1px solid #ccc",
                },
              },
              "& input": {
                cursor: "default",
              },
            }}
          />
        </Box>

        <ConfigPopover
          anchorEl={anchorEl}
          segment={configSeg}
          onChange={(k, v) => setConfigSeg((s) => ({ ...s, config: { ...s.config, [k]: v } }))}
          onSave={() => {
            setSegments((p) => p.map((x) => (x.id === configSeg.id ? configSeg : x)));
            setAnchorEl(null);
          }}
          onClose={() => setAnchorEl(null)}
        />

        <RegexExamples regex={regex} />
      </Container>
    </Box>
  );
}
