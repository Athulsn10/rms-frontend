import { useState, useRef } from 'react';
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const QRGenerator = () => {
  const [tableName, setTableName] = useState('');
  const [qrData, setQrData] = useState('');
  const qrContainerRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const restaurantId = localStorage.getItem('id');
    
    const data = {
      restaurantId,
      tableName
    };
    
    setQrData(JSON.stringify(data));
  };

  const downloadQRCode = () => {
    if (!qrContainerRef.current) return;

    const container:any = qrContainerRef.current;
    const svg = container.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx:any = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      const padding = 40;
      canvas.width = img.width + (padding * 2);
      canvas.height = img.height + (padding * 2);
      
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.drawImage(img, padding, padding);
      
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `Table-${tableName}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Card className="min-h-[470px]">
        <CardHeader>
          <CardTitle>QR Code Generator</CardTitle>
          <CardDescription>
            Generate QR code for restaurant tables
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6 h-100">
            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tableName">Table Name/Number</Label>
                  <Input
                    id="tableName"
                    type="text"
                    placeholder="Enter table name or number"
                    value={tableName}
                    onChange={(e) => setTableName(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full rounded-none p-4 bg-orange-600 hover:bg-orange-500"
                >
                  Generate QR Code
                </Button>
              </form>
            </div>

            <div className={`flex flex-col items-center justify-center ${!qrData && 'hidden md:flex'}`}>
              {qrData ? (
                <div className="flex flex-col items-center space-y-4">
                  <div 
                    ref={qrContainerRef}
                    className="p-8 bg-white rounded-lg"
                  >
                    <QRCode
                      value={qrData}
                      size={256}
                      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                      viewBox={`0 0 256 256`}
                    />
                  </div>
                  <Button 
                    onClick={downloadQRCode}
                    className="bg-orange-600 hover:bg-orange-500 rounded-none"
                    type="button"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download QR Code
                  </Button>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  QR code will appear here
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRGenerator;