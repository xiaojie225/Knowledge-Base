/**
 * VitePress 配置文件
 * 
 * 这个文件定义了整个网站的核心配置，包括：
 * - 站点基本信息（标题、描述等）
 * - 导航栏配置
 * - 侧边栏配置
 * - 搜索功能配置
 * - 主题样式配置
 * 
 * 文档：https://vitepress.dev/reference/site-config
 */

import { defineConfig } from 'vitepress'

/**
 * 导出默认配置
 * defineConfig 提供了类型提示和自动补全
 */
export default defineConfig({
  /**
   * ============================================
   * 站点元数据配置
   * ============================================
   */
  
  /**
   * 网站标题
   * 显示在浏览器标签页和页面顶部
   */
  title: '我的技术笔记',
  
  /**
   * 网站描述
   * 用于 SEO 优化，显示在搜索引擎结果中
   */
  description: '个人技术学习笔记知识库 - 前端、算法、小程序开发',
  
  /**
   * 网站语言
   * zh-CN 表示简体中文
   */
  lang: 'zh-CN',
  
  /**
   * 部署基础路径
   * 
   * 重要说明：
   * - 如果部署到 https://username.github.io/ 根目录，设置为 '/'
   * - 如果部署到 https://username.github.io/my-notes/ 子目录，设置为 '/my-notes/'
   * - 路径必须以 / 开头和结尾
   * 
   * 默认设置为 '/'，部署时根据实际情况修改
   */
  base: '/',
  
  /**
   * 生成简洁的 URL
   * 
   * true: /guide/getting-started (推荐)
   * false: /guide/getting-started.html
   */
  cleanUrls: true,
  
  /**
   * 显示最后更新时间
   * 
   * 基于 Git 提交时间自动显示每个页面的最后更新时间
   * 需要在 Git 仓库中才能生效
   */
  lastUpdated: true,
  
  /**
   * Head 标签配置
   * 
   * 用于添加额外的标签到 <head> 中
   * 常用于：网站图标、SEO 优化、移动端适配等
   */
  head: [
    /**
     * 网站图标
     * 确保在 docs/public/ 目录下有 favicon.ico 文件
     */
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    
    /**
     * 主题颜色（移动端浏览器地址栏颜色）
     */
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    
    /**
     * 移动端 Web App 配置
     */
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    
    /**
     * 移动端视口配置
     * 确保页面在移动设备上正确显示
     */
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }]
  ],
  
  /**
   * ============================================
   * 主题配置
   * ============================================
   */
  themeConfig: {
    /**
     * 网站 Logo
     * 显示在导航栏左侧
     * 确保在 docs/public/ 目录下有 logo.png 文件
     */
    logo: '/logo.png',
    
    /**
     * 网站标题（可选）
     * 如果设置了 logo，可以隐藏文字标题
     */
    siteTitle: '我的技术笔记',
    
    /**
     * ========================================
     * 导航栏配置
     * ========================================
     * 
     * 导航栏显示在页面顶部
     * text: 显示的文字
     * link: 跳转的链接（相对于 docs/ 目录）
     */
    nav: [
      /**
       * 首页链接
       */
      { 
        text: '首页', 
        link: '/' 
      },
      
      /**
       * 前端三剑客分类
       */
      { 
        text: '前端三剑客', 
        link: '/1.三剑客/' 
      },
      
      /**
       * Vue 学习分类
       */
      { 
        text: 'Vue', 
        link: '/2.vue学习/' 
      },
      
      /**
       * 微信小程序分类
       */
      { 
        text: '小程序', 
        link: '/3.微信小程序/' 
      },
      
      /**
       * uni-app 分类
       */
      { 
        text: 'uni-app', 
        link: '/4.uniapp学习/' 
      },
      
      /**
       * 下拉菜单示例
       * items: 子菜单项数组
       */
      {
        text: '更多',
        items: [
          { text: '算法', link: '/0.算法/' },
          { text: '关于', link: '/about' }
        ]
      }
    ],
    
    /**
     * ========================================
     * 侧边栏配置
     * ========================================
     * 
     * 侧边栏根据当前路径自动显示对应的导航
     * 
     * 配置格式：
     * '/路径/': [ 侧边栏项数组 ]
     * 
     * 侧边栏项格式：
     * {
     *   text: '显示的文字',
     *   collapsed: true/false,  // 是否默认折叠（可选）
     *   items: [                // 子项（可选）
     *     { text: '子项文字', link: '/路径' }
     *   ]
     * }
     */
    sidebar: {
      /**
       * 算法分类侧边栏
       */
      '/0.算法/': [
        {
          text: '算法与数据结构',
          items: [
            { text: '概览', link: '/0.算法/' },
            { text: 'LeetCode 题解', link: '/0.算法/leetcode' },
            { text: '数据结构', link: '/0.算法/data-structures' }
          ]
        }
      ],
      
      /**
       * 前端三剑客分类侧边栏
       */
      '/1.三剑客/': [
        {
          text: '前端三剑客',
          items: [
            { text: '概览', link: '/1.三剑客/' },
            {
              text: 'HTML',
              collapsed: false,  // 默认展开
              items: [
                { text: 'HTML 基础', link: '/1.三剑客/html/basics' },
                { text: 'HTML5 新特性', link: '/1.三剑客/html/html5' }
              ]
            },
            {
              text: 'CSS',
              collapsed: false,
              items: [
                { text: 'CSS 基础', link: '/1.三剑客/css/basics' },
                { text: 'Flexbox 布局', link: '/1.三剑客/css/flexbox' },
                { text: 'Grid 布局', link: '/1.三剑客/css/grid' }
              ]
            },
            {
              text: 'JavaScript',
              collapsed: false,
              items: [
                { text: 'JS 基础', link: '/1.三剑客/javascript/basics' },
                { text: 'ES6+ 特性', link: '/1.三剑客/javascript/es6' },
                { text: '异步编程', link: '/1.三剑客/javascript/async' }
              ]
            }
          ]
        }
      ],
      
      /**
       * Vue 学习分类侧边栏
       */
      '/2.vue学习/': [
        {
          text: 'Vue 学习',
          items: [
            { text: '概览', link: '/2.vue学习/' },
            { text: 'Vue 基础', link: '/2.vue学习/basics' },
            { text: 'Composition API', link: '/2.vue学习/composition-api' },
            { text: 'Vue Router', link: '/2.vue学习/router' },
            { text: 'Pinia 状态管理', link: '/2.vue学习/pinia' }
          ]
        }
      ],
      
      /**
       * 微信小程序分类侧边栏
       */
      '/3.微信小程序/': [
        {
          text: '微信小程序',
          items: [
            { text: '概览', link: '/3.微信小程序/' },
            { text: '小程序基础', link: '/3.微信小程序/basics' },
            { text: '组件开发', link: '/3.微信小程序/components' },
            { text: 'API 使用', link: '/3.微信小程序/api' }
          ]
        }
      ],
      
      /**
       * uni-app 分类侧边栏
       */
      '/4.uniapp学习/': [
        {
          text: 'uni-app 学习',
          items: [
            { text: '概览', link: '/4.uniapp学习/' },
            { text: 'uni-app 基础', link: '/4.uniapp学习/basics' },
            { text: '跨平台开发', link: '/4.uniapp学习/cross-platform' },
            { text: 'API 详解', link: '/4.uniapp学习/api' }
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
     * 
     * 支持的图标：
     * - github, gitlab, bitbucket
     * - twitter, discord, slack
     * - 或自定义 SVG 图标
     */
    socialLinks: [
      { 
        icon: 'github', 
        link: 'https://github.com/yourusername/my-notes' 
      }
    ],
    
    /**
     * ========================================
     * 页脚配置
     * ========================================
     */
    footer: {
      /**
       * 页脚消息
       * 支持 HTML
       */
      message: '基于 VitePress 构建',
      
      /**
       * 版权信息
       */
      copyright: 'Copyright © 2025-present Your Name'
    },
    
    /**
     * ========================================
     * 文档页脚（上一页/下一页）配置
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
      
      /**
       * 大纲标题
       */
      label: '本页目录'
    },
    
    /**
     * ========================================
     * 最后更新时间配置
     * ========================================
     */
    lastUpdated: {
      /**
       * 显示的文字
       */
      text: '最后更新于',
      
      /**
       * 时间格式选项
       */
      formatOptions: {
        dateStyle: 'short',      // 日期格式：短格式
        timeStyle: 'medium'      // 时间格式：中等格式
      }
    },
    
    /**
     * ========================================
     * 其他 UI 文本配置
     * ========================================
     */
    
    /**
     * 返回顶部按钮文字
     */
    returnToTopLabel: '返回顶部',
    
    /**
     * 侧边栏菜单标签
     */
    sidebarMenuLabel: '菜单',
    
    /**
     * 暗黑模式切换按钮配置
     */
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    
    /**
     * ========================================
     * 搜索功能配置
     * ========================================
     * 
     * VitePress 内置本地搜索功能
     * 无需额外配置搜索服务
     */
    search: {
      /**
       * 搜索提供商
       * 'local' 表示使用本地搜索（推荐）
       * 也可以配置为 'algolia' 使用 Algolia DocSearch
       */
      provider: 'local',
      
      /**
       * 本地搜索选项
       */
      options: {
        /**
         * 本地化配置
         */
        locales: {
          root: {
            /**
             * 搜索框和搜索结果的文本翻译
             */
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
    },
    
    /**
     * ========================================
     * 编辑链接配置（可选）
     * ========================================
     * 
     * 在每个页面底部显示"编辑此页"链接
     * 方便在 GitHub 上直接编辑文档
     */
    editLink: {
      /**
       * 编辑链接的模式
       * :path 会被替换为当前页面的文件路径
       */
      pattern: 'https://github.com/yourusername/my-notes/edit/main/docs/:path',
      
      /**
       * 编辑链接的文字
       */
      text: '在 GitHub 上编辑此页'
    }
  },
  
  /**
   * ============================================
   * Markdown 配置
   * ============================================
   * 
   * 配置 Markdown 解析器的行为
   */
  markdown: {
    /**
     * 代码块主题
     * 支持浅色和深色两种模式
     */
    theme: {
      light: 'github-light',   // 浅色模式主题
      dark: 'github-dark'      // 深色模式主题
    },
    
    /**
     * 显示代码块行号
     * true: 显示行号
     * false: 不显示行号
     */
    lineNumbers: true,
    
    /**
     * 自定义容器标题
     * 
     * 使用方法：
     * ::: tip 提示
     * 这是一个提示框
     * :::
     */
    container: {
      tipLabel: '提示',
      warningLabel: '警告',
      dangerLabel: '危险',
      infoLabel: '信息',
      detailsLabel: '详细信息'
    }
  }
})