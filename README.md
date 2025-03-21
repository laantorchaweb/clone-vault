# Clone Vault Plugin

Easily create a new Obsidian vault by duplicating your current vault’s settings, folder structure, and selectively copying specific folders (like templates or other important resources).

## Features

✅ Clones your vault’s settings folder (e.g., .obsidian or a custom folder if renamed), preserving your full workspace configuration

✅ Preserves the folder structure of your vault

✅ Optionally copies the contents of selected folders – great for things like templates, snippets, or assets

✅ Handy modal prompt to name and create your new vault

✅ Configurable default location for new vaults

## Cloning Vault Settings

Obsidian stores each vault’s settings (plugins, themes, hotkeys, workspace layout, etc.) in a settings folder — typically named .obsidian. However, some advanced users may rename this folder using custom configurations.

🔹 Clone Vault automatically detects and copies the correct settings folder, whether it’s named .obsidian or something else, ensuring the new vault behaves exactly like the original.

## Selectively Copy Folder Contents

By default, Clone Vault preserves the folder structure of your vault but doesn’t copy file contents. You can, however, specify which folders should be copied along with their files.

How to Specify Folders to Copy
1.	Open Obsidian Settings → Clone Vault plugin settings.
 
2.	In the “Folders to Copy” field, enter a comma-separated list of folder names (e.g., Templates, Snippets, Assets).
 
3.	When creating a new vault, Clone Vault will copy the contents of those folders into the new vault.


💡 Example:

If your vault has this structure:

```
📂 MyVault  
 ├── .obsidian/  
 ├── Templates/  
 │   ├── Meeting Notes.md  
 │   ├── Journal.md  
 ├── Snippets/  
 │   ├── CustomCSS.css  
 ├── Assets/  
 │   ├── Logo.png  
 │   ├── Background.jpg  
 ├── Notes/
```

And you enter Templates, Snippets in the plugin settings, your new vault will contain:

```
📂 NewVault  
 ├── .obsidian/  (or custom settings folder, cloned automatically)  
 ├── Templates/  (Includes Meeting Notes.md, Journal.md)  
 ├── Snippets/   (Includes CustomCSS.css)  
 ├── Assets/     (Empty – not copied)  
 ├── Notes/      (Empty – structure only, unless included in the list)  
```


## Installation & Usage
1.	Install Clone Vault from the Obsidian Community Plugins browser.
2.	Enable the plugin in Settings → Community Plugins.
3.	Configure your preferences in Settings → Clone Vault:
     - Set the default location for new vaults
     - Specify which folders should have their contents copied (optional)
5.	Use the “Clone Vault” command from the command palette or plugin menu
6.	Enter a name for your new vault when prompted


## Development

To install and build this plugin for local use:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/laantorchaweb/clone-vault.git
   cd clone-vault
   ```

2. **Install Dependencies**  
   Make sure you have [Node.js](https://nodejs.org/) installed, then run:
   ```bash
   npm install
   ```

3. **Build the Plugin**  
   Compile the TypeScript code into a `main.js` file:
   ```bash
   npm run build
   ```

4. **Install the Plugin in your Obsidian vault**  
   - Locate your Obsidian vault folder.
   - Navigate to the `.obsidian/plugins/` directory.
   - Create a new folder named `clone-vault`.
   - Copy the following files into that folder:
     - `manifest.json`
     - `main.js`

5. **Enable the Plugin**  
   - Open Obsidian.
   - Go to **Settings → Community plugins**.
   - Enable **Clone Vault**.
