import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { dashboardApi } from '../api/client'
import type { DashboardStats, Property } from '../types'

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentVisits, setRecentVisits] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, visitsRes] = await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getRecentVisits(),
        ])
        setStats(statsRes.data)
        setRecentVisits(visitsRes.data)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#6b6560]">加载中...</div>
      </div>
    )
  }

  const statCards = [
    {
      label: '房源总数',
      value: stats?.total_properties || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      color: 'bg-[#c4704a]/10 text-[#c4704a]',
      borderColor: 'border-l-[#c4704a]',
    },
    {
      label: '小区总数',
      value: stats?.total_communities || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: 'bg-[#7d9a78]/10 text-[#7d9a78]',
      borderColor: 'border-l-[#7d9a78]',
    },
    {
      label: '平均价格',
      value: stats?.average_price ? `${(stats.average_price / 10000).toFixed(1)}万` : '—',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-[#d4a04a]/10 text-[#d4a04a]',
      borderColor: 'border-l-[#d4a04a]',
    },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-semibold text-[#2d2a26] mb-2">仪表盘</h1>
        <p className="text-[#6b6560]">查看房源统计数据和最近看房记录</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {statCards.map((card, index) => (
          <div
            key={card.label}
            className={`card p-6 border-l-4 ${card.borderColor} animate-slide-up stagger-${index + 1}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6b6560]">{card.label}</p>
                <p className="text-3xl font-semibold text-[#2d2a26] mt-1">{card.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${card.color}`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions & Recent Visits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="card p-6 animate-slide-up stagger-4">
          <h2 className="text-lg font-semibold text-[#2d2a26] mb-5">快捷操作</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/communities/new"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#c4704a] text-white hover:bg-[#a85d3a] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>添加小区</span>
            </Link>
            <Link
              to="/properties/new"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#7d9a78] text-white hover:bg-[#6a8666] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>添加房源</span>
            </Link>
            <Link
              to="/communities"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-[#e5e2de] text-[#6b6560] hover:bg-[#f8f6f3] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>小区列表</span>
            </Link>
            <Link
              to="/properties"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-[#e5e2de] text-[#6b6560] hover:bg-[#f8f6f3] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>房源列表</span>
            </Link>
          </div>
        </div>

        {/* Recent Visits */}
        <div className="card p-6 animate-slide-up stagger-5">
          <h2 className="text-lg font-semibold text-[#2d2a26] mb-5">最近看房记录</h2>
          {recentVisits.length > 0 ? (
            <div className="space-y-3">
              {recentVisits.slice(0, 5).map((property) => (
                <Link
                  key={property.id}
                  to={`/properties/${property.id}`}
                  className="block p-4 rounded-lg border border-[#e5e2de] hover:border-[#c4704a]/30 hover:bg-[#f8f6f3] transition-all group"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-[#2d2a26] group-hover:text-[#c4704a] transition-colors">
                        {property.community?.name || '未知小区'}
                      </p>
                      <p className="text-sm text-[#6b6560] mt-0.5">
                        {property.layout || '—'} · {property.area || '—'}㎡
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#c4704a]">
                        {property.price ? `${property.price}万` : '—'}
                      </p>
                      <p className="text-xs text-[#9a948d] mt-0.5">
                        {property.visit_date
                          ? new Date(property.visit_date).toLocaleDateString('zh-CN')
                          : '—'}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-[#f0eeeb] flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-[#9a948d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <p className="text-[#9a948d]">暂无看房记录</p>
              <Link
                to="/properties/new"
                className="text-sm text-[#c4704a] hover:text-[#a85d3a] mt-2 inline-block"
              >
                添加第一个房源 →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
