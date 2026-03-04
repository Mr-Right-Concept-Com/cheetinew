import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Folder, File, ChevronRight, Upload, Download, Trash2, FolderPlus, Home } from "lucide-react";
import { toast } from "sonner";

interface FileItem {
  name: string;
  type: "folder" | "file";
  size: string;
  modified: string;
  permissions: string;
}

const mockFiles: Record<string, FileItem[]> = {
  "/": [
    { name: "public_html", type: "folder", size: "-", modified: "2026-02-28", permissions: "drwxr-xr-x" },
    { name: "logs", type: "folder", size: "-", modified: "2026-03-04", permissions: "drwxr-x---" },
    { name: "ssl", type: "folder", size: "-", modified: "2026-01-15", permissions: "drwx------" },
    { name: "tmp", type: "folder", size: "-", modified: "2026-03-04", permissions: "drwxrwxrwt" },
    { name: ".htaccess", type: "file", size: "1.2 KB", modified: "2026-02-20", permissions: "-rw-r--r--" },
  ],
  "/public_html": [
    { name: "wp-content", type: "folder", size: "-", modified: "2026-03-01", permissions: "drwxr-xr-x" },
    { name: "wp-admin", type: "folder", size: "-", modified: "2026-02-28", permissions: "drwxr-xr-x" },
    { name: "wp-includes", type: "folder", size: "-", modified: "2026-02-28", permissions: "drwxr-xr-x" },
    { name: "index.php", type: "file", size: "405 B", modified: "2026-02-28", permissions: "-rw-r--r--" },
    { name: "wp-config.php", type: "file", size: "3.1 KB", modified: "2026-03-01", permissions: "-rw-r-----" },
    { name: ".htaccess", type: "file", size: "834 B", modified: "2026-02-28", permissions: "-rw-r--r--" },
    { name: "robots.txt", type: "file", size: "124 B", modified: "2026-01-10", permissions: "-rw-r--r--" },
  ],
};

export const FileManager = () => {
  const [currentPath, setCurrentPath] = useState("/");
  const files = mockFiles[currentPath] || mockFiles["/"];
  const pathParts = currentPath.split("/").filter(Boolean);

  const navigateTo = (folder: string) => {
    const newPath = currentPath === "/" ? `/${folder}` : `${currentPath}/${folder}`;
    if (mockFiles[newPath]) {
      setCurrentPath(newPath);
    } else {
      toast.info(`Opening ${folder}...`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" variant="outline" className="gap-1" onClick={() => toast.info("Upload dialog opening...")}>
          <Upload className="h-3 w-3" /> Upload
        </Button>
        <Button size="sm" variant="outline" className="gap-1" onClick={() => toast.info("Creating new folder...")}>
          <FolderPlus className="h-3 w-3" /> New Folder
        </Button>
        <Button size="sm" variant="outline" className="gap-1" onClick={() => toast.info("Downloading...")}>
          <Download className="h-3 w-3" /> Download
        </Button>
        <Button size="sm" variant="outline" className="gap-1 text-destructive" onClick={() => toast.info("Select files to delete")}>
          <Trash2 className="h-3 w-3" /> Delete
        </Button>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-sm bg-muted/50 rounded-md px-3 py-2">
        <Button variant="ghost" size="sm" className="h-6 px-1" onClick={() => setCurrentPath("/")}>
          <Home className="h-3 w-3" />
        </Button>
        {pathParts.map((part, i) => (
          <span key={i} className="flex items-center gap-1">
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-1 text-xs"
              onClick={() => setCurrentPath("/" + pathParts.slice(0, i + 1).join("/"))}
            >
              {part}
            </Button>
          </span>
        ))}
      </div>

      {/* File Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead className="hidden md:table-cell">Modified</TableHead>
              <TableHead className="hidden lg:table-cell">Permissions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPath !== "/" && (
              <TableRow className="cursor-pointer hover:bg-muted/50" onClick={() => {
                const parent = "/" + pathParts.slice(0, -1).join("/");
                setCurrentPath(parent === "/" ? "/" : parent);
              }}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Folder className="h-4 w-4 text-primary" />
                    ..
                  </div>
                </TableCell>
                <TableCell>-</TableCell>
                <TableCell className="hidden md:table-cell">-</TableCell>
                <TableCell className="hidden lg:table-cell">-</TableCell>
              </TableRow>
            )}
            {files.map((file) => (
              <TableRow
                key={file.name}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => file.type === "folder" ? navigateTo(file.name) : toast.info(`Opening ${file.name}...`)}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {file.type === "folder" ? (
                      <Folder className="h-4 w-4 text-primary" />
                    ) : (
                      <File className="h-4 w-4 text-muted-foreground" />
                    )}
                    {file.name}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{file.size}</TableCell>
                <TableCell className="text-muted-foreground hidden md:table-cell">{file.modified}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Badge variant="outline" className="text-[10px] font-mono">{file.permissions}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
