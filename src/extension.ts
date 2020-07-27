import * as vscode from 'vscode';
import { PipenvScriptProvider } from "./scriptReader";

let pipenvScriptProvider: vscode.Disposable | undefined;

export function activate(_context: vscode.ExtensionContext) : void {
	const root = vscode.workspace.rootPath;
	if (!root) {
		return;
	}

	pipenvScriptProvider = vscode.tasks.registerTaskProvider(
		PipenvScriptProvider.PipenvType,
		new PipenvScriptProvider(root)
		);
}

export function deactivate() {
	if (pipenvScriptProvider) {
		pipenvScriptProvider.dispose();
	}
}
