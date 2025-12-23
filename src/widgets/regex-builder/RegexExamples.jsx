import { useEffect, useState } from "react";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import { generateRegexExamples } from "./utils/regexExampleGenerator";

const PAGE_SIZE = 5;

export default function RegexExamples({ regex }) {
  const [examples, setExamples] = useState([]);
  const [visible, setVisible] = useState(5);

  useEffect(() => {
    if (!regex) {
      setExamples([]);
      return;
    }
    setExamples(generateRegexExamples(regex));
  }, [regex]);

  if (!examples.length) return null;

  return (
    <Box mt={2} width={"100%"}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="subtitle2">Matching Examples</Typography>

        <Button
          size="small"
          onClick={() => setExamples(generateRegexExamples(regex))}
        >
          Refresh
        </Button>
      </Stack>

      <Stack direction="column" alignItems={"flex-start"} spacing={1} flexWrap="wrap">
        {examples.slice(0, visible).map((ex, i) => (
          <Chip key={i} label={ex} size="small" />
        ))}
      </Stack>
    </Box>
  );
}
