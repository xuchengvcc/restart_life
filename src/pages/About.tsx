export function About() {
  return (
    <div className="text-white max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">关于《重启人生》</h1>
      
      <div className="space-y-8">
        <section className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
          <h2 className="text-2xl font-semibold mb-4">游戏简介</h2>
          <p className="text-gray-300 leading-relaxed">
            《重启人生》是一款文字模拟人生游戏，玩家可以随机重新开启自己的人生。
            你可以选择出生国家、年代，体验从1800年到2050年不同历史时期的人生历程。
            游戏结合历史事件来影响玩家的人生走向，让每次游戏都有独特的体验。
          </p>
        </section>

        <section className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
          <h2 className="text-2xl font-semibold mb-4">核心特色</h2>
          <ul className="space-y-3 text-gray-300">
            <li>• 支持全球任意国家，包括南极、北极等特殊地区</li>
            <li>• 时间跨度从1800年到2050年，体验不同时代</li>
            <li>• 随机生成角色属性：性别、人种、家庭背景、健康状况等</li>
            <li>• 丰富的人生阶段系统和属性成长机制</li>
            <li>• 复杂的关系网络和成就系统</li>
            <li>• 多种推进模式：激进、稳定、保守</li>
          </ul>
        </section>

        <section className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
          <h2 className="text-2xl font-semibold mb-4">技术栈</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-300">
            <div>
              <h3 className="font-semibold mb-2">前端技术</h3>
              <ul className="space-y-1">
                <li>• React 18 + TypeScript</li>
                <li>• Vite 构建工具</li>
                <li>• Tailwind CSS 样式</li>
                <li>• Zustand 状态管理</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">后端技术</h3>
              <ul className="space-y-1">
                <li>• Go + Gin 框架</li>
                <li>• PostgreSQL 数据库</li>
                <li>• Redis 缓存</li>
                <li>• Docker 部署</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
} 