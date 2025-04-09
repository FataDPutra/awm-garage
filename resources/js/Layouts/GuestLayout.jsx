// Layouts/GuestLayout.jsx
export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">{children}</div>
        </div>
    );
}
