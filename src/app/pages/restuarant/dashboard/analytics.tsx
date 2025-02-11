import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { LineChart, Line } from 'recharts';
import { ArrowUpIcon } from 'lucide-react';
import { getMenuInsights } from "./restuarantService";
import { useEffect } from "react";

function analytics() {
    const topSellingItems = [
        { name: 'Margherita Pizza', sales: 150 },
        { name: 'Chicken Wings', sales: 120 },
        { name: 'Caesar Salad', sales: 90 },
        { name: 'Cheeseburger', sales: 85 },
        { name: 'Pasta Carbonara', sales: 80 }
    ];
    
    const dailySales = [
        { date: 'Mon', sales: 45 },
        { date: 'Tue', sales: 52 },
        { date: 'Wed', sales: 58 },
        { date: 'Thu', sales: 75 },
        { date: 'Fri', sales: 92 },
        { date: 'Sat', sales: 110 },
        { date: 'Sun', sales: 85 }
    ];
    
    const peakHours = [
        { time: '8-10', orders: 25 },
        { time: '10-12', orders: 40 },
        { time: '12-14', orders: 85 },
        { time: '14-16', orders: 45 },
        { time: '16-18', orders: 55 },
        { time: '18-20', orders: 95 },
        { time: '20-22', orders: 65 }
    ];

    const getMenuAnalytics = async() => {
        const response = await getMenuInsights();
        if (response) {
            console.log('response from ai:', response);
        }
    };

    useEffect(() => {
        getMenuAnalytics();
    },[]);

    return (
        <div className="p-6 space-y-6 bg-orange-50 h-full flex flex-col justify-center">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Summary Cards */}
                <Card className="border-none hover:shadow-md transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-orange-900">Total Orders Today</CardTitle>
                        <div className="flex items-center space-x-1 bg-orange-100 rounded-full px-2 py-1">
                            <ArrowUpIcon className="h-4 w-4 text-orange-600" />
                            <span className="text-xs text-orange-600">12%</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-orange-800">245</div>
                        <p className="text-xs text-orange-600">+12% from yesterday</p>
                    </CardContent>
                </Card>

                <Card className="border-none hover:shadow-md transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-orange-900">Average Order Value</CardTitle>
                        <div className="flex items-center space-x-1 bg-orange-100 rounded-full px-2 py-1">
                            <ArrowUpIcon className="h-4 w-4 text-orange-600" />
                            <span className="text-xs text-orange-600">5%</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-orange-800">₹32.50</div>
                        <p className="text-xs text-orange-600">+5% from last week</p>
                    </CardContent>
                </Card>

                <Card className="border-none  hover:shadow-md transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-orange-900">Total Revenue</CardTitle>
                        <div className="flex items-center space-x-1 bg-orange-100 rounded-full px-2 py-1">
                            <ArrowUpIcon className="h-4 w-4 text-orange-600" />
                            <span className="text-xs text-orange-600">18%</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-orange-800">₹7,962</div>
                        <p className="text-xs text-orange-600">+18% from last month</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Top Selling Items */}
                <Card className="col-span-1 border-none ">
                    <CardHeader>
                        <CardTitle className="text-orange-900">Top Selling Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={topSellingItems} layout="vertical">
                                    <XAxis type="number" />
                                    <YAxis dataKey="name" type="category" width={100} />
                                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none' }} />
                                    <Bar dataKey="sales" fill="#f97316" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Daily Sales Trend */}
                <Card className="col-span-1 border-none ">
                    <CardHeader>
                        <CardTitle className="text-orange-900">Daily Sales Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={dailySales}>
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none' }} />
                                    <Line 
                                        type="monotone" 
                                        dataKey="sales" 
                                        stroke="#ea580c" 
                                        strokeWidth={2}
                                        dot={{ fill: '#ea580c', stroke: '#ea580c' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Peak Hours */}
                <Card className="col-span-1 border-none ">
                    <CardHeader>
                        <CardTitle className="text-orange-900">Peak Hours</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={peakHours}>
                                    <XAxis dataKey="time" />
                                    <YAxis />
                                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: 'none' }} />
                                    <Bar dataKey="orders" fill="#fb923c" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default analytics;