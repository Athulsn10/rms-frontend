import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";


function profile() {
    const navigate = useNavigate();

    const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        localStorage.clear();
        navigate('/');
    };

    return (
        <div>
            <Button onClick={handleLogout}>LOG OUT</Button>
        </div>
    )
}

export default profile