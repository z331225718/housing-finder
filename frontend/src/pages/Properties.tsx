import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { propertyApi } from '../api/client'
import MediaGallery from '../components/MediaGallery'
import ImportModal from '../components/ImportModal'
import type { Property } from '../types'

const DISTRICTS = ['全部', '黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '虹口区', '杨浦区', '闵行区', '宝山区', '嘉定区', '浦东新区', '金山区', '松江区', '青浦区', '奉贤区', '崇明区']
const LAYOUTS = ['全部', '1室', '2室', '3室', '4室', '5室及以上', '别墅']

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [district, setDistrict] = useState('')
  const [layout, setLayout] = useState('')
  const [showImport, setShowImport] = useState(false)

  useEffect(() => {
    fetchProperties()
  }, [district, layout])

  const fetchProperties = async () => {
    setLoading(true)
    try {
      const params: { district?: string; layout?: string } = {}
      if (district && district !== '全部') {
        params.district = district
      }
      if (layout && layout !== '全部') {
        params.layout = layout
      }
      const response = await propertyApi.getAll(params)
      setProperties(response.data)
    } catch (error) {
      console.error('Failed to fetch properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除该房源吗？')) return
    try {
      await propertyApi.delete(id)
      fetchProperties()
    } catch (error) {
      console.error('Failed to delete property:', error)
      alert('删除失败')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">房源管理</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowImport(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            导入Excel
          </button>
          <Link
            to="/properties/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            添加房源
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
          <select
            value={layout}
            onChange={(e) => setLayout(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {LAYOUTS.map((l) => (
              <option key={l} value={l === '全部' ? '' : l}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">加载中...</div>
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
          暂无房源数据
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">照片</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">小区</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">户型</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">面积</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">总价</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">单价</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">租金</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">租售比</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {properties.map((property) => {
                  const photos = property.photos ? JSON.parse(property.photos) : []
                  const videos = property.videos ? JSON.parse(property.videos) : []
                  return (
                  <tr key={property.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      {photos.length > 0 ? (
                        <MediaGallery photos={photos} videos={videos} />
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {property.community?.name || '-'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {property.layout || '-'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {property.area ? `${property.area}平` : '-'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {property.price ? `${property.price}万` : '-'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {property.price_per_sqm ? `${property.price_per_sqm}元/平` : '-'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {property.rent ? `${property.rent}元/月` : '-'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {property.rent_ratio ? `${property.rent_ratio}%` : '-'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                      <Link
                        to={`/properties/${property.id}`}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        查看
                      </Link>
                      <button
                        onClick={() => handleDelete(property.id)}
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
        </div>
      )}

      <ImportModal
        isOpen={showImport}
        onClose={() => setShowImport(false)}
        type="property"
        onSuccess={() => fetchProperties()}
      />
    </div>
  )
}
