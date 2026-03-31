import { useState } from 'react';
import { Button } from '@mui/material';
import { Download, CloudDownload } from '@mui/icons-material';
import api from '../services/api';

export default function DownloadMaster() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadFullDB = async () => {
    try {
      setIsDownloading(true);
      const res = await api.get('/shipments/export-db', { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const date = new Date().toISOString().split('T')[0];
      link.setAttribute('download', `ROJMEL_Database_Backup_${date}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (e) {
      console.error(e);
      alert('Failed to download full database.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-200 text-center max-w-lg w-full">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CloudDownload className="text-[#1565C0]" sx={{ fontSize: 40 }} />
        </div>
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Database Export</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Download a complete backup of the system database. The exported Excel workbook contains dedicated sheets for Shipments, Parties, Vehicles, Goods Types, Cities, and Users.
        </p>
        <Button
          variant="contained"
          size="large"
          startIcon={<Download />}
          onClick={handleDownloadFullDB}
          disabled={isDownloading}
          sx={{
            py: 1.5,
            px: 4,
            textTransform: 'none',
            fontSize: '1.1rem',
            backgroundColor: '#1565C0',
            '&:hover': { backgroundColor: '#0d47a1' }
          }}
        >
          {isDownloading ? 'Generating Export...' : 'Download Full Database (Excel)'}
        </Button>
      </div>
    </div>
  );
}
