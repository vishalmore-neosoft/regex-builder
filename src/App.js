import { lightPalette } from "./config/palette";
import { RegexBuilder } from "./widgets/regex-builder";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: lightPalette
});
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <RegexBuilder />
    </ThemeProvider>
  );
}
