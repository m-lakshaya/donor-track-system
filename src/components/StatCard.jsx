const StatCard = ({ title, value, icon: Icon, color }) => {
    return (
        <div className="card flex items-center gap-4">
            <div
                style={{
                    backgroundColor: color + '20', // 20% opacity
                    padding: '1rem',
                    borderRadius: '50%',
                    color: color
                }}
            >
                <Icon size={24} />
            </div>
            <div>
                <p className="text-sm text-gray">{title}</p>
                <p className="text-2xl font-bold">{value}</p>
            </div>
        </div>
    );
};

export default StatCard;
