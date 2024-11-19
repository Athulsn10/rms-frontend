import QRScanner from "@/components/qr/qr";
import { useContext } from 'react';
import MyContext from "@/app/context/context";

function home() {
  const { showQr } = useContext(MyContext);
  return (
    <>
    {showQr ? <QRScanner /> : <p>haa</p>}
    </>
  )
}

export default home