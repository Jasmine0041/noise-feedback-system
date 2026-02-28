import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, AlertCircle } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="h-24 w-24 rounded-full bg-[hsl(210_40%_96%)] flex items-center justify-center mx-auto">
          <AlertCircle className="h-12 w-12 text-[hsl(215_16%_47%)]" />
        </div>
        
        <div>
          <h1 className="text-4xl font-bold text-[hsl(222_47%_11%)] mb-2">404</h1>
          <p className="text-xl text-[hsl(215_16%_47%)]">页面未找到</p>
        </div>
        
        <p className="text-[hsl(215_16%_47%)] max-w-md">
          抱歉，您访问的页面不存在或已被移除。
        </p>
        
        <Link to="/">
          <Button className="bg-[hsl(217_91%_60%)] hover:bg-[hsl(217_91%_50%)]">
            <Home className="h-4 w-4 mr-2" />
            返回首页
          </Button>
        </Link>
      </div>
    </div>
  );
}