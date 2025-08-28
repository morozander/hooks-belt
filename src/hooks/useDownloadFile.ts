import { useState } from "react";

/**
 * A hook that provides file download functionality with loading state management.
 * Automatically handles blob data, creates download links, and manages cleanup.
 *
 * @returns An object containing the download function and loading state
 *
 * @example
 * ```tsx
 * const { downloadFile, isLoading } = useDownloadFile();
 *
 * const handleDownload = async () => {
 *   const response = await fetch('/api/file');
 *   const blob = await response.blob();
 *   await downloadFile({ 
 *     data: blob, 
 *     fileName: 'document.pdf' 
 *   });
 * };
 *
 * return (
 *   <button onClick={handleDownload} disabled={isLoading}>
 *     {isLoading ? 'Downloading...' : 'Download File'}
 *   </button>
 * );
 * ```
 */
export const useDownloadFile = () => {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Downloads a file from blob data with automatic cleanup
   * @param data - The blob data to download
   * @param fileName - Optional filename for the download (default: 'file')
   */
  const downloadFile = async ({ data, fileName = 'file' }: { data: Blob, fileName?: string }) => {
    try {
      setIsLoading(true);
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  return {
    downloadFile,
    isLoading,
  };
}