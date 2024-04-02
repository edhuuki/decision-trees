import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';


export class notes implements vscode.TreeDataProvider<FileNode> {

    private _onDidChangeTreeData: vscode.EventEmitter<FileNode | undefined | void> = new vscode.EventEmitter<FileNode | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<FileNode | undefined | void> = this._onDidChangeTreeData.event;

    data:FileNode[];

	constructor(private workspaceRoot: string | undefined) {
        this.data = [];
	}
    refresh(): void {
		this._onDidChangeTreeData.fire();
	}

    getTreeItem(element: FileNode): vscode.TreeItem{
		let node = element;
		node.command = {
			command: 'notes.reveal',
			title: "Open File",
			arguments: [element.path]
		};
        return element;
    }


	getChildren(element?: FileNode): Thenable<FileNode[]> {
		if (!this.workspaceRoot) {
			vscode.window.showInformationMessage('No FileNode in empty workspace');
			return Promise.resolve([]);
		}
		let filePath = element ? element.path : this.workspaceRoot;
		return Promise.resolve(this.getFilesInDirectory(filePath));
	}

    private getFilesInDirectory(directoryPath: string): FileNode[] {
        const files = fs.readdirSync(directoryPath);
        return files.map(file => {
            const filePath = path.join(directoryPath, file)||".";
            const isDirectory = fs.statSync(filePath).isDirectory();
            return new FileNode(file, filePath, isDirectory ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None);
        });
    }

    private pathExists(p: string): boolean {
		try {
			fs.accessSync(p);
		} catch (err) {
			return false;
		}

		return true;
	}

}

export class FileNode extends vscode.TreeItem {

	constructor(
		public readonly label: string,
		public readonly path: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState
	) {
		super(label, collapsibleState);
		this.tooltip = `${this.label}`;
	}

	iconPath = {
		light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
		dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
	};

	contextValue = 'dependency';

	private reveal(){
		vscode.window.showTextDocument(vscode.Uri.file(this.path));
	}

}