const EmptyPlaceholder = ({ title }) => {
    return (
        <div className="flex items-center justify-center h-full">
            <h1 className="text-2xl text-gray-400">{title} (Empty for now)</h1>
        </div>
    );
};

export default EmptyPlaceholder;