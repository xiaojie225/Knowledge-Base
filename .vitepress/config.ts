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
  base: '/Knowledge-Base/',
  
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
        text: '前端',
        link: '/知识库/前端/index'
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
       */
      '/知识库/前端/': [
    {
        text: '前端知识库',
        collapsed: false,
        items: [
            {
                text: '0.算法',
                collapsed: true,
                items: [
                    {
                        text: '25-14-用JS实现二分查找-分析时间复杂度',
                        link: '/知识库/前端/0.算法/25-14-用JS实现二分查找-分析时间复杂度'
                    },
                    {
                        text: '25-15-用JS实现二分查找-代码演示和单元测试',
                        link: '/知识库/前端/0.算法/25-15-用JS实现二分查找-代码演示和单元测试'
                    },
                    {
                        text: '25-16-用JS实现二分查找-递归和循环哪个更好',
                        link: '/知识库/前端/0.算法/25-16-用JS实现二分查找-递归和循环哪个更好'
                    },
                    {
                        text: '25-17-找出一个数组中和为n的两个数-嵌套循环不是最优解',
                        link: '/知识库/前端/0.算法/25-17-找出一个数组中和为n的两个数-嵌套循环不是最优解'
                    },
                    {
                        text: '25-18-找出一个数组中和为n的两个数-双指针的思路',
                        link: '/知识库/前端/0.算法/25-18-找出一个数组中和为n的两个数-双指针的思路'
                    },
                    {
                        text: '25-19-找出一个数组中和为n的两个数-双指针的代码演示',
                        link: '/知识库/前端/0.算法/25-19-找出一个数组中和为n的两个数-双指针的代码演示'
                    },
                    {
                        text: '25-20-求二叉搜索树的第K小值-二叉树和三种遍历',
                        link: '/知识库/前端/0.算法/25-20-求二叉搜索树的第K小值-二叉树和三种遍历'
                    },
                    {
                        text: '25-21-求二叉搜索树的第K小值-解题',
                        link: '/知识库/前端/0.算法/25-21-求二叉搜索树的第K小值-解题'
                    },
                    {
                        text: '25-22-为什么二叉树很重要，而不是三叉树四岔树',
                        link: '/知识库/前端/0.算法/25-22-为什么二叉树很重要，而不是三叉树四岔树'
                    },
                    {
                        text: '25-24-求斐波那契数列的第n值-递归算法会导致运行崩溃',
                        link: '/知识库/前端/0.算法/25-24-求斐波那契数列的第n值-递归算法会导致运行崩溃'
                    },
                    {
                        text: '25-25-求斐波那契数列的第n值-优化时间复杂度',
                        link: '/知识库/前端/0.算法/25-25-求斐波那契数列的第n值-优化时间复杂度'
                    },
                    {
                        text: '25-26-【连环问】青蛙跳台阶有几种方式',
                        link: '/知识库/前端/0.算法/25-26-【连环问】青蛙跳台阶有几种方式'
                    },
                    {
                        text: '25-27-移动0到数组的末尾-splice会导致性能问题',
                        link: '/知识库/前端/0.算法/25-27-移动0到数组的末尾-splice会导致性能问题'
                    },
                    {
                        text: '25-28-移动0到数组的末尾-使用双指针',
                        link: '/知识库/前端/0.算法/25-28-移动0到数组的末尾-使用双指针'
                    },
                    {
                        text: '25-29-获取字符串中连续最多的字符以及次数-使用嵌套循环',
                        link: '/知识库/前端/0.算法/25-29-获取字符串中连续最多的字符以及次数-使用嵌套循环'
                    },
                    {
                        text: '25-30-获取字符串中连续最多的字符以及次数-使用双指针（00',
                        link: '/知识库/前端/0.算法/25-30-获取字符串中连续最多的字符以及次数-使用双指针（00'
                    },
                    {
                        text: '25-32-用JS实现快速排序并说明时间复杂度-代码演示和单元测',
                        link: '/知识库/前端/0.算法/25-32-用JS实现快速排序并说明时间复杂度-代码演示和单元测'
                    }
                ]
            },
            {
                text: '1.三剑客',
                collapsed: true,
                items: [
                    {
                        text: 'css',
                        collapsed: true,
                        items: [
                            {
                                text: 'CSS 完整知识库',
                                link: '/知识库/前端/1.三剑客/css/CSS 完整知识库'
                            },
                            {
                                text: 'CSS其他（未整理）',
                                link: '/知识库/前端/1.三剑客/css/CSS其他（未整理）'
                            },
                            {
                                text: 'CSS题目',
                                link: '/知识库/前端/1.三剑客/css/CSS题目'
                            },
                            {
                                text: 'Tailwind CSS 零基础实战指南',
                                link: '/知识库/前端/1.三剑客/css/Tailwind CSS 零基础实战指南'
                            }
                        ]
                    },
                    {
                        text: 'html',
                        collapsed: true,
                        items: [
                            {
                                text: '（未整理）',
                                link: '/知识库/前端/1.三剑客/html/（未整理）'
                            }
                        ]
                    },
                    {
                        text: 'js',
                        collapsed: true,
                        items: [
                            {
                                text: '模块',
                                collapsed: true,
                                items: [
                                    {
                                        text: 'ajax 工具函数',
                                        link: '/知识库/前端/1.三剑客/js/模块/ajax 工具函数'
                                    },
                                    {
                                        text: 'jQuery快速入门',
                                        link: '/知识库/前端/1.三剑客/js/模块/jQuery快速入门'
                                    }
                                ]
                            },
                            {
                                text: 'js可复用库',
                                collapsed: true,
                                items: [
                                    {
                                        text: 'js功能函数',
                                        link: '/知识库/前端/1.三剑客/js/js可复用库/js功能函数'
                                    },
                                    {
                                        text: 'js验证函数',
                                        link: '/知识库/前端/1.三剑客/js/js可复用库/js验证函数'
                                    }
                                ]
                            },
                            {
                                text: '(未整理)JavaScript',
                                link: '/知识库/前端/1.三剑客/js/(未整理)JavaScript'
                            },
                            {
                                text: '浏览器API',
                                link: '/知识库/前端/1.三剑客/js/浏览器API'
                            },
                            {
                                text: 'DOM 操作知识',
                                link: '/知识库/前端/1.三剑客/js/DOM 操作知识'
                            },
                            {
                                text: 'JavaScript 数组操作',
                                link: '/知识库/前端/1.三剑客/js/JavaScript 数组操作'
                            },
                            {
                                text: 'JavaScript 知识点',
                                link: '/知识库/前端/1.三剑客/js/JavaScript 知识点'
                            },
                            {
                                text: 'js题目',
                                link: '/知识库/前端/1.三剑客/js/js题目'
                            }
                        ]
                    }
                ]
            },
            {
                text: '2.vue学习',
                collapsed: true,
                items: [
                    {
                        text: '模块',
                        collapsed: true,
                        items: [
                            {
                                text: '网络模块-axios',
                                collapsed: true,
                                items: [
                                    {
                                        text: 'axios 题目',
                                        link: '/知识库/前端/2.vue学习/模块/网络模块-axios/axios 题目'
                                    },
                                    {
                                        text: 'axios文档',
                                        link: '/知识库/前端/2.vue学习/模块/网络模块-axios/axios文档'
                                    }
                                ]
                            },
                            {
                                text: '状态管理库-Pinina',
                                collapsed: true,
                                items: [
                                    {
                                        text: 'Pinia 知识体系',
                                        link: '/知识库/前端/2.vue学习/模块/状态管理库-Pinina/Pinia 知识体系'
                                    },
                                    {
                                        text: 'Pinina面试题',
                                        link: '/知识库/前端/2.vue学习/模块/状态管理库-Pinina/Pinina面试题'
                                    }
                                ]
                            },
                            {
                                text: 'excel导入导出',
                                collapsed: true,
                                items: [
                                    {
                                        text: '库',
                                        link: '/知识库/前端/2.vue学习/模块/excel导入导出/库'
                                    },
                                    {
                                        text: 'Vue 3 轻松搞定 Excel（xlsx SheetJS)',
                                        link: '/知识库/前端/2.vue学习/模块/excel导入导出/Vue 3 轻松搞定 Excel（xlsx SheetJS)'
                                    },
                                    {
                                        text: 'Vue3 exceljs库实现前端导入导出Excel',
                                        link: '/知识库/前端/2.vue学习/模块/excel导入导出/Vue3 exceljs库实现前端导入导出Excel'
                                    }
                                ]
                            },
                            {
                                text: 'element-plus',
                                link: '/知识库/前端/2.vue学习/模块/element-plus'
                            },
                            {
                                text: 'Vue Router 4',
                                link: '/知识库/前端/2.vue学习/模块/Vue Router 4'
                            },
                            {
                                text: 'webpack万字总结的超入门核',
                                link: '/知识库/前端/2.vue学习/模块/webpack万字总结的超入门核'
                            }
                        ]
                    },
                    {
                        text: 'Vue可复用库',
                        collapsed: true,
                        items: [
                            {
                                text: 'vue案例',
                                link: '/知识库/前端/2.vue学习/Vue可复用库/vue案例'
                            }
                        ]
                    },
                    {
                        text: '（未整理）VUE',
                        link: '/知识库/前端/2.vue学习/（未整理）VUE'
                    },
                    {
                        text: 'npm',
                        link: '/知识库/前端/2.vue学习/npm'
                    },
                    {
                        text: 'spec-vu3',
                        link: '/知识库/前端/2.vue学习/spec-vu3'
                    },
                    {
                        text: 'Vue  文档',
                        link: '/知识库/前端/2.vue学习/Vue  文档'
                    },
                    {
                        text: 'vue 题目',
                        link: '/知识库/前端/2.vue学习/vue 题目'
                    }
                ]
            },
            {
                text: '3.微信小程序',
                collapsed: true,
                items: [
                    {
                        text: '模块',
                        collapsed: true,
                        items: [
                            {
                                text: '微信订阅功能',
                                collapsed: true,
                                items: [
                                    {
                                        text: '微信订阅消息速查',
                                        link: '/知识库/前端/3.微信小程序/模块/微信订阅功能/微信订阅消息速查'
                                    }
                                ]
                            },
                            {
                                text: '微信支付',
                                collapsed: true,
                                items: [
                                    {
                                        text: '微信支付代码',
                                        link: '/知识库/前端/3.微信小程序/模块/微信支付/微信支付代码'
                                    }
                                ]
                            },
                            {
                                text: '微信小程序-简单题',
                                link: '/知识库/前端/3.微信小程序/模块/微信小程序-简单题'
                            }
                        ]
                    },
                    {
                        text: '可复用函数-微信小程序',
                        link: '/知识库/前端/3.微信小程序/可复用函数-微信小程序'
                    },
                    {
                        text: '微信小程序完整开发学习文档',
                        link: '/知识库/前端/3.微信小程序/微信小程序完整开发学习文档'
                    },
                    {
                        text: '未整理-微信小程序',
                        link: '/知识库/前端/3.微信小程序/未整理-微信小程序'
                    }
                ]
            },
            {
                text: '4.uniapp学习',
                collapsed: true,
                items: [
                    {
                        text: '基础',
                        collapsed: true,
                        items: [
                            {
                                text: '复用函数-UniApp',
                                link: '/知识库/前端/4.uniapp学习/基础/复用函数-UniApp'
                            },
                            {
                                text: '题目-UniApp',
                                link: '/知识库/前端/4.uniapp学习/基础/题目-UniApp'
                            },
                            {
                                text: '原生API',
                                link: '/知识库/前端/4.uniapp学习/基础/原生API'
                            },
                            {
                                text: 'UniApp核心API',
                                link: '/知识库/前端/4.uniapp学习/基础/UniApp核心API'
                            },
                            {
                                text: 'uniapp文档',
                                link: '/知识库/前端/4.uniapp学习/基础/uniapp文档'
                            }
                        ]
                    },
                    {
                        text: '未整理-uniapp',
                        link: '/知识库/前端/4.uniapp学习/未整理-uniapp'
                    },
                    {
                        text: 'spec-uniapp',
                        link: '/知识库/前端/4.uniapp学习/spec-uniapp'
                    },
                    {
                        text: 'uview',
                        link: '/知识库/前端/4.uniapp学习/uview'
                    }
                ]
            },
            {
                text: '其他',
                collapsed: true,
                items: [
                    {
                        text: '设计模式',
                        link: '/知识库/前端/其他/设计模式'
                    },
                    {
                        text: 'http',
                        link: '/知识库/前端/其他/http'
                    }
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
  },
  
  /**
   * 忽略死链接检查
   * 禁用构建时的死链接验证，避免因为文档中的示例链接导致构建失败
   */
  ignoreDeadLinks: true
})
