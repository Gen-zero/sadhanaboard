import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, MoreHorizontal } from 'lucide-react';

interface Column {
  key: string;
  title: string;
  sortable?: boolean;
}

interface Row {
  id: string | number;
  [key: string]: any;
}

interface CosmicTableProps {
  columns: Column[];
  data: Row[];
  onSort?: (columnKey: string, direction: 'asc' | 'desc') => void;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onRowClick?: (row: Row) => void;
  actions?: (row: Row) => React.ReactNode;
}

const CosmicTable: React.FC<CosmicTableProps> = ({
  columns,
  data,
  onSort,
  sortColumn,
  sortDirection,
  onRowClick,
  actions
}) => {
  const handleSort = (columnKey: string) => {
    if (!onSort || !columns.find(col => col.key === columnKey)?.sortable) return;
    
    const newDirection = sortColumn === columnKey && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(columnKey, newDirection);
  };

  return (
    <div className="cosmic-card overflow-hidden">
      <div className="cosmic-card-glow"></div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-purple-500/20">
              {columns.map((column) => (
                <th 
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center">
                    {column.title}
                    {column.sortable && (
                      <span className="ml-1">
                        {sortColumn === column.key ? (
                          sortDirection === 'asc' ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )
                        ) : (
                          <ChevronDown className="h-4 w-4 opacity-30" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions && (
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-500/10">
            {data.map((row, index) => (
              <motion.tr
                key={row.id}
                className={`hover:bg-background/40 transition-colors ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onRowClick?.(row)}
                whileHover={{ backgroundColor: 'rgba(138, 43, 226, 0.05)' }}
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm">
                    {row[column.key]}
                  </td>
                ))}
                {actions && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {actions(row)}
                  </td>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CosmicTable;