
import { SocialMetricCard } from "../components/dashboard/SocialMetricCard";
import { MetricProgressCard } from "../components/dashboard/MetricProgressCard";
import { EngagementCard } from "../components/dashboard/EngagementCard";
import { AnalyticsChart } from "../components/dashboard/AnalyticsChart";

import { Bell, Search, MoreHorizontal, Users, Eye, Heart, MessageCircle } from "lucide-react";
import './Analytics.css';
// Custom LinkedIn icon - simplified version for better performance
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
    <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/>
  </svg>
);

const Analytics = () => {
  return (
    <div className="min-h-screen bg-background flex">
      
      
      <div className="flex-1 flex flex-col">
        {/* Header section */}
        <header className="bg-white border-b border-border px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-foreground">LinkedIn Analytics</h1>
              {/* Time range selector */}
              <select className="text-sm text-muted-foreground bg-transparent border border-border rounded-lg px-3 py-1">
                <option>LAST 15 DAYS</option>
                <option>LAST 30 DAYS</option>
                <option>LAST 90 DAYS</option>
              </select>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-lg hover:bg-secondary transition-colors relative">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-metric-error rounded-full text-xs text-white flex items-center justify-center">
                  2
                </span>
              </button>
              <span className="text-sm font-medium text-metric-error">2 NEW UPDATES</span>
              <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
                <Search className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </header>

        {/* Main dashboard content */}
        <main className="flex-1 p-8">
          <div className="grid grid-cols-12 gap-6">
            {/* Main metrics section */}
            <div className="col-span-12 lg:col-span-8">
              {/* LinkedIn stats cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                <SocialMetricCard
                  platform="Connections"
                  followers="3.2k"
                  icon={Users}
                  color="bg-blue-600"
                  growth="+15%"
                  label="Connections"
                />
                <SocialMetricCard
                  platform="Profile Views"
                  followers="8.6k"
                  icon={Eye}
                  color="bg-blue-600"
                  growth="+23%"
                  label="Views"
                />
                <SocialMetricCard
                  platform="Post Reactions"
                  followers="1.4k"
                  icon={Heart}
                  color="bg-blue-600"
                  growth="+18%"
                  label="Reactions"
                />
                <SocialMetricCard
                  platform="Comments"
                  followers="842"
                  icon={MessageCircle}
                  color="bg-blue-600"
                  growth="+12%"
                  label="Comments"
                />
              </div>

              {/* Chart section */}
              <div className="mb-8">
                <AnalyticsChart />
              </div>

              {/* Performance metrics and engagement */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-md border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-6">LinkedIn Performance</h3>
                  <div className="space-y-1">
                    <MetricProgressCard
                      label="Post Reach"
                      value={15000}
                      maxValue={20000}
                      color="bg-blue-600"
                    />
                    <MetricProgressCard
                      label="Engagement Rate"
                      value={850}
                      maxValue={1000}
                      color="bg-metric-success"
                    />
                    <MetricProgressCard
                      label="Connection Requests"
                      value={240}
                      maxValue={300}
                      color="bg-blue-600"
                    />
                    <MetricProgressCard
                      label="Profile Searches"
                      value={1200}
                      maxValue={1500}
                      color="bg-metric-info"
                    />
                  </div>
                </div>

                {/* Engagement overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <EngagementCard
                    title="Content Engagement"
                    value="4.8k"
                    trend={24}
                    color="purple"
                  />
                  <EngagementCard
                    title="Network Growth"
                    value="2.1k"
                    trend={15}
                    color="orange"
                  />
                </div>
              </div>
            </div>

            {/* Sidebar content */}
            <div className="col-span-12 lg:col-span-4">
              <div className="space-y-6">
                

                {/* Recent LinkedIn activity */}
                <div className="bg-white rounded-2xl p-6 shadow-md border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4">LinkedIn Activity</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-medium">JD</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground">John Doe connected with you</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                      <button className="p-1 rounded-md hover:bg-secondary transition-colors">
                        <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-medium">SA</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground">Sarah Anderson liked your post</p>
                        <p className="text-xs text-muted-foreground">4 hours ago</p>
                      </div>
                      <button className="p-1 rounded-md hover:bg-secondary transition-colors">
                        <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-medium">MJ</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground">Mike Johnson viewed your profile</p>
                        <p className="text-xs text-muted-foreground">6 hours ago</p>
                      </div>
                      <button className="p-1 rounded-md hover:bg-secondary transition-colors">
                        <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Analytics;
