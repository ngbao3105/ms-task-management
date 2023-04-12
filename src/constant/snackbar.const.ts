import { SnackBarMessageEnum } from "src/enum/snackbar.enum";
import { ISnackBarConfig } from "src/interface/snack-bar-config.interface";
import { SNACK_BAR_DURATION } from "./common.const";

export const SNACK_BAR_CONFIG = {
  [SnackBarMessageEnum.SUCCESS]: {
    panelClass: 'snack-bar-success',
    duration: SNACK_BAR_DURATION,
    message: 'Success'
  },
  [SnackBarMessageEnum.FAILED]: {
    panelClass: 'snack-bar-failed',
    duration: SNACK_BAR_DURATION,
    message: 'Failed'
  },
}
