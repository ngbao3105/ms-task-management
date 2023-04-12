import { MatSnackBarConfig } from "@angular/material/snack-bar";

export interface ISnackBarConfig extends MatSnackBarConfig {
  message?: string;
  duration?: number;
}
