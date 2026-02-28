import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { communityApi } from '../api/client'
import FileUploader from '../components/FileUploader'
import type { Community } from '../types'

const DISTRICTS = [
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

const initialFormData: Partial<Community> = {
  name: '',
  district: '',
  address: '',
  property_fee: '',
  parking: '',
  build_year: undefined,
  metro: '',
  primary_school: '',
  middle_school: '',
  environment_score: 5,
  photos: undefined,
  videos: undefined,
  notes: '',
}

export default function CommunityForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)
  const [formData, setFormData] = useState<Partial<Community>>(initialFormData)

  useEffect(() => {
    if (isEdit && id) {
      const fetchCommunity = async () => {
        try {
          const response = await communityApi.getById(Number(id))
          setFormData(response.data)
        } catch (error) {
          console.error('Failed to fetch community:', error)
          alert('获取数据失败')
          navigate('/communities')
        } finally {
          setFetching(false)
        }
      }
      fetchCommunity()
    }
  }, [id, isEdit, navigate])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'build_year' || name === 'environment_score' ? (value ? Number(value) : undefined) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isEdit && id) {
        await communityApi.update(Number(id), formData)
      } else {
        await communityApi.create(formData)
      }
      navigate('/communities')
    } catch (error) {
      console.error('Failed to save community:', error)
      alert('保存失败')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">加载中...</div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        {isEdit ? '编辑小区' : '添加小区'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              所属区 <span className="text-red-500">*</span>
            </label>
            <select
              name="district"
              value={formData.district || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">请选择</option>
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              小区名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">地址</label>
            <input
              type="text"
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">物业费</label>
            <input
              type="text"
              name="property_fee"
              value={formData.property_fee || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="如: 2.5元/平/月"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">停车位</label>
            <input
              type="text"
              name="parking"
              value={formData.parking || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="如: 地上50个, 地下100个"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">建成年份</label>
            <input
              type="number"
              name="build_year"
              value={formData.build_year || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="如: 2015"
              min="1900"
              max={new Date().getFullYear()}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">周边配套/地铁</label>
            <input
              type="text"
              name="metro"
              value={formData.metro || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="如: 地铁9号线, 商场"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">对口小学</label>
            <input
              type="text"
              name="primary_school"
              value={formData.primary_school || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">对口中学</label>
            <input
              type="text"
              name="middle_school"
              value={formData.middle_school || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              环境打分: {formData.environment_score || 5}/10
            </label>
            <input
              type="range"
              name="environment_score"
              value={formData.environment_score || 5}
              onChange={handleChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              min="1"
              max="10"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">照片</label>
            <FileUploader
              type="photo"
              value={formData.photos ? JSON.parse(formData.photos) : []}
              onChange={(files) => setFormData((prev) => ({ ...prev, photos: JSON.stringify(files) }))}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">视频</label>
            <FileUploader
              type="video"
              value={formData.videos ? JSON.parse(formData.videos) : []}
              onChange={(files) => setFormData((prev) => ({ ...prev, videos: JSON.stringify(files) }))}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
            <textarea
              name="notes"
              value={formData.notes || ''}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/communities')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? '保存中...' : '保存'}
          </button>
        </div>
      </form>
    </div>
  )
}
