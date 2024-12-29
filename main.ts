import {
	Plugin,
	Notice,
	PluginSettingTab,
	Setting,
	Modal,
	App,
    FileSystemAdapter,
} from "obsidian";
import * as fs from "fs";
import * as path from "path";

interface CloneVaultPluginSettings {
	defaultVaultLocation: string;
	foldersToCopy: string; // Comma or line-separated
}

const DEFAULT_SETTINGS: CloneVaultPluginSettings = {
	defaultVaultLocation: "",
	foldersToCopy: "",
};

class NamePromptModal extends Modal {
	vaultName: string;
	onSubmit: (vaultName: string) => void;

	constructor(app: App, onSubmit: (vaultName: string) => void) {
		super(app);
		this.onSubmit = onSubmit;
		this.vaultName = "";
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.createEl("h2", { text: "New Vault Name" });

		new Setting(contentEl).setName("Vault Name").addText((text) =>
			text.onChange((value) => {
				this.vaultName = value;
			}),
		);

		new Setting(contentEl).addButton((btn) =>
			btn
				.setButtonText("Create")
				.setCta()
				.onClick(() => {
					this.close();
					this.onSubmit(this.vaultName);
				}),
		);
	}

	onClose() {
		this.contentEl.empty();
	}
}

export default class CloneVaultPlugin extends Plugin {
	settings: CloneVaultPluginSettings;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new CloneVaultPluginSettingTab(this.app, this));

		this.addCommand({
			id: "create-new-vault",
			name: "Create New Vault",
			callback: async () => {
				const modal = new NamePromptModal(
					this.app,
					async (vaultName: string) => {
						if (!vaultName) {
							new Notice("No vault name provided!");
							return;
						}
						try {
							const currentVaultPath = (
								this.app.vault.adapter as FileSystemAdapter
							).getBasePath();
							const newVaultPath = path.join(
								this.settings.defaultVaultLocation,
								vaultName,
							);

							await copyObsidianFolder(
								currentVaultPath,
								newVaultPath,
							);
							await copyFolderStructure(
								currentVaultPath,
								newVaultPath,
								this.settings.foldersToCopy,
							);

							new Notice(
								`Vault "${vaultName}" created successfully!`,
							);
						} catch (err) {
							console.error(err);
							new Notice("Vault creation failed!");
						}
					},
				);
				modal.open();
			},
		});
	}

	async onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData(),
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class CloneVaultPluginSettingTab extends PluginSettingTab {
	plugin: CloneVaultPlugin;

	constructor(app: App, plugin: CloneVaultPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display() {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("Default Vault Location")
			.setDesc("Base folder where new vaults will be created.")
			.addText((text) =>
				text
					.setPlaceholder("/Users/username/Documents/ObsidianVaults")
					.setValue(this.plugin.settings.defaultVaultLocation)
					.onChange(async (value) => {
						this.plugin.settings.defaultVaultLocation = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName("Folders to Copy with Files")
			.setDesc("Comma or line-separated folder names to copy entirely.")
			.addTextArea((textArea) =>
				textArea
					.setPlaceholder("templates, media, etc.")
					.setValue(this.plugin.settings.foldersToCopy)
					.onChange(async (value) => {
						this.plugin.settings.foldersToCopy = value;
						await this.plugin.saveSettings();
					}),
			);
	}
}

async function copyObsidianFolder(
	currentVaultPath: string,
	newVaultPath: string,
) {
	const oldConfigFolder = path.join(
		currentVaultPath,
		this.app.vault.configDir,
	);
	const newConfigFolder = path.join(newVaultPath, this.app.vault.configDir);
	if (!fs.existsSync(oldConfigFolder)) return;

	fs.mkdirSync(newVaultPath, { recursive: true });
	fs.mkdirSync(newConfigFolder, { recursive: true });

	const items = fs.readdirSync(oldConfigFolder);
	for (const item of items) {
		const src = path.join(oldConfigFolder, item);
		const dest = path.join(newConfigFolder, item);
		const stats = fs.statSync(src);

		if (stats.isDirectory()) {
			fs.mkdirSync(dest, { recursive: true });
			copyDirectory(src, dest);
		} else {
			fs.copyFileSync(src, dest);
		}
	}
}

function copyDirectory(src: string, dest: string) {
	const items = fs.readdirSync(src);
	for (const item of items) {
		const s = path.join(src, item);
		const d = path.join(dest, item);
		const stats = fs.statSync(s);

		if (stats.isDirectory()) {
			fs.mkdirSync(d, { recursive: true });
			copyDirectory(s, d);
		} else {
			fs.copyFileSync(s, d);
		}
	}
}

async function copyFolderStructure(
	currentVaultPath: string,
	newVaultPath: string,
	foldersToCopyStr: string,
) {
	const foldersToCopy = foldersToCopyStr
		.split(/[\n,]+/)
		.map((f) => f.trim())
		.filter(Boolean);

	const entries = fs.readdirSync(currentVaultPath, { withFileTypes: true });
	for (const entry of entries) {
		if (!entry.isDirectory() || entry.name === ".obsidian") continue;

		const folderPath = path.join(currentVaultPath, entry.name);
		const newFolderPath = path.join(newVaultPath, entry.name);
		fs.mkdirSync(newFolderPath, { recursive: true });

		if (foldersToCopy.includes(entry.name)) {
			copyDirectory(folderPath, newFolderPath);
		} else {
			await copyFolderStructure(
				folderPath,
				newFolderPath,
				foldersToCopyStr,
			);
		}
	}
}
