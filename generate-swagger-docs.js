// FILE: backend/generate-swagger-docs.js
// Run this to generate static HTML docs

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Finwise API Documentation</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.10.5/swagger-ui.css">
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.10.5/swagger-ui-bundle.js"></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: "./openapi.yaml",
        dom_id: "#swagger-ui",
        presets: [
          SwaggerUIBundle.presets.apis,
        ],
        layout: "BaseLayout",
      });
    };
  </script>
</body>
</html>
`;

// Create docs folder
const docsDir = path.join(__dirname, 'docs');
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir);
}

// Copy openapi.yaml
fs.copyFileSync(
  path.join(__dirname, 'openapi.yaml'),
  path.join(docsDir, 'openapi.yaml')
);

// Write index.html
fs.writeFileSync(path.join(docsDir, 'index.html'), html);

console.log(' Swagger documentation generated in backend/docs/');
console.log(' Upload the "docs" folder to GitHub Pages');