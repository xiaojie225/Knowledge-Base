/**
 * VitePress 配置文件
 * 
 * 这个文件定义了整个网站的核心配置，包括：
 * - 站点基本信息（标题、描述等）
 * - 导航栏配置
 * - 侧边栏配置（支持多层嵌套）
 * - 搜索功能配置
 * - 主题样式配置
 * 
 * 文档：https://vitepress.dev/reference/site-config
 */

import { defineConfig } from 'vitepress'

/**
 * 导出默认配置
 * defineConfig 函数提供 TypeScript 类型支持和智能提示
 */
export default defineConfig({
  /**
   * ============================================
   * 站点元数据
   * ============================================
   */
  
  /**
   * 网站标题
   * 显示在浏览器标签页、导航栏等位置
   */
  title: "my-notes",
  
  /**
   * 网站描述
   * 用于 SEO 优化和搜索引擎展示
   */
  description: "平时自己学习的日记月累，自己积累的技术",
  
  /**
   * 网站语言设置
   */
  lang: 'zh-CN',
  
  /**
   * 部署基础路径
   * 
   * ⚠️ 重要修改：
   * 根据您的 GitHub 仓库名称 Knowledge-Base
   * 访问地址是：https://xiaojie225.github.io/Knowledge-Base/
   * 所以 base 必须设置为 '/Knowledge-Base/'
   */
  base: '/',
  
  /**
   * 生成简洁 URL（移除 .html 后缀）
   */
  cleanUrls: true,
  
  /**
   * 启用最后更新时间
   * 基于 Git 提交记录显示页面更新时间
   */
  lastUpdated: true,
  
  /**
   * Head 标签配置
   * 用于添加网站图标、SEO 标签等
   */
  head: [
    ['link', { rel: 'icon', href: '/Knowledge-Base/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }]
  ],
  
  /**
   * ============================================
   * 主题配置
   * ============================================
   */
  themeConfig: {
    /**
     * 网站 Logo（可选）
     * 如果需要 Logo，在 public/ 目录放置图片文件
     */
    // logo: '/logo.png',
    
    /**
     * ========================================
     * 顶部导航栏配置
     * ========================================
     * 
     * 导航栏显示在页面顶部，用于快速访问主要分类
     */
    nav: [
      /**
       * 首页链接
       */
      { 
        text: '首页', 
        link: '/' 
      },
      
      { 
        text: '算法', 
        link: '/0.算法/index' 
      },
      
      { 
        text: '前端三剑客', 
        link: '/1.三剑客/index' 
      },

      { 
        text: 'Vue', 
        link: '/2.vue学习/index' 
      },

      { 
        text: '小程序', 
        link: '/3.微信小程序/index' 
      },
      
      { 
        text: 'uni-app', 
        link: '/4.uniapp学习/index' 
      }
    ],

    /**
     * ========================================
     * 侧边栏配置 - 支持多层嵌套
     * ========================================
     * 
     * 侧边栏根据当前访问的路径自动显示对应的导航结构
     * 配置格式：'/路径/': [ 侧边栏项数组 ]
     * 
     * 嵌套结构说明：
     * 1. 第一层：大分类（如"算法与数据结构"）
     * 2. 第二层：子分类（如"数据结构"、"LeetCode"）
     * 3. 第三层：具体文章（如"数组.md"、"链表.md"）
     * 
     * collapsed 属性：
     * - true：默认折叠
     * - false：默认展开
     */
    sidebar: {
      /**
       * ========================================
       * 算法分类侧边栏 - 嵌套结构示例
       * ========================================
       * 
       * 文件结构：
       * 0.算法/
       * ├── index.md                    # 概览页
       * ├── 数据结构/                    # 子目录
       * │   ├── 数组.md
       * │   ├── 链表.md
       * │   └── 树.md
       * └── LeetCode/                   # 子目录
       *     ├── 简单题.md
       *     └── 中等题.md
       */
      '/0.算法/': [
        {
          text: '算法与数据结构',
          collapsed: false,  // 默认展开第一层
          items: [
            { 
              text: '概览', 
              link: '/0.算法/index' 
            },
            /**
             * 第二层嵌套：数据结构子分类
             */
            {
              text: '数据结构',
              collapsed: false,  // 数据结构分类默认展开
              items: [
                { 
                  text: '数组', 
                  link: '/0.算法/数据结构/数组' 
                },
                // 可以继续添加更多文章
                // { text: '链表', link: '/0.算法/数据结构/链表' },
                // { text: '栈与队列', link: '/0.算法/数据结构/栈与队列' },
                // { text: '树', link: '/0.算法/数据结构/树' },
              ]
            },
            /**
             * 第二层嵌套：LeetCode 子分类
             */
            {
              text: 'LeetCode',
              collapsed: true,  // LeetCode 分类默认折叠
              items: [
                // { text: '简单题', link: '/0.算法/LeetCode/简单题' },
                // { text: '中等题', link: '/0.算法/LeetCode/中等题' },
                // { text: '困难题', link: '/0.算法/LeetCode/困难题' },
              ]
            }
          ]
        }
      ],
      
      /**
       * ========================================
       * 前端三剑客分类侧边栏 - 嵌套结构示例
       * ========================================
       * 
       * 文件结构：
       * 1.三剑客/
       * ├── index.md
       * ├── HTML/
       * │   ├── 基础.md
       * │   └── HTML5.md
       * ├── CSS/
       * │   ├── 基础.md
       * │   ├── Flexbox.md
       * │   └── Grid.md
       * └── JavaScript/
       *     ├── 基础.md
       *     ├── ES6.md
       *     └── 异步编程.md
       */
      '/1.三剑客/': [
        {
          text: '前端三剑客',
          collapsed: false,
          items: [
            { 
              text: '概览', 
              link: '/1.三剑客/index' 
            },
            /**
             * HTML 子分类
             */
            {
              text: 'HTML',
              collapsed: false,  // HTML 分类默认展开
              items: [
                // { text: 'HTML 基础', link: '/1.三剑客/HTML/基础' },
                // { text: 'HTML5 新特性', link: '/1.三剑客/HTML/HTML5' },
                // { text: '语义化标签', link: '/1.三剑客/HTML/语义化标签' },
              ]
            },
            /**
             * CSS 子分类
             */
            {
              text: 'CSS',
              collapsed: false,
              items: [
                // { text: 'CSS 基础', link: '/1.三剑客/CSS/基础' },
                // { text: 'Flexbox 布局', link: '/1.三剑客/CSS/Flexbox' },
                // { text: 'Grid 布局', link: '/1.三剑客/CSS/Grid' },
                // { text: '响应式设计', link: '/1.三剑客/CSS/响应式设计' },
              ]
            },
            /**
             * JavaScript 子分类
             */
            {
              text: 'JavaScript',
              collapsed: false,
              items: [
                // { text: 'JS 基础', link: '/1.三剑客/JavaScript/基础' },
                // { text: 'ES6+ 特性', link: '/1.三剑客/JavaScript/ES6' },
                // { text: '异步编程', link: '/1.三剑客/JavaScript/异步编程' },
                // { text: 'DOM 操作', link: '/1.三剑客/JavaScript/DOM操作' },
              ]
            }
          ]
        }
      ],
      
      /**
       * ========================================
       * Vue 学习分类侧边栏
       * ========================================
       */
      '/2.vue学习/': [
        {
          text: 'Vue 学习',
          collapsed: false,
          items: [
            { 
              text: '概览', 
              link: '/2.vue学习/index' 
            },
            // 可以添加子分类
            // {
            //   text: 'Vue 基础',
            //   collapsed: false,
            //   items: [
            //     { text: '模板语法', link: '/2.vue学习/基础/模板语法' },
            //     { text: '计算属性', link: '/2.vue学习/基础/计算属性' },
            //   ]
            // },
            // {
            //   text: 'Composition API',
            //   collapsed: false,
            //   items: [
            //     { text: 'setup 函数', link: '/2.vue学习/CompositionAPI/setup' },
            //     { text: 'ref 和 reactive', link: '/2.vue学习/CompositionAPI/ref和reactive' },
            //   ]
            // }
          ]
        }
      ],
      
      /**
       * ========================================
       * 微信小程序分类侧边栏
       * ========================================
       */
      '/3.微信小程序/': [
        {
          text: '微信小程序',
          collapsed: false,
          items: [
            { 
              text: '概览', 
              link: '/3.微信小程序/index' 
            },
            // 子分类示例
            // {
            //   text: '基础知识',
            //   collapsed: false,
            //   items: [
            //     { text: '小程序配置', link: '/3.微信小程序/基础/配置' },
            //     { text: '生命周期', link: '/3.微信小程序/基础/生命周期' },
            //   ]
            // }
          ]
        }
      ],
      
      /**
       * ========================================
       * uni-app 分类侧边栏
       * ========================================
       */
      '/4.uniapp学习/': [
        {
          text: 'uni-app 学习',
          collapsed: false,
          items: [
            { 
              text: '概览', 
              link: '/4.uniapp学习/index' 
            },
            // 子分类示例
            // {
            //   text: '基础开发',
            //   collapsed: false,
            //   items: [
            //     { text: '项目结构', link: '/4.uniapp学习/基础/项目结构' },
            //     { text: '条件编译', link: '/4.uniapp学习/基础/条件编译' },
            //   ]
            // }
          ]
        }
      ]
    },

    /**
     * ========================================
     * 社交链接配置
     * ========================================
     * 
     * 显示在导航栏右侧
     * 支持的图标：github, twitter, discord 等
     */
    socialLinks: [
      { 
        icon: 'github', 
        link: 'https://github.com/xiaojie225/Knowledge-Base' 
      }
    ],
    
    /**
     * ========================================
     * 页脚配置
     * ========================================
     */
    footer: {
      message: '基于 VitePress 构建',
      copyright: 'Copyright © 2025-present'
    },
    
    /**
     * ========================================
     * 文档页脚（上一页/下一篇）
     * ========================================
     */
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    
    /**
     * ========================================
     * 大纲（目录）配置
     * ========================================
     * 
     * 显示在页面右侧的文章大纲
     */
    outline: {
      /**
       * 显示的标题级别
       * [2, 3] 表示显示 h2 和 h3 标题
       */
      level: [2, 3],
      label: '本页目录'
    },
    
    /**
     * ========================================
     * 最后更新时间配置
     * ========================================
     */
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },
    
    /**
     * ========================================
     * 搜索功能配置
     * ========================================
     * 
     * VitePress 内置本地搜索功能
     */
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭'
                }
              }
            }
          }
        }
      }
    }
  },
  
  /**
   * ============================================
   * Markdown 配置
   * ============================================
   */
  markdown: {
    /**
     * 代码块主题
     * 支持浅色和深色模式
     */
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    
    /**
     * 显示代码块行号
     */
    lineNumbers: true
  }
})
