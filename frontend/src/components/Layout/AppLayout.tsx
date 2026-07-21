import Sidebar from '@/components/Sidebar/Sidebar'
import ChatInterface from '@/features/chat/chatInterface'

export default function AppLayout() {

    return (
        <div className='flex flex-row'>
            <Sidebar />
            <ChatInterface />
        </div>
    )
}