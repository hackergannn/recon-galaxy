import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpDown, FolderOpen, Image, File, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ScanResult {
  name: string;
  type: 'folder' | 'image' | 'file';
  path: string;
}

const ScanResults = () => {
  const [results, setResults] = useState<ScanResult[]>([]);
  const [sortAsc, setSortAsc] = useState(true);
  const [search, setSearch] = useState('');
  const { toast } = useToast();
  const { logout } = useAuth();

  // This is where you'll fetch the actual results from your nginx server
  useEffect(() => {
    // Simulated data - replace with actual API call
    const mockResults = [
      { name: 'example.com', type: 'folder', path: '/root/reconftw/Recon/example.com' },
      { name: 'screenshot.png', type: 'image', path: '/root/reconftw/Recon/example.com/screenshot.png' },
    ];
    setResults(mockResults);
  }, []);

  const handleSort = () => {
    setSortAsc(!sortAsc);
    setResults(prev => [...prev].sort((a, b) => {
      return sortAsc 
        ? b.name.localeCompare(a.name)
        : a.name.localeCompare(b.name);
    }));
  };

  const filteredResults = results.filter(result => 
    result.name.toLowerCase().includes(search.toLowerCase())
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'folder':
        return <FolderOpen className="w-5 h-5" />;
      case 'image':
        return <Image className="w-5 h-5" />;
      default:
        return <File className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Recon Gan</h1>
          <Button variant="ghost" onClick={logout}>
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </Button>
        </div>
        
        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Search results..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <Button onClick={handleSort}>
            <ArrowUpDown className="w-5 h-5 mr-2" />
            Sort {sortAsc ? 'Descending' : 'Ascending'}
          </Button>
        </div>

        <div className="grid gap-4 animate-fadeIn">
          {filteredResults.map((result, index) => (
            <Card key={result.path} className="hover:bg-accent transition-colors">
              <CardContent className="flex items-center p-4">
                <span className="mr-4 text-muted-foreground">{index + 1}</span>
                {getIcon(result.type)}
                <span className="ml-4 flex-1">{result.name}</span>
                {result.type === 'image' && (
                  <Button variant="outline" onClick={() => window.open(result.path, '_blank')}>
                    View
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScanResults;