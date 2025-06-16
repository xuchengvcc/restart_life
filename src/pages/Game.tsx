export function Game() {
  return (
    <div className="text-white">
      <h1 className="text-4xl font-bold mb-8 text-center">开始你的人生</h1>
      
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
          <h2 className="text-2xl font-semibold mb-6">选择你的出生设定</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">出生国家</label>
              <select className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white">
                <option value="china">中国</option>
                <option value="usa">美国</option>
                <option value="japan">日本</option>
                <option value="uk">英国</option>
                <option value="france">法国</option>
                <option value="random">随机选择</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">出生年份</label>
              <input
                type="range"
                min="1800"
                max="2050"
                defaultValue="1950"
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-400 mt-1">
                <span>1800</span>
                <span>1950</span>
                <span>2050</span>
              </div>
            </div>
            
            <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105">
              开始人生
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 