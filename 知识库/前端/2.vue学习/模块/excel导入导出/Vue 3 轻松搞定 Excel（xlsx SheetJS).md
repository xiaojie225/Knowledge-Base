
# 前端仔告别后端！Vue 3 轻松搞定 Excel 导入导出，同事都惊呆了！

 
嘿，各位前端小伙伴！

你是否也遇到过这样的场景：

> “后端大哥，能帮我加个导出 Excel 的功能吗？”  
> “在排期了，下下周吧…”

只是导个报表而已，等得花儿都谢了… 😫

别慌！今天就给你分享一个前端“黑魔法”，让你用 **[Vue](https://u.jd.com/Sg2wuCY) 3 + `[xlsx](https://u.jd.com/SgnP9HK)`** 在浏览器端独立完成 Excel 导入导出，彻底实现“报表自由”！🚀

准备好了吗？让我们开始吧！

## 主角登场：`xlsx` ([SheetJS](https://u.jd.com/SgnP9HK)) 是何方神圣？

`xlsx` (也叫 SheetJS) 是一个功能超强的 [JavaScript](https://u.jd.com/S1RN1vs) 库，专门用来处理各种电子表格文件。最牛的是，它完全在你的浏览器里运行，根本不需要后端大哥的帮助！

**它的超能力包括：**

- ✅ **纯前端实现**：所有操作都在浏览器完成，跟后端说拜拜！
- ✅ **格式通吃**：无论是 `.xlsx`, `.xls` 还是 `.csv`，它都玩得转。
- ✅ **功能全面**：解析、生成、设置样式… 只有你想不到，没有它做不到。
- ✅ **百搭好用**：跟 Vue、[React](https://u.jd.com/S6y44LE)、Angular 都能愉快地做朋友。

---

## 安装

打开你的终端，一行命令搞定安装：

```
npm install xlsx
```

---

## ⬇️ 功能一：从网页到 Excel，一键导出！

这是最常见的需求了，把页面上的数据变成一个可以下载的 Excel 文件。

#### 实现思路

1. 准备好你的数据（一个对象数组）。
2. 用 `XLSX.utils.json_to_sheet()` 把数据变成工作表。
3. 用 `XLSX.utils.book_new()` 创建一个新工作簿。
4. 用 `XLSX.utils.book_append_sheet()` 把工作表塞进工作簿。
5. 最后，`XLSX.writeFile()` 一声令下，文件就自动下载啦！

#### 上代码 (`ExportExcel.vue`)

```
<template>
  <div class="export-container">
    <h3>👇 数据导出示例</h3>
    <p>点击按钮，将下方表格数据导出为 Excel 文件。</p>

    <table class="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>姓名</th>
          <th>城市</th>
          <th>注册日期</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in sampleData" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.city }}</td>
          <td>{{ user.registerDate }}</td>
        </tr>
      </tbody>
    </table>

    <button @click="exportData" class="export-button">导出为 Excel</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import * as XLSX from "xlsx";

// 1. 准备好要导出的数据
const sampleData = ref([
  { id: 1, name: "爱丽丝", city: "北京", registerDate: "2023-01-15" },
  { id: 2, name: "鲍勃", city: "上海", registerDate: "2023-02-20" },
  { id: 3, name: "查理", city: "广州", registerDate: "2023-03-10" },
  { id: 4, name: "黛安娜", city: "深圳", registerDate: "2023-04-05" },
]);

const exportData = () => {
  // 2. 定义中文表头 (可选，但强烈推荐！)
  const headers = {
    id: "用户ID",
    name: "姓名",
    city: "所在城市",
    registerDate: "注册日期",
  };

  // 3. 将原始数据数组，根据表头映射成新数组
  const dataToExport = sampleData.value.map((item) => {
    const newItem = {};
    for (const key in item) {
      if (headers[key]) {
        newItem[headers[key]] = item[key];
      }
    }
    return newItem;
  });

  // 4. 创建工作簿和工作表
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(dataToExport);

  // 5. 美化一下表格 (可选)
  worksheet["!cols"] = [
    { wch: 10 }, // 用户ID列宽
    { wch: 15 }, // 姓名的列宽
    { wch: 20 }, // 城市的列宽
    { wch: 20 }, // 日期的列宽
  ];

  // 6. 把工作表加到工作簿里，并命名
  XLSX.utils.book_append_sheet(workbook, worksheet, "用户数据");

  // 7. 导出文件！
  XLSX.writeFile(workbook, "用户数据报表.xlsx");
};
</script>

<style scoped>
.export-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background-color: #fff;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}
.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
}
.data-table th,
.data-table td {
  border: 1px solid #cbd5e0;
  padding: 0.75rem;
  text-align: left;
}
.data-table th {
  background-color: #f7fafc;
}
.export-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  background-color: #42b983;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}
.export-button:hover {
  background-color: #36a476;
}
</style>
```

[![](https://code.ifrontend.net/wp-content/themes/modown/static/img/imging.gif)](https://code.ifrontend.net/wp-content/uploads/2025/09/06090224792-1024x757.png?v=1757149345)

---

## ⬆️ 功能二：从 Excel 到网页，轻松导入！

让用户上传一个 Excel，然后把里面的数据读出来，这个功能也超实用！

#### 实现思路

1. 用 `<input type="file">` 让用户选文件。
2. 用 `FileReader` 读取文件。
3. 文件读完后，用 `XLSX.read()` 解析它。
4. 从里面拿出第一个工作表。
5. 用 `XLSX.utils.sheet_to_json()` 把工作表变成我们最爱的 JSON 格式！

#### 上代码 (`ImportExcel.vue`)

```
<template>
  <div class="import-container">
    <h3>👆 数据导入示例</h3>
    <p>请选择一个 Excel 文件，数据会立刻显示在下方。</p>

    <input
      type="file"
      @change="handleFileUpload"
      accept=".xlsx, .xls"
      class="file-input"
    />

    <div v-if="importedData.length > 0" class="table-wrapper">
      <h4>导入的数据预览：</h4>
      <table class="data-table">
        <thead>
          <tr>
            <th
              v-for="(header, index) in Object.keys(importedData[0])"
              :key="index"
            >
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in importedData" :key="rowIndex">
            <td v-for="(cell, cellIndex) in row" :key="cellIndex">
              {{ cell }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import * as XLSX from "xlsx";

const importedData = ref([]);

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array", cellDates: true });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // 关键一步：将工作表转为 JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });

    importedData.value = jsonData;
    console.log("导入成功:", jsonData);
  };

  reader.readAsArrayBuffer(file);
};
</script>

<style scoped>
.import-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background-color: #fff;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}
.file-input {
  margin-bottom: 1.5rem;
  padding: 0.5rem;
  border: 1px solid #cbd5e0;
  border-radius: 0.375rem;
}
.table-wrapper {
  max-height: 400px;
  overflow-y: auto;
}
/* 复用上面的 .data-table 样式 */
.data-table {
  width: 100%;
  border-collapse: collapse;
}
.data-table th,
.data-table td {
  border: 1px solid #cbd5e0;
  padding: 0.75rem;
  text-align: left;
}
.data-table th {
  background-color: #f7fafc;
  position: sticky;
  top: 0;
}
</style>
```

> **划重点**：解析数据时，记得加上 `cellDates: true` 和 `raw: false` 这两个选项，它们能帮你把 Excel 里的日期正确地转成日期字符串，而不是一串奇怪的数字！

---

## 总结：你也是 Excel 大师了！

看吧，是不是超级简单？

通过 `xlsx` 这个神器，我们只用纯前端代码就搞定了 Excel 的导入和导出。从此以后，再也不用看后端大哥的脸色啦！

你已经掌握了基本操作，快去你的项目里大展身手吧！无论是做数据看板、报表系统还是批量上传工具，这个技能都能让你的应用瞬间高大上起来。
