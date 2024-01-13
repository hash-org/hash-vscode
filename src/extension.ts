/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as path from 'path';
import { workspace, ExtensionContext } from 'vscode';

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	Executable,
	TransportKind
} from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: ExtensionContext) {
	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used

	let hashPath = process.env.HASH_PATH;
	if (hashPath == undefined) {
		hashPath = "";
	};

	const command = path.join(hashPath, "hash-lsp");

	const runner: Executable = {
		command,
		args: [],
		options: { env: {} }
	};

	const runnerDebug: Executable = {
		command,
		args: [],
		options: { env: {} }
	};

	const serverOptions: ServerOptions = {
		run: runner,
		debug: runnerDebug
	};

	// Options to control the language client
	const clientOptions: LanguageClientOptions = {
		// Register the server for plain text documents
		documentSelector: [{ scheme: 'file', language: 'hash' }],
		synchronize: {
			// Notify the server about file changes to '.clientrc files contained in the workspace
			// fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
		}
	};

	// Create the language client and start the client.
	client = new LanguageClient(
		'hash-lsp',
		'Language Server For Hash',
		serverOptions,
		clientOptions
	);

	// Start the client. This will also launch the server
	client.start();
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
