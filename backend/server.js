
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

// Enable CORS for your frontend domain
app.use(cors({
  origin: 'http://YOUR_FRONTEND_DOMAIN',
  credentials: true
}));

// Serve static files from reconftw directory
app.use('/reconftw', express.static('/var/www/recon-galaxy/Recon'));

// Function to scan directory and return file info
const scanDirectory = (dirPath) => {
  const results = [];
  const items = fs.readdirSync(dirPath);
  
  items.forEach((item) => {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      results.push({
        name: item,
        type: 'folder',
        path: fullPath
      });
      
      // Scan files inside the folder
      const filesInDir = fs.readdirSync(fullPath);
      filesInDir.forEach((file) => {
        const filePath = path.join(fullPath, file);
        const fileStat = fs.statSync(filePath);
        const ext = path.extname(file).toLowerCase();
        
        results.push({
          name: file,
          type: ext === '.png' || ext === '.jpg' || ext === '.jpeg' ? 'image' : 'file',
          path: filePath
        });
      });
    }
  });
  
  return results;
};

// API endpoint to get scan results
app.get('/api/scan-results', (req, res) => {
  try {
    const results = scanDirectory('/var/www/recon-galaxy/Recon');
    res.json(results);
  } catch (error) {
    console.error('Error scanning directory:', error);
    res.status(500).json({ error: 'Failed to scan directory' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
