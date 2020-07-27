"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const scriptReader_1 = require("./scriptReader");
let pipenvScriptProvider;
function activate(_context) {
    const root = vscode.workspace.rootPath;
    if (!root) {
        return;
    }
    pipenvScriptProvider = vscode.tasks.registerTaskProvider(scriptReader_1.PipenvScriptProvider.PipenvType, new scriptReader_1.PipenvScriptProvider(root));
}
exports.activate = activate;
function deactivate() {
    if (pipenvScriptProvider) {
        pipenvScriptProvider.dispose();
    }
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map