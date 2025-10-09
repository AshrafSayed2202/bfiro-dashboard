import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const mockData = [
    { name: 'Jan', users: 400, sales: 240 },
    { name: 'Feb', users: 300, sales: 139 },
    // Add more mock data as needed
];

const DashboardHome = () => {
    return (
        <div>
            <h1 className="text-2xl mb-4">Site Statistics</h1>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={mockData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="users" fill="#8884d8" />
                    <Bar dataKey="sales" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DashboardHome;