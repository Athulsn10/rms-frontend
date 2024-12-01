import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input"

function search() {
    return (
        <>
            <div className='flex items-center justify-center mt-4'>
                <div className='relative w-50'>
                    <Search className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500' />
                    <Input className='font-medium ' placeholder='Search Restaurants' />
                </div>
            </div>
            {/* search result */}
            <div className='flex justify-center align-middle h-100'>
                <p>Search results under developement</p>
            </div>
        </>
    )
}

export default search