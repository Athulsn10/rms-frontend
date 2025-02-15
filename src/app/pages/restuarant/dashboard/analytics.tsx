import { LineChart, Line } from 'recharts';
import { useEffect, useState } from "react";
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpIcon, IndianRupee, Loader2, TrendingUp, Utensils } from 'lucide-react';
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
    const [activePage, setActivePage] = useState('charts');
    const [chartsLoading, setChartsLoading] = useState(false);
    const [topSellingItems, setTopSellingItems] = useState([]);
    const [analyticsLoading, setAnalyticsLoading] = useState(false);
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

    const getMenuAnalytics = async() => {
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
            setChartsLoading(false);
        } else {
            setChartsLoading(false);
        }
    };

    useEffect(() => {
        setChartsLoading(true);
        setAnalyticsLoading(true);
        getMenuAnalytics();
        getMenuStatistics();
        getChartstData();
    },[]);

    const renderCharts = () => (
        <>
            {chartsLoading ? (
                <div className='flex items-center justify-center h-96 mt-28 text-orange-600'>
                    <Loader2 className="w-9 h-9 animate-spin" />
                </div>
            ) : (<div className='className="space-y-6 animate-in slide-in-from-left"'>
                <div className='className="p-6 space-y-6 bg-orange-50 h-full flex flex-col justify-center"'>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {dashboardData && (
                            <>
                                <Card className="border-none hover:shadow-md transition-shadow duration-300">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-orange-900">Total Orders Today</CardTitle>
                                        {dashboardData.orders.isPositiveChange ?
                                            (<div className="flex items-center space-x-1 bg-green-100 rounded-full px-2 py-1">
                                                <ArrowUpIcon className="h-4 w-4 text-green-600" />
                                                <span className="text-xs text-green-600">{dashboardData.orders.orderChangePercentage}%</span>
                                            </div>) : (<div className="flex items-center space-x-1 bg-red-100 rounded-full px-2 py-1">
                                                <ArrowDown className="h-4 w-4 text-red-600" />
                                                <span className="text-xs text-red-600">{dashboardData.orders.orderChangePercentage}%</span>
                                            </div>)
                                        }
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-orange-800">{dashboardData.orders.totalOrdersThisDay}</div>
                                        <p className="text-xs text-orange-600">Total orders yesterday {dashboardData.orders.totalOrdersPreviousDay}</p>
                                    </CardContent>
                                </Card>

                                <Card className="border-none hover:shadow-md transition-shadow duration-300">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-orange-900">Average Order Value</CardTitle>
                                        {dashboardData.orders.isPositiveChange ?
                                            (<div className="flex items-center space-x-1 bg-green-100 rounded-full px-2 py-1">
                                                <ArrowUpIcon className="h-4 w-4 text-green-600" />
                                                <span className="text-xs text-green-600">{dashboardData.orders.orderChangePercentage}%</span>
                                            </div>) : (<div className="flex items-center space-x-1 bg-red-100 rounded-full px-2 py-1">
                                                <ArrowDown className="h-4 w-4 text-red-600" />
                                                <span className="text-xs text-red-600">{dashboardData.orders.orderChangePercentage}%</span>
                                            </div>)
                                        }
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-orange-800 mt-2">₹{dashboardData.orders.averageOrderValue.toFixed(2)}</div>
                                    </CardContent>
                                </Card>

                                <Card className="border-none hover:shadow-md transition-shadow duration-300">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-orange-900">Total Revenue This Month</CardTitle>
                                        {dashboardData.revenue.isPositiveChange ?
                                            (<div className="flex items-center space-x-1 bg-green-100 rounded-full px-2 py-1">
                                                <ArrowUpIcon className="h-4 w-4 text-green-600" />
                                                <span className="text-xs text-green-600">{dashboardData.revenue.revenueChangePercentage}%</span>
                                            </div>) : (<div className="flex items-center space-x-1 bg-red-100 rounded-full px-2 py-1">
                                                <ArrowDown className="h-4 w-4 text-red-600" />
                                                <span className="text-xs text-red-600">{dashboardData.revenue.revenueChangePercentage}%</span>
                                            </div>)
                                        }
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-orange-800">₹{dashboardData.revenue.totalRevenueThisMonth}</div>
                                        <p className="text-xs text-orange-600">Total revenue last month ₹{dashboardData.revenue.totalRevenuePreviousMonth}</p>
                                    </CardContent>
                                </Card>
                            </>
                        )}
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
            </div>
            )}
        </>
    );

    const renderAnalytics = () => (
        <>
            {analyticsLoading ? (
                <div className='flex items-center justify-center h-96 mt-28 text-orange-600'>
                    <Loader2 className="w-9 h-9 animate-spin" />
                </div>
            ) : (
                <div className='className="space-y-6 animate-in slide-in-from-right"'>
                    {Object.keys(analytics).length > 0 && (<div className="w-full p-4 space-y-6">
                        {/* Price Distribution Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-none">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-600">Lowest Price</p>
                                            <h3 className="text-2xl font-bold text-slate-900">₹{analytics.menu_insights.price_distribution.lowest_price}</h3>
                                        </div>
                                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                                            <IndianRupee className="h-6 w-6 text-blue-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-none">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-600">Highest Price</p>
                                            <h3 className="text-2xl font-bold text-slate-900">₹{analytics.menu_insights.price_distribution.highest_price}</h3>
                                        </div>
                                        <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                                            <TrendingUp className="h-6 w-6 text-purple-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-none">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-600">Total Items</p>
                                            <h3 className="text-2xl font-bold text-slate-900">{analytics.trending_analysis.length}</h3>
                                        </div>
                                        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                                            <Utensils className="h-6 w-6 text-green-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Trending Analysis */}
                        <Card className='border-none'>
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                                    <LineChart className="h-5 w-5 text-slate-600" />
                                    Trending Analysis
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {analytics.trending_analysis.map((item, index) => (
                                        <Card key={index} className="bg-slate-50">
                                            <CardContent className="p-4">
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-start">
                                                        <h4 className="font-semibold text-lg">{item.item_name}</h4>
                                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                                            ₹{item.price_point}
                                                        </span>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div>
                                                            <p className="text-sm font-medium text-slate-600">Orders</p>
                                                            <p className="text-lg font-semibold">{item.order_quantity}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-slate-600">Popularity Factors</p>
                                                            <p className="text-sm text-slate-700">{item.popularity_factors}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-slate-600">Allergy Considerations</p>
                                                            <p className="text-sm text-slate-700">{item.allergy_considerations}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recommendations */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className='border-none'>
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold">Menu Optimization</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ScrollArea className="h-64">
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
                                    <CardTitle className="text-lg font-semibold">Pricing Suggestions</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ScrollArea className="h-64">
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
                    </div>)}
                </div>
            )}
        </>
    );

    return (
        <div className="p-6 space-y-6 bg-orange-50 min-h-screen">
        {/* Navigation */}
        <div className="flex justify-end space-x-4 mb-8">
            <div onClick={() => setActivePage('charts')} className="bg-orange-100 hover:bg-orange-200 p-2 rounded-full cursor-pointer">
                <ArrowLeft className={`w-7 h-7 ${activePage === 'charts' ? "text-gray-500 hover:text-black" : "text-black"}`} />
            </div>
            <div onClick={() => setActivePage('analytics')} className="bg-orange-100 hover:bg-orange-200 p-2 rounded-full cursor-pointer">
                <ArrowRight className={`w-7 h-7 ${activePage === 'analytics' ? "text-gray-500" : "text-black"}`} />
            </div>
        </div>
        {/* Content */}
        <div className="container mx-auto">
          {activePage === 'charts' ? renderCharts() : renderAnalytics()}
        </div>
         {/* Page Indicators */}
         <div className="flex justify-center space-x-2 mb-6">
          <div 
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              activePage === 'charts' ? 'bg-orange-600 scale-125' : 'bg-orange-300'
            }`}
          />
          <div 
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              activePage === 'analytics' ? 'bg-orange-600 scale-125' : 'bg-orange-300'
            }`}
          />
        </div>
      </div>
    );
}

export default analytics;