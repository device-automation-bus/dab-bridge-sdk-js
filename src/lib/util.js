/**
 Copyright 2023 Amazon.com, Inc. or its affiliates.
 Copyright 2023 Netflix Inc.
 Copyright 2023 Google LLC
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

import bunyan from 'bunyan';
import {readFileSync} from 'fs';
import {create, serializers} from "bunyan-debug-stream";
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Static logger
let logger;
export function getLogger() {
  if (!logger) {
    const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));
    logger = bunyan.createLogger({
      name: packageJson.name,
      streams: [
        {
          level: 'trace',
          type: 'raw',
          stream: create({
            forceColor: true
          })
        },
        // {
        //   level: 'info',
        //   path: 'dab_adb_bridge.log' // log ERROR and above to a file
        // }
      ],
      serializers: serializers,
      src: false
    });
    // This removes the `v` field as its only needed by bunyan cli and useless to us.
    logger._emit = (rec, noemit) => {
      delete rec.v;
      bunyan.prototype._emit.call(logger, rec, noemit);
    };
  }

  return logger;
}
