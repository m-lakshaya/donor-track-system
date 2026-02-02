import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div
                className="card w-full max-w-lg relative animate-fade-in"
                style={{ maxHeight: '90vh', overflowY: 'auto' }}
            >
                <div className="flex justify-between items-center mb-4 pb-2 border-b">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
                        <X size={24} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

export default Modal;
