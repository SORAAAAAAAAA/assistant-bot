import Sidebar from '@/components/Sidebar'
import ChatInterface from '@/features/chat/ChatInterface'

export default function AppLayout() {

    return (
        <div className='flex flex-row'>
            <Sidebar />
            <ChatInterface />
        </div>
    )
}