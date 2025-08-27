import { useState } from "react";
import { ShoppingBag, Users, CreditCard, Package } from "lucide-react";
import SidebarLink from "../../components/admin/SidebarLink";
import StatCard from "../../components/admin/StatCard";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";

const data = [
	{ name: "Jan", sales: 4000 },
	{ name: "Feb", sales: 3000 },
	{ name: "Mar", sales: 5000 },
	{ name: "Apr", sales: 4780 },
	{ name: "May", sales: 5890 },
	{ name: "Jun", sales: 4390 },
	{ name: "Jul", sales: 6490 },
];

const AdminDashboard = () => {
	const [sidebarOpen, setSidebarOpen] = useState(true);

	return (
		<div className="flex min-h-screen bg-background">
			{/* Sidebar */}
			<div
				className={`bg-card border-r border-border transition-all duration-300 ${
					sidebarOpen ? "w-64" : "w-20"
				}`}
			>
				<div className="flex items-center justify-between p-4 border-b border-border">
					<h1
						className={`text-lg font-bold text-gradient ${
							!sidebarOpen && "hidden"
						}`}
					>
						Admin
					</h1>
					<button
						onClick={() => setSidebarOpen(!sidebarOpen)}
						className="text-muted-foreground hover:text-foreground"
					>
						☰
					</button>
				</div>
				<nav className="mt-4 space-y-1">
					<SidebarLink
						icon={ShoppingBag}
						label="Products"
						to="/admin/products"
						sidebarOpen={sidebarOpen}
					/>
					<SidebarLink
						icon={Users}
						label="Customers"
						to="/admin/customers"
						sidebarOpen={sidebarOpen}
					/>
					<SidebarLink
						icon={CreditCard}
						label="Payments"
						to="/admin/payments"
						sidebarOpen={sidebarOpen}
					/>
					<SidebarLink
						icon={Package}
						label="Orders"
						to="/admin/orders"
						sidebarOpen={sidebarOpen}
					/>
				</nav>
			</div>

			{/* Main Content */}
			<div className="flex-1 p-6">
				{/* Header */}
				<div className="mb-6">
					<h2 className="text-2xl font-bold">Dashboard Overview</h2>
					<p className="text-muted-foreground text-sm">Welcome back, Admin!</p>
				</div>

				{/* Stats */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
					<StatCard icon={ShoppingBag} title="Total Products" value="120" />
					<StatCard icon={Users} title="Customers" value="1,024" />
					<StatCard icon={CreditCard} title="Revenue" value="₦2.5M" />
					<StatCard icon={Package} title="Orders" value="3,456" />
				</div>

				{/* Chart */}
				<div className="p-6 bg-card rounded-xl shadow-card">
					<h3 className="text-lg font-semibold mb-4">Monthly Sales</h3>
					<ResponsiveContainer width="100%" height={300}>
						<LineChart data={data}>
							<CartesianGrid strokeDasharray="3 3" stroke="#eee" />
							<XAxis dataKey="name" />
							<YAxis />
							<Tooltip />
							<Line
								type="monotone"
								dataKey="sales"
								stroke="hsl(var(--primary))"
								strokeWidth={3}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;
