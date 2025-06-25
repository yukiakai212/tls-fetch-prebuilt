'use strict';
import path from 'node:path';
import { loadBinding } from '@node-rs/helper';
import packageData from './package.json' with { type: 'json' };
export default loadBinding(path.join(import.meta.dirname, packageData.releaseBinary), packageData.napi.name, packageData.name);