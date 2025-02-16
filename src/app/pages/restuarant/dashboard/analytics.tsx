import { LineChart, Line } from 'recharts';
import { useEffect, useState } from "react";
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowDown, ArrowUpIcon, IndianRupee, Loader2, TrendingUp, Utensils } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getChartData, getMenuInsights, getStatistics } from "./restuarantService";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface TrendingAnalysisItem {
    item_name: string;
    order_quantity: number;
    price_point: string;
    popularity_factors: string;
    allergy_considerations: string;
};

interface PriceDistribution {
    lowest_price: number;
    highest_price: number;
    price_spread_analysis: string;
};

interface MenuInsights {
    price_distribution: PriceDistribution;
};
interface Recommendations {
    menu_optimization: string[];
    pricing_suggestions: string[];
};
interface Analytics {
    trending_analysis: TrendingAnalysisItem[];
    menu_insights: MenuInsights;
    recommendations: Recommendations;
};
interface Revenue {
    totalRevenueThisMonth: number;
    totalRevenuePreviousMonth: number;
    revenueChangePercentage: number;
    isPositiveChange: boolean;
};

interface Customers {
    totalCustomers: number;
    totalCustomersThisMonth: number;
    totalCustomersPreviousMonth: number;
    customerChangePercentage: number;
    isPositiveChange: boolean;
};

interface Orders {
    totalOrders: number;
    totalOrdersThisDay: number;
    totalOrdersPreviousDay: number;
    orderChangePercentage: number;
    isPositiveChange: boolean;
    averageOrderValue: number;
};

interface DashboardData {
    revenue: Revenue;
    customers: Customers;
    orders: Orders;
};

function analytics() {
    const [analytics, setAnalytics] = useState<Analytics>({
        trending_analysis: [],
        menu_insights: {
            price_distribution: {
                lowest_price: 0,
                highest_price: 0,
                price_spread_analysis: "",
            },
        },
        recommendations: {
            menu_optimization: [],
            pricing_suggestions: [],
        },
    });

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            try {
                const response = await fetch('API_ENDPOINT_HERE');
                const data: Analytics = await response.json();
                setAnalytics(data);
            } catch (error) {
                console.error('Error fetching analytics data:', error);
            }
        };

        fetchAnalyticsData();
    }, []);

    const [peakHours, setPeakHours] = useState([]);
    const [dailySales, setDailySales] = useState([]);
    const [topSellingItems, setTopSellingItems] = useState([]);
    const [analyticsLoading, setAnalyticsLoading] = useState(false);
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

    const getMenuAnalytics = async () => {
        const response = await getMenuInsights();
        if (response) {
            setAnalytics(response);
            setAnalyticsLoading(false);
        } else {
            setAnalyticsLoading(false);
        }
    };

    const getMenuStatistics = async () => {
        const response = await getStatistics();
        if (response) {
            setDashboardData(response);
        }
    };

    const getChartstData = async () => {
        const response = await getChartData();
        if (response) {
            setPeakHours(response.peakHours);
            setDailySales(response.dailySales);
            setTopSellingItems(response.topSellingItems);
        }
    };

    useEffect(() => {
        setAnalyticsLoading(true);
        getMenuAnalytics();
        getMenuStatistics();
        getChartstData();
    }, []);

    return (
        <>
            {analyticsLoading ? (
                <div className='flex items-center justify-center h-full text-orange-600'>
                <Loader2 className="w-9 h-9 animate-spin" />
            </div>
            ) : (<div className="p-4 bg-orange-50 h-100">
                <div className="grid gap-3 md:grid-cols-3 mb-3">
                    {dashboardData && (
                        <>
                            <Card className="border-none">
                                <CardHeader className="p-2">
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-xs font-medium text-orange-900">Total Orders Today</CardTitle>
                                        {dashboardData.orders.isPositiveChange ? (
                                            <div className="flex items-center space-x-1 bg-green-100 rounded-full px-2 py-0.5">
                                                <ArrowUpIcon className="h-3 w-3 text-green-600" />
                                                <span className="text-xs text-green-600">{dashboardData.orders.orderChangePercentage}%</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center space-x-1 bg-red-100 rounded-full px-2 py-0.5">
                                                <ArrowDown className="h-3 w-3 text-red-600" />
                                                <span className="text-xs text-red-600">{dashboardData.orders.orderChangePercentage}%</span>
                                            </div>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="p-2">
                                    <div className="text-2xl font-bold text-orange-800">{dashboardData.orders.totalOrdersThisDay}</div>
                                    <p className="text-xs text-orange-600">Total Orders Yesterday: {dashboardData.orders.totalOrdersPreviousDay}</p>
                                </CardContent>
                            </Card>
                            <Card className="border-none">
                                <CardHeader className="p-2">
                                    <div className='flex justify-between items-center'>
                                        <CardTitle className="text-xs font-medium text-orange-900">Average Order Value</CardTitle>
                                        {dashboardData.orders.isPositiveChange ?
                                            (<div className="flex items-center space-x-1 bg-green-100 rounded-full px-2 py-1">
                                                <ArrowUpIcon className="h-4 w-4 text-green-600" />
                                                <span className="text-xs text-green-600">{dashboardData.orders.orderChangePercentage}%</span>
                                            </div>) : (<div className="flex items-center space-x-1 bg-red-100 rounded-full px-2 py-1">
                                                <ArrowDown className="h-4 w-4 text-red-600" />
                                                <span className="text-xs text-red-600">{dashboardData.orders.orderChangePercentage}%</span>
                                            </div>)
                                        }
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-orange-800 mt-2">₹{dashboardData.orders.averageOrderValue.toFixed(2)}</div>
                                </CardContent>
                            </Card>
                            <Card className="border-none">
                                <CardHeader className="p-2">
                                    <div className='flex justify-between items-center'>
                                        <CardTitle className="text-xs font-medium text-orange-900">Total Revenue This Month</CardTitle>
                                        {dashboardData.revenue.isPositiveChange ?
                                            (<div className="flex items-center space-x-1 bg-green-100 rounded-full px-2 py-1">
                                                <ArrowUpIcon className="h-4 w-4 text-green-600" />
                                                <span className="text-xs text-green-600">{dashboardData.revenue.revenueChangePercentage}%</span>
                                            </div>) : (<div className="flex items-center space-x-1 bg-red-100 rounded-full px-2 py-1">
                                                <ArrowDown className="h-4 w-4 text-red-600" />
                                                <span className="text-xs text-red-600">{dashboardData.revenue.revenueChangePercentage}%</span>
                                            </div>)
                                        }
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-orange-800">₹{dashboardData.revenue.totalRevenueThisMonth}</div>
                                    <p className="text-xs text-orange-600">Total Revenue Last Month ₹{dashboardData.revenue.totalRevenuePreviousMonth}</p>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>

                {/* Charts Row - Reduced height */}
                <div className="grid gap-3 md:grid-cols-3 mb-3">
                    <Card className="border-none">
                        <CardHeader className="p-2">
                            <CardTitle className="text-xs text-orange-900">Top Selling Items</CardTitle>
                        </CardHeader>
                        <CardContent className="p-2">
                            <div className="h-[150px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={topSellingItems} layout="vertical">
                                        <XAxis type="number" />
                                        <YAxis dataKey="name" type="category" width={80} />
                                        <Tooltip />
                                        <Bar dataKey="sales" fill="#f97316" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="col-span-1 border-none ">
                        <CardHeader className="p-2">
                            <CardTitle className="text-xs text-orange-900">Daily Sales Trend</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[150px]">
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
                        <CardHeader className="p-2">
                            <CardTitle className="text-xs text-orange-900">Peak Hours</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[150px]">
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

                {/* Analytics Section - Compact layout */}
                {Object.keys(analytics).length > 0 && (
                    <div className="grid grid-cols-4 gap-3">
                        {/* Price Distribution Cards - Single row */}
                        <div className="grid grid-cols-1 gap-2">
                            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-none">
                                <CardContent className="p-2">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-slate-600">Lowest Price</p>
                                            <h3 className="text-lg font-bold text-slate-900">₹{analytics.menu_insights.price_distribution.lowest_price}</h3>
                                        </div>
                                        <IndianRupee className="h-4 w-4 text-blue-600" />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-none">
                                <CardContent className="p-2">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-medium text-slate-600">Highest Price</p>
                                            <h3 className="text-lg font-bold text-slate-900">₹{analytics.menu_insights.price_distribution.highest_price}</h3>
                                        </div>
                                        <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                                            <TrendingUp className="h-6 w-6 text-purple-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-none">
                                <CardContent className="p-2">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-medium text-slate-600">Total Items</p>
                                            <h3 className="text-lg font-bold text-slate-900">{analytics.trending_analysis.length}</h3>
                                        </div>
                                        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                                            <Utensils className="h-6 w-6 text-green-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Trending Analysis - Compact grid */}
                        <Card className="border-none">
                            <CardHeader>
                                <CardTitle className="text-sm flex items-center gap-1">
                                    <LineChart className="h-4 w-4 text-slate-600" />
                                    Trending Analysis
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-2">
                               <ScrollArea className='h-48'>
                                    <div className="grid grid-cols-2 gap-2 h-[200px]">
                                        {analytics.trending_analysis.map((item, index) => (
                                                <Card key={index} className="bg-slate-50">
                                                    <CardContent className="p-2">
                                                        <div className="space-y-1">
                                                            <div className="flex justify-between items-start">
                                                                <h4 className="font-semibold text-sm">{item.item_name}</h4>
                                                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                                                                    ₹{item.price_point}
                                                                </span>
                                                            </div>
                                                            <div className="space-y-1 text-xs">
                                                                <p className="text-slate-600">Orders: {item.order_quantity}</p>
                                                                <p className="text-slate-600">{item.popularity_factors}</p>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                        ))}
                                    </div>
                               </ScrollArea>
                            </CardContent>
                        </Card>

                        <Card className='border-none'>
                            <CardHeader>
                                <CardTitle className="text-sm flex items-center gap-1">Menu Optimization</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-48">
                                    <ul className="space-y-3">
                                        {analytics.recommendations.menu_optimization.map((recommendation, index) => (
                                            <li key={index} className="flex gap-3 items-start">
                                                <span className="h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-sm flex-shrink-0">
                                                    {index + 1}
                                                </span>
                                                <p className="text-sm text-slate-700">{recommendation}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </ScrollArea>
                            </CardContent>
                        </Card>

                        <Card className='border-none'>
                            <CardHeader>
                                <CardTitle className="text-sm flex items-center gap-1">Pricing Suggestions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-44">
                                    <ul className="space-y-3">
                                        {analytics.recommendations.pricing_suggestions.map((suggestion, index) => (
                                            <li key={index} className="flex gap-3 items-start">
                                                <span className="h-6 w-6 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 text-sm flex-shrink-0">
                                                    {index + 1}
                                                </span>
                                                <p className="text-sm text-slate-700">{suggestion}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>)}
        </>
    );
}

export default analytics;