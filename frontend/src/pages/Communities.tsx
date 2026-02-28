import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { communityApi } from '../api/client'
import MediaGallery from '../components/MediaGallery'
import ImportModal from '../components/ImportModal'
import type { Community } from '../types'

const DISTRICTS = [
  '全部',
  '黄浦区',
  '徐汇区',
  '长宁区',
  '静安区',
  '普陀区',
  '虹口区',
  '杨浦区',
  '闵行区',
  '宝山区',
  '嘉定区',
  '浦东新区',
  '金山区',
  '松江区',
  '青浦区',
  '奉贤区',
  '崇明区',
]

export default function Communities() {
  const navigate = useNavigate()
  const [communities, setCommunities] = useState<Community[]>([])
  const [loading, setLoading] = useState(true)
  const [district, setDistrict] = useState('')
  const [search, setSearch] = useState('')
  const [showImport, setShowImport] = useState(false)

  useEffect(() => {
    fetchCommunities()
  }, [district, search])

  const fetchCommunities = async () => {
    setLoading(true)
    try {
      const params: { district?: string; search?: string } = {}
      if (district && district !== '全部') {
        params.district = district
      }
      if (search) {
        params.search = search
      }
      const response = await communityApi.getAll(params)
      setCommunities(response.data)
    } catch (error) {
      console.error('Failed to fetch communities:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除该小区吗？')) return
    try {
      await communityApi.delete(id)
      fetchCommunities()
    } catch (error) {
      console.error('Failed to delete community:', error)
      alert('删除失败')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">小区管理</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowImport(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            导入Excel
          </button>
          <Link
            to="/communities/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            添加小区
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {DISTRICTS.map((d) => (
              <option key={d} value={d === '全部' ? '' : d}>
                {d}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="搜索小区名称..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">加载中...</div>
        </div>
      ) : communities.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
          暂无小区数据
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  照片
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  所在区
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  小区名称
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  环境打分
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  对口小学
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  对口中学
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {communities.map((community) => {
                const photos = community.photos ? JSON.parse(community.photos) : []
                const videos = community.videos ? JSON.parse(community.videos) : []
                return (
                <tr key={community.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {photos.length > 0 ? (
                      <MediaGallery photos={photos} videos={videos} />
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {community.district || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                    {community.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {community.environment_score ? `${community.environment_score}/10` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {community.primary_school || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {community.middle_school || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button
                      onClick={() => navigate(`/communities/${community.id}`)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      查看
                    </button>
                    <button
                      onClick={() => handleDelete(community.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      )}

      <ImportModal
        isOpen={showImport}
        onClose={() => setShowImport(false)}
        type="community"
        onSuccess={() => fetchCommunities()}
      />
    </div>
  )
}
