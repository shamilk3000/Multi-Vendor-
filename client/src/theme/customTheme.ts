import { createTheme } from "@mui/material";

const customTheme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#00927c",
        },
        secondary: {
            main: "#EAF0F1",
        },
        error: {
            main: "#ff0000",
        },
        warning: {
            main: "#ff0000",
        },
        info: {
            main: "#1976d2",
        },
        success: {
            main: "#1976d2",
        },
    },
});

export default customTheme;
