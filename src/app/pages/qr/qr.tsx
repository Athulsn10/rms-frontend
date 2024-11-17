import React, { useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera } from 'lucide-react';

interface QRScannerConfig {
    fps: number;
    qrbox: {
        width: number;
        height: number;
    };
    aspectRatio: number;
    showTorchButtonIfSupported: boolean;
}

interface ScannerProps {
    onResult?: (result: string) => void;
    className?: string;
}

const QRScanner: React.FC<ScannerProps> = ({ onResult, className = '' }) => {
    const [scanResult, setScanResult] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isScanning, setIsScanning] = useState<boolean>(true);

    const resetScanner = (): void => {
        setScanResult('');
        setError('');
        setIsScanning(true);
        window.location.reload();
    };

    useEffect(() => {
        let scanner: Html5Qrcode | null = null;

        const initializeScanner = async () => {
            try {
                const cameras = await Html5Qrcode.getCameras();
                if (cameras && cameras.length > 0) {
                    const backCamera = cameras.find((camera) =>
                        camera.label.toLowerCase().includes('back')
                    );

                    const cameraId = backCamera ? backCamera.id : cameras[0].id;

                    const config: QRScannerConfig = {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                        aspectRatio: 1,
                        showTorchButtonIfSupported: true,
                    };

                    scanner = new Html5Qrcode('reader');
                    await scanner.start(
                        cameraId,
                        config,
                        (decodedText) => {
                            setScanResult(decodedText);
                            setIsScanning(false);
                            if (onResult) {
                                onResult(decodedText);
                            }
                            scanner?.stop();
                            alert(`Success! QR Code detected: ${decodedText}`);
                        },
                        (errorMessage) => {
                            if (!errorMessage.includes('NotFound')) {
                                setError(errorMessage);
                                alert(`Error: ${errorMessage}`);
                            }
                        }
                    );
                } else {
                    setError('No cameras found.');
                    alert('Error: No cameras found.');
                }
            } catch (err) {
                console.error(err);
                setError('Failed to initialize the scanner.');
                alert('Error: Failed to initialize the scanner.');
            }
        };

        initializeScanner();

        return () => {
            if (scanner) {
                scanner.stop();
            }
            Html5Qrcode.getCameras()
                .then(() => { })
                .catch(console.error);
        };
    }, [onResult]);

    return (
        <div className={`flex flex-col items-center max-w-md mx-auto p-6 space-y-6 ${className}`}>
            <div className="w-full text-center space-y-4">
                <Camera className="w-12 h-12 mx-auto text-blue-500" />
                <h1 className="text-2xl font-bold">Scan Menu Qr Code</h1>
                <p className="text-gray-600">
                    {isScanning ? 'Position the QR code in the center of the camera' : 'QR Code detected!'}
                </p>
            </div>

            {error && (
                <div className="w-full text-red-500">
                    <p>Error: {error}</p>
                </div>
            )}

            {scanResult ? (
                <div className="w-full space-y-4">
                    <p className="bg-green-50 border-green-200 text-green-500">Success! QR Code detected: {scanResult}</p>
                    <button
                        onClick={resetScanner}
                        className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        type="button"
                    >
                        Scan Another Code
                    </button>
                </div>
            ) : (
                <div className="w-full flex justify-center items-center">
                    <div
                        id="reader"
                        className="overflow-hidden rounded-lg  bg-gray-50"
                    />
                </div>
            )}
        </div>
    );
};

export default QRScanner;
