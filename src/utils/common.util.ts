import { MatSnackBar } from "@angular/material/snack-bar";
import { ISnackBarConfig } from "src/interface/snack-bar-config.interface";

export function openSnackBar(snackBar: MatSnackBar, snackBarConfig: ISnackBarConfig) {
  snackBar.open(snackBarConfig?.message, '', snackBarConfig)
}
