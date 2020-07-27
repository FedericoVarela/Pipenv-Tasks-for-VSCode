"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipenvScriptProvider = void 0;
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const toml = require("toml");
class PipenvScriptProvider {
    constructor(workspaceRoot) {
        this.workspaceRoot = workspaceRoot;
        this.pipenvPromise = undefined;
        const pattern = path.join(workspaceRoot, "Pipfile");
        const fileWatcher = vscode.workspace.createFileSystemWatcher(pattern);
        fileWatcher.onDidChange(() => this.pipenvPromise = undefined);
        fileWatcher.onDidCreate(() => this.pipenvPromise = undefined);
        fileWatcher.onDidDelete(() => this.pipenvPromise = undefined);
    }
    provideTasks() {
        if (!this.pipenvPromise) {
            this.pipenvPromise = this.getScriptsFromPipfile();
        }
        return this.pipenvPromise;
    }
    resolveTask(_task) {
        const task = _task.definition.task;
        if (task) {
            const definition = _task.definition;
            return new vscode.Task(definition, definition.task, "pipenv", new vscode.ShellExecution(`pipenv run ${definition.task}`));
        }
        return undefined;
    }
    getScriptsFromPipfile() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = [];
            const pipfilePath = path.join(this.workspaceRoot, "Pipfile");
            if (!pathExists(pipfilePath)) {
                return res;
            }
            else {
                const data = fs.readFileSync(pipfilePath, "utf-8");
                const scriptNames = toml.parse(data).scripts;
                Object.keys(scriptNames).forEach((name) => {
                    const kind = {
                        type: "pipenv",
                        task: name
                    };
                    const task = new vscode.Task(kind, name, "pipenv", new vscode.ShellExecution(`pipenv run ${name}`));
                    res.push(task);
                });
                return res;
            }
        });
    }
}
exports.PipenvScriptProvider = PipenvScriptProvider;
PipenvScriptProvider.PipenvType = "pipenv";
function pathExists(p) {
    try {
        fs.accessSync(p);
    }
    catch (err) {
        return false;
    }
    return true;
}
//# sourceMappingURL=scriptReader.js.map