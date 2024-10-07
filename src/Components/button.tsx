import { useState } from "react"

interface ButtonProps {
    title: string,
    onClick: (e:any) => void,
}

export default function Button({ title, onClick }: ButtonProps) {
    return (
        <>
            <button type="submit" onClick={onClick} className="btn w-100 login-button p-2">{title}</button>
        </>
    )
}