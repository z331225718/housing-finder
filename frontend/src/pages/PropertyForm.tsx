import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { propertyApi, communityApi } from '../api/client'
import FileUploader from '../components/FileUploader'
import type { Community } from '../types'

export default function PropertyForm() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)

  const [communities, setCommunities] = useState<Community[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(isEdit)

  const [formData, setFormData] = useState({
    community_id: '',
    building: '',
    unit: '',
    room: '',
    area: '',
    layout: '',
    floor: '',
    orientation: '',
    decoration: '',
    price: '',
    rent: '',
    expected_price: '',
    visit_date: '',
    photos: '',
    videos: '',
    notes: '',
  })

  useEffect(() => {
    fetchCommunities()
    if (isEdit && id) {
      fetchProperty(parseInt(id))
    }
  }, [id])

  const fetchCommunities = async () => {
    try {
      const response = await communityApi.getAll()
      setCommunities(response.data)
    } catch (error) {
      console.error('Failed to fetch communities:', error)
    }
  }

  const fetchProperty = async (propertyId: number) => {
    try {
      const response = await propertyApi.getById(propertyId)
      const property = response.data
      setFormData({
        community_id: String(property.community_id),
        building: property.building || '',
        unit: property.unit || '',
        room: property.room || '',
        area: property.area ? String(property.area) : '',
        layout: property.layout || '',
        floor: property.floor || '',
        orientation: property.orientation || '',
        decoration: property.decoration || '',
        price: property.price ? String(property.price) : '',
        rent: property.rent ? String(property.rent) : '',
        expected_price: property.expected_price ? String(property.expected_price) : '',
        visit_date: property.visit_date ? property.visit_date.split('T')[0] : '',
        photos: property.photos || '',
        videos: property.videos || '',
        notes: property.notes || '',
      })
    } catch (error) {
      console.error('Failed to fetch property:', error)
      alert('获取房源信息失败')
      navigate('/properties')
    } finally {
      setInitialLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = {
        community_id: parseInt(formData.community_id),
        building: formData.building || undefined,
        unit: formData.unit || undefined,
        room: formData.room || undefined,
        area: formData.area ? parseFloat(formData.area) : undefined,
        layout: formData.layout || undefined,
        floor: formData.floor || undefined,
        orientation: formData.orientation || undefined,
        decoration: formData.decoration || undefined,
        price: formData.price ? parseFloat(formData.price) : undefined,
        rent: formData.rent ? parseFloat(formData.rent) : undefined,
        expected_price: formData.expected_price ? parseFloat(formData.expected_price) : undefined,
        visit_date: formData.visit_date || undefined,
        photos: formData.photos || undefined,
        videos: formData.videos || undefined,
        notes: formData.notes || undefined,
      }

      if (isEdit && id) {
        await propertyApi.update(parseInt(id), data)
      } else {
        await propertyApi.create(data)
      }
      navigate('/properties')
    } catch (error) {
      console.error('Failed to save property:', error)
      alert('保存失败')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">加载中...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          {isEdit ? '编辑房源' : '添加房源'}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                小区 <span className="text-red-500">*</span>
              </label>
              <select
                name="community_id"
                value={formData.community_id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">请选择小区</option>
                {communities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">户型</label>
              <select
                name="layout"
                value={formData.layout}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">请选择户型</option>
                <option value="1室">1室</option>
                <option value="2室">2室</option>
                <option value="3室">3室</option>
                <option value="4室">4室</option>
                <option value="5室及以上">5室及以上</option>
                <option value="别墅">别墅</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">面积 (平米)</label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleChange}
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">总价 (万)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">租金 (元/月)</label>
              <input
                type="number"
                name="rent"
                value={formData.rent}
                onChange={handleChange}
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">预期价格 (万)</label>
              <input
                type="number"
                name="expected_price"
                value={formData.expected_price}
                onChange={handleChange}
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">楼栋</label>
              <input
                type="text"
                name="building"
                value={formData.building}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">单元</label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">房号</label>
              <input
                type="text"
                name="room"
                value={formData.room}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">楼层</label>
              <input
                type="text"
                name="floor"
                value={formData.floor}
                onChange={handleChange}
                placeholder="如: 10/20"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">朝向</label>
              <select
                name="orientation"
                value={formData.orientation}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">请选择朝向</option>
                <option value="东">东</option>
                <option value="南">南</option>
                <option value="西">西</option>
                <option value="北">北</option>
                <option value="东南">东南</option>
                <option value="东北">东北</option>
                <option value="西南">西南</option>
                <option value="西北">西北</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">装修</label>
              <select
                name="decoration"
                value={formData.decoration}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">请选择装修</option>
                <option value="毛坯">毛坯</option>
                <option value="简装">简装</option>
                <option value="精装">精装</option>
                <option value="豪华装修">豪华装修</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">看房日期</label>
              <input
                type="date"
                name="visit_date"
                value={formData.visit_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">照片</label>
              <FileUploader
                type="photo"
                value={formData.photos ? JSON.parse(formData.photos) : []}
                onChange={(files) => setFormData((prev) => ({ ...prev, photos: JSON.stringify(files) }))}
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">视频</label>
              <FileUploader
                type="video"
                value={formData.videos ? JSON.parse(formData.videos) : []}
                onChange={(files) => setFormData((prev) => ({ ...prev, videos: JSON.stringify(files) }))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/properties')}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
