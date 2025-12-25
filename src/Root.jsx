import { Container } from "@mui/material";
import App from "./App";
import { themePalette } from "./config/palette";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: themePalette
});
export default function Root() {
  return (
    <ThemeProvider theme={theme}>
      <Container>
        <App/>
      </Container>
    </ThemeProvider>
  );
}
