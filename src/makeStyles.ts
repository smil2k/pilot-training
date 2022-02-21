import { createMakeStyles } from "tss-react";

export interface Theme {

}

function useTheme() {
        return {
        };
    }

export const { makeStyles } = createMakeStyles<Theme>({ useTheme });