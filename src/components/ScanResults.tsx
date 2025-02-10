
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpDown, FolderOpen, Image, File, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  useEffect(() => {
    // Simulated data - replace with actual API call
    const mockResults: ScanResult[] = [
      // Example of multiple domain scan folders
      { name: 'example.com', type: 'folder', path: '/root/reconftw/Recon/example.com' },
      { name: 'screenshot.png', type: 'image', path: '/root/reconftw/Recon/example.com/screenshot.png' },
      { name: 'blibli.com', type: 'folder', path: '/root/reconftw/Recon/blibli.com' },
      { name: 'screenshot.png', type: 'image', path: '/root/reconftw/Recon/blibli.com/screenshot.png' },
      { name: 'subdomain.txt', type: 'file', path: '/root/reconftw/Recon/blibli.com/subdomain.txt' },
      { name: 'google.com', type: 'folder', path: '/root/reconftw/Recon/google.com' },
      { name: 'screenshot.png', type: 'image', path: '/root/reconftw/Recon/google.com/screenshot.png' },
      { name: 'report.txt', type: 'file', path: '/root/reconftw/Recon/google.com/report.txt' },
      { name: 'tokopedia.com', type: 'folder', path: '/root/reconftw/Recon/tokopedia.com' },
      { name: 'screenshot.png', type: 'image', path: '/root/reconftw/Recon/tokopedia.com/screenshot.png' },
      { name: 'vulnerabilities.txt', type: 'file', path: '/root/reconftw/Recon/tokopedia.com/vulnerabilities.txt' },
    ];

    // In production, you would replace this with an API call to your backend
    // The backend should read the directory contents of /root/reconftw/Recon/
    // Example API call:
    // fetch('/api/scan-results')
    //   .then(response => response.json())
    //   .then(data => setResults(data))
    //   .catch(error => {
    //     console.error('Error fetching scan results:', error);
    //     toast({
    //       title: "Error",
    //       description: "Failed to load scan results",
    //       variant: "destructive",
    //     });
    //   });

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

  const getIcon = (type: 'folder' | 'image' | 'file') => {
    switch (type) {
      case 'folder':
        return <FolderOpen className="w-4 h-4 md:w-5 md:h-5" />;
      case 'image':
        return <Image className="w-4 h-4 md:w-5 md:h-5" />;
      default:
        return <File className="w-4 h-4 md:w-5 md:h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-2 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 md:mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold">Recon Gan</h1>
          <Button variant="ghost" onClick={logout} className="w-full md:w-auto">
            <LogOut className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            Logout
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 mb-4 md:mb-6">
          <Input
            placeholder="Search results..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:max-w-sm"
          />
          <Button onClick={handleSort} className="w-full md:w-auto">
            <ArrowUpDown className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            Sort {sortAsc ? 'Descending' : 'Ascending'}
          </Button>
        </div>

        <div className="grid gap-2 md:gap-4 animate-fadeIn">
          {filteredResults.map((result, index) => (
            <Card key={result.path} className="hover:bg-accent transition-colors">
              <CardContent className="flex items-center p-2 md:p-4">
                <span className="mr-2 md:mr-4 text-sm md:text-base text-muted-foreground">
                  {index + 1}
                </span>
                {getIcon(result.type)}
                <span className="ml-2 md:ml-4 flex-1 text-sm md:text-base truncate">
                  {result.name}
                </span>
                {result.type === 'image' && (
                  <Button 
                    variant="outline" 
                    onClick={() => window.open(result.path, '_blank')}
                    className="ml-2 text-sm"
                  >
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
