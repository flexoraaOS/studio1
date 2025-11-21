'use client';
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set('q', query);
    } else {
      params.delete('q');
    }
    
    if (pathname === '/trades') {
      router.replace(`${pathname}?${params.toString()}`);
    } else {
      router.push(`/trades?${params.toString()}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative flex-1 ml-auto">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search trades by symbol..."
        className="w-full rounded-lg bg-secondary pl-8 md:w-[280px] lg:w-[320px]"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );
}
