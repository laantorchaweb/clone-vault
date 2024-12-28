# Clone Vault Plugin

Create a new Obsidian vault by duplicating your current vault’s **settings**, **folder structure**, and selectively copying certain folders (like your templates folder).

## Features
- Clones `.obsidian` settings folder into a new vault
- Preserves folder structure (optionally copying contents for specific folders)
- Handy modal prompt for naming your new vault
- Configurable default location for new vaults

## Installation

To install and build this plugin for local use:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/laantorchaweb/clone-vault.git
   cd clone-vault-plugin
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
