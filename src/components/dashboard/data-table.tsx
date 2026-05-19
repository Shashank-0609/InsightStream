import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RawData, ColumnInfo } from "@/src/types";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface DataTableProps {
  data: RawData[];
  columns: ColumnInfo[];
}

export function DataTable({ data, columns }: DataTableProps) {
  const [search, setSearch] = useState("");
  
  const filteredData = data.filter(row => 
    Object.values(row).some(val => 
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between pb-4 sticky top-0 z-20 bg-card/95 backdrop-blur-sm border-b border-border/50">
        <CardTitle className="text-lg font-medium">Dataset Explorer</CardTitle>
        <div className="relative w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search in records..."
            className="pl-9 h-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto max-h-[400px]">
             <Table>
              <TableHeader className="bg-muted/50 sticky top-0 z-10">
                <TableRow>
                  {columns.map((col) => (
                    <TableHead key={col.name} className="font-bold text-xs uppercase tracking-wider">
                      {col.name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((row, i) => (
                  <TableRow key={i} className="hover:bg-muted/30 transition-colors">
                    {columns.map((col) => (
                      <TableCell key={col.name} className="text-sm font-mono whitespace-nowrap">
                        {String(row[col.name])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
