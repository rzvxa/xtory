import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import webpackPaths from '../configs/webpack.paths';

export default function deleteSourceMaps() {
  if (fs.existsSync(webpackPaths.distMainPath)) {
    const files = glob.sync(path.join(webpackPaths.distMainPath, '*.js.map'));
    files.forEach((file) => fs.unlinkSync(file));
  }
  if (fs.existsSync(webpackPaths.distRendererPath)) {
    const files = glob.sync(
      path.join(webpackPaths.distRendererPath, '*.js.map')
    );
    files.forEach((file) => fs.unlinkSync(file));
  }
}
