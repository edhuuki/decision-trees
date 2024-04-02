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


	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "decision-trees" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('decision-trees.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from decision_trees!');
	});
	

	context.subscriptions.push(disposable);


	vscode.window.registerTreeDataProvider('tree-notes', new notes(path.join(rootPath,'NOTES')));
	vscode.window.registerTreeDataProvider('tree-flows', new notes(path.join(rootPath,'FLOWS')));
	

	vscode.commands.registerCommand('tree-notes.editNote', (element)=>{
		vscode.window.showTextDocument(vscode.Uri.file(element.path));
	})

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
