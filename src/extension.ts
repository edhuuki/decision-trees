// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import { treeDependencies } from './treeDependencies';
import {notes, FileNode} from './notes';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const rootPath = (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
		? vscode.workspace.workspaceFolders[0].uri.fsPath : '.';


	let treeNotes = new notes(path.join(rootPath,'NOTES'));
	let flows = new notes(path.join(rootPath,'FLOWS'));

	vscode.window.registerTreeDataProvider('tree-notes', treeNotes);
	vscode.window.registerTreeDataProvider('tree-flows', flows);
	
	vscode.commands.registerCommand('tree-refresh.', (fileNode: notes) => {
		fileNode.refresh();
	});

	let refresh = vscode.commands.registerCommand('tree-notes.refresh', (treeNotes) => {
		// Assuming 'tree-notes' and 'tree-flows' are instances of your TreeDataProvider
		treeNotes.refresh();
	});
	context.subscriptions.push(refresh);


	let open_note = vscode.commands.registerCommand('notes.reveal', (fileNode) => {
		if (/\.md$/.test(fileNode)) {
			vscode.commands.executeCommand('markdown.showPreview', vscode.Uri.file(fileNode));
		} else {
			vscode.window.showTextDocument(vscode.Uri.file(fileNode));
		}

	});

    context.subscriptions.push(open_note);

	// 	Create a view with TODO items being worked on
	// File explorer organized
	// Every md file in /TODO is a todo item. 
	// every subfolder with the equivalent name as the md file are the subtasks being worked on




	//Connection to canvas for flows




	// vscode.window.registerCustomEditorProvider('decision-trees',)

}

// This method is called when your extension is deactivated
export function deactivate() {}
