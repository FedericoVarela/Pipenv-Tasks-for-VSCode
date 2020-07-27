import * as vscode from "vscode";
import * as fs from 'fs';
import * as path from 'path';
import * as toml from "toml";

export class PipenvScriptProvider implements vscode.TaskProvider {

    static PipenvType = "pipenv";
    private pipenvPromise: Thenable<vscode.Task[]> | undefined = undefined;

    constructor(private workspaceRoot: string) {
        const pattern = path.join(workspaceRoot, "Pipfile");
        const fileWatcher = vscode.workspace.createFileSystemWatcher(pattern);
        fileWatcher.onDidChange(() => this.pipenvPromise = undefined);
        fileWatcher.onDidCreate(() => this.pipenvPromise = undefined);
        fileWatcher.onDidDelete(() => this.pipenvPromise = undefined);
    }

    public provideTasks(): Thenable<vscode.Task[]> | undefined {
        if (!this.pipenvPromise) {
            this.pipenvPromise = this.getScriptsFromPipfile();
        }
        return this.pipenvPromise;
    }

    public resolveTask(_task: vscode.Task): vscode.Task | undefined {
        const task = _task.definition.task;
        if (task) {
            const definition : PipenvTaskDefinition = <any>_task.definition;
            return new vscode.Task(
                definition, 
                definition.task, 
                "pipenv",
                new vscode.ShellExecution(`pipenv run ${definition.task}`)
                );
        }
        return undefined;
    }

    private async getScriptsFromPipfile(): Promise<vscode.Task[]> {
        const res: vscode.Task[] = [];
        const pipfilePath = path.join(this.workspaceRoot, "Pipfile");

        if (!pathExists(pipfilePath)) {
            return res;
        } else {
            const data = fs.readFileSync(pipfilePath, "utf-8");
            const scriptNames = toml.parse(data).scripts;
            Object.keys(scriptNames).forEach((name) => {
                const kind : PipenvTaskDefinition = {
                    type: "pipenv",
                    task: name
                };
                const task = new vscode.Task(
                    kind,
                    name,
                    "pipenv",
                    new vscode.ShellExecution(`pipenv run ${name}`)
                );
                res.push(task);
            }
            );

            return res;

        }

    }

}


function pathExists(p: string): boolean {
    try {
        fs.accessSync(p);
    } catch (err) {
        return false;
    }
    return true;
}

interface PipenvTaskDefinition extends vscode.TaskDefinition {
    task: string;
    file?: string
}