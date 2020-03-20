import { Methods } from "../methods";
import { Models } from "../models";
const { JSONPath } = require('jsonpath-plus');
const nodejq = require("jq-in-the-browser").default;

import { OpenAPIProcessor } from "./openapi";
import { RustServerProcessor } from "./rust-server";

// tip: use https://jsonpath.com/ and https://duckduckgo.com/?q=json+format https://github.com/s3u/JSONPath
// json templating: https://www.npmjs.com/package/jsonpath-object-transform
// https://runkit.com/kantord/runkit-npm-jq-in-the-browser
// https://github.com/kantord/jq-in-the-browser

export module Processors {
    export let services = {
        "rust": "ws://172.105.183.189/rust",
        "typescript": "ws://172.105.183.189/rust",
        "openapi": "ws://172.105.183.189/openapi"
    };
    export let processors = {
        "typescript-client": {
            server: services.typescript,
            syntax: "typescript"
        },
        "rust-server": {
            server: services.rust,
            syntax: "rust",
            extractSpec: RustServerProcessor.extractSpec,
            // generate: RustServerProcessor.generate,
            merge: RustServerProcessor.merge,
            async getProject(code: string): Promise<Models.Project> {
                return await Methods.serialise(this.server, code).then((response) => {
                    console.log(response);

                    // const functions = JSONPath({path: '$..fn.ident', json: response});
                    const structs = JSONPath({path: '$..struct.ident', json: response});
                    let models = structs.map((struct) => {
                        return { name: struct, vars: [] };
                    });

                    return {
                        models: models,
                        requests: [],
                    };
                });
            }
        },
        "openapi": {
            server: services.openapi,
            syntax: "yaml",
            extractSpec: OpenAPIProcessor.extractSpec,
            getProject: OpenAPIProcessor.getProject,
            // generate: OpenAPIProcessor.generate,
            merge: OpenAPIProcessor.merge
        },
    };
    export function sync() {
        console.log(processors);
    }
}

function transform(json:any, transform: string) {
    return nodejq(transform)(json);
}

function select(json: any, path: string) {
    return JSONPath({path: '$..components.schemas', json: json, wrap: false});
}