/* eslint import/prefer-default-export: off */
import { app } from 'electron';

export const IS_PACKAGED = app.getAppPath().indexOf('app.asar') !== -1;
export const IS_PRODUCTION = IS_PACKAGED;
export const IS_DEVELOPMENT = !IS_PRODUCTION;
