import Sidebar from '@/components/Sidebar'
import UIApp from '@/features/chat/chatv2/uichat'
import ChatInterface from '@/features/chat/chatInterface'

export default function AppLayout() {

    return (
        <div className='flex flex-row'>
            <Sidebar />
            <UIApp />
        </div>
    )
}