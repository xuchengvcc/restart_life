import { Link } from 'react-router-dom'
import { Play, Github, Star } from 'lucide-react'

export function Home() {
  return (
    <div className="text-center text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          《重启人生》
        </h1>
        
        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
          一款人生模拟游戏，让你体验不同时代、不同国家、不同背景下的完整人生历程。
          从1800年到2050年，随机生成独特的人生轨迹，做出关键选择，塑造你的命运。
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <Star className="w-8 h-8 text-yellow-400 mb-4 mx-auto" />
            <h3 className="text-lg font-semibold mb-2">随机人生</h3>
            <p className="text-gray-400">每次游戏都有独特的人生体验，随机生成的属性和背景</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <Github className="w-8 h-8 text-blue-400 mb-4 mx-auto" />
            <h3 className="text-lg font-semibold mb-2">历史穿越</h3>
            <p className="text-gray-400">体验从1800年到2050年的不同历史时期</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <Play className="w-8 h-8 text-green-400 mb-4 mx-auto" />
            <h3 className="text-lg font-semibold mb-2">选择决定命运</h3>
            <p className="text-gray-400">在关键时刻做出选择，影响你的人生轨迹</p>
          </div>
        </div>

        <div className="space-y-4">
          <Link
            to="/game"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105"
          >
            <Play size={24} />
            <span>开始新人生</span>
          </Link>
          
          <div className="flex justify-center space-x-4 text-sm text-gray-400">
            <Link to="/about" className="hover:text-white transition-colors">
              了解更多
            </Link>
            <span>•</span>
            <a href="https://github.com/your-org/restart-life-web" className="hover:text-white transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 