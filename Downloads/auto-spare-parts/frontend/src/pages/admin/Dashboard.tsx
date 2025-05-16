
import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Users, BarChart, TrendingUp, ShoppingCart, Clock, Calendar, DollarSign } from 'lucide-react';

const Dashboard = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <header className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
          <h1 className="text-3xl font-bold">Welcome to Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Here's an overview of your store performance</p>
        </header>
        
        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$1,245</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-green-500 font-medium">18%</span> increase today
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Orders</CardTitle>
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <ShoppingCart className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                <Clock className="h-3 w-3 text-amber-500 mr-1" />
                <span>4 orders</span> waiting to be processed
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$24,345</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-green-500 font-medium">12%</span> from last month
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-orange-500 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                <Package className="h-4 w-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-amber-500 font-medium">5</span> products low in stock
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders and Activity */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <ShoppingCart className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Order #{1000 + i}</p>
                        <p className="text-xs text-muted-foreground">2 items • $199.99</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                      Processing
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-4">
                {[
                  { icon: Users, text: "New customer registration", time: "2 minutes ago" },
                  { icon: Package, text: "Product stock updated", time: "1 hour ago" },
                  { icon: DollarSign, text: "New sale processed", time: "3 hours ago" },
                  { icon: ShoppingCart, text: "Order #1234 shipped", time: "5 hours ago" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                      {React.createElement(activity.icon, { 
                        className: "h-5 w-5 text-primary",
                        "aria-hidden": "true"
                      })}
                    </div>
                    <div className="flex-1 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">{activity.text}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="p-6 border rounded-lg hover:bg-muted/50 transition-colors text-center space-y-2">
                <Package className="h-6 w-6 mx-auto" />
                <span className="text-sm font-medium block">Add Product</span>
              </button>
              <button className="p-6 border rounded-lg hover:bg-muted/50 transition-colors text-center space-y-2">
                <Users className="h-6 w-6 mx-auto" />
                <span className="text-sm font-medium block">View Customers</span>
              </button>
              <button className="p-6 border rounded-lg hover:bg-muted/50 transition-colors text-center space-y-2">
                <ShoppingCart className="h-6 w-6 mx-auto" />
                <span className="text-sm font-medium block">Process Orders</span>
              </button>
              <button className="p-6 border rounded-lg hover:bg-muted/50 transition-colors text-center space-y-2">
                <BarChart className="h-6 w-6 mx-auto" />
                <span className="text-sm font-medium block">View Reports</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
