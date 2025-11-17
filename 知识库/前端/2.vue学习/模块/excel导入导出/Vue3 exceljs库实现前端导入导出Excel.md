![](https://oss.cuiliangblog.cn/image/logo.png)

# Vue3 exceljs库实现前端导入导出Excel

前端入门简介编程开发2024-02-25 13:42:071666202

# 前言

## 需求场景

最近在开发项目时需要批量导入和导出Excel数据，在实现这个需求时，我们既可以在前端完成数据解析和文件生成工作，也可以通过前端发起导入以及导出请求后，后端实现解析文件流解析文件内容以及生成文件并提供下载链接的功能。  
相较于后端处理Excel数据而言，使用前端导入导出可以提供更高的实时性，用户可以直接在浏览器中触发导出操作，无需等待后端处理。且可以在前端完成数据生成以及数据校验处理工作，大大减轻后端服务器的压力，大幅增强用户体验。  
具体的技术方案选型主要看业务场景，如果对于小型数据集、实时性需求较高的导入导出操作，优先考虑前端实现。而对于大型数据集、需要业务逻辑处理、以及安全性要求高的场景，则后端处理更为合适。

## 技术方案

xlsx与xlsx-style组合方案：xlsx 是目前前端最常用的Excel解决方案，又叫做SheetJS，但社区版不支持修改Excel的样式，需要购买Pro版才可以，如果需要修改导出的Excel文件样式，需要结合xlsx-style库一起使用。但遗憾的是xlsx库已经两年多不更新，而xlsx-style上一个版本更是8年前发布，目前已经不再推荐使用该方案。  
exceljs与file-saver方案：exceljs是一款免费开源支持导入导出Excel 操作工具，并且可以实现样式的修改以及 Excel 的高级功能，是非常值得推荐的一个处理 Excel 的库，file-saver可以实现保存文件到本地。本文以exceljs与file-saver操作xlsx格式文件为例介绍如何具体上手使用。

## exceljs介绍

ExcelJS是一个用于在Node.js和浏览器中创建、读取和修改Excel文件的强大JavaScript库。它提供了丰富的功能和灵活的API，使你能够在你的应用程序中处理和操作Excel文件。  
下面是一些ExcelJS库的关键特性和功能：

1. 创建和修改Excel文件：ExcelJS允许你创建新的Excel工作簿，并在其中添加工作表、行和单元格。你可以设置单元格的值、样式、数据类型以及其他属性。
2. 读取和解析Excel文件：ExcelJS支持读取和解析现有的Excel文件。你可以将Excel文件加载到工作簿中，然后访问工作表、行和单元格的数据。
3. 导出和保存Excel文件：ExcelJS可以将工作簿保存为Excel文件，支持多种格式，如XLSX、XLS和CSV。你可以将工作簿保存到本地文件系统或将其发送到客户端以供下载。
4. 处理复杂的Excel功能：ExcelJS支持处理复杂的Excel功能，如公式、图表、数据验证、条件格式和保护工作表等。你可以根据需要设置和操作这些功能。
5. 支持自定义样式和格式：ExcelJS允许你自定义单元格、行、列和工作表的样式和格式。你可以设置字体、颜色、填充、边框、对齐方式以及数字和日期格式等。

## 参考文档

npm仓库地址：[https://www.npmjs.com/package/exceljs](https://www.npmjs.com/package/exceljs)  
官方中文文档地址：[https://github.com/exceljs/exceljs/blob/HEAD/README_zh.md](https://github.com/exceljs/exceljs/blob/HEAD/README_zh.md)

# 快速上手

## 安装依赖

exceljs用于Excel数据处理，file-sever用于保存到本地文件。

```
npm i exceljs
npm i file-saver
```

  
## 导出Excel

让我们先从简单的数据导出开始，快速体验如何使用exceljs导出Excel文件，需要注意的是在浏览器环境中运行 JavaScript，浏览器的安全策略通常不允许直接访问读写本地文件系统。在这种情况下，需要通过其他方式将文件转换为buffer数据，在导出Excel时使用FileSaver.js库将缓冲区数据保存到文件中。

```
<template>
  <el-button type="primary" @click="exportExcel">导出excel</el-button>
</template>

<script setup>
import ExcelJS from "exceljs";
import FileSaver from "file-saver";
// 导出excel文件
const exportExcel = () => {
  // 创建工作簿
  const workbook = new ExcelJS.Workbook();
  // 添加工作表，名为sheet1
  const sheet1 = workbook.addWorksheet("sheet1");
  // 导出数据列表
  const data = [
    {"姓名": "张三", "年龄": 18, "身高": 175, "体重": 74},
    {"姓名": "李四", "年龄": 22, "身高": 177, "体重": 84},
    {"姓名": "王五", "年龄": 53, "身高": 155, "体重": 64}
  ]
  // 获取表头所有键
  const headers = Object.keys(data[0])
  // 将标题写入第一行
  sheet1.addRow(headers);
  // 将数据写入工作表
  data.forEach((row) => {
    const values = Object.values(row)
    sheet1.addRow(values);
  });
  // 导出表格文件
  workbook.xlsx.writeBuffer().then((buffer) => {
    let file = new Blob([buffer], {type: "application/octet-stream"});
    FileSaver.saveAs(file, "ExcelJS.xlsx");
  }).catch(error => console.log('Error writing excel export', error))
}
</script>

<style scoped lang="scss">

</style>
```


当我们点击导出excel按钮时，调用exportFile函数，完成excel文件下载，下载后的文件内容如下：  
![image.png](https://api.cuiliangblog.cn/v1/public/imgProxy/?url=https://cdn.nlark.com/yuque/0/2024/png/2308212/1708005274640-47e80e84-aa55-4869-be54-32038250f5de.png#averageHue=%23505050&clientId=uc7b3e3e4-7be0-4&from=paste&height=360&id=u357385b4&originHeight=720&originWidth=1300&originalType=binary&ratio=2&rotation=0&showTitle=false&size=143658&status=done&style=none&taskId=ua5d52691-4b69-4be6-a661-caa53d5d5ed&title=&width=650)

## 导入Excel

导入excel文件时，同样使用FileReader的readAsArrayBuffer方法，将文件转换为二进制字符串，然后从buffer中加载数据并解析。

```
<template>
  <input
      type="file"
      accept=".xls,.xlsx"
      class="upload-file"
      @change="importExcel($event)"/>
</template>

<script setup>
import ExcelJS from "exceljs";
// 导出excel文件
const importExcel = (event) => {
  //获取选择的文件
  const files = event.target.files
  //创建Workbook实例
  const workbook = new ExcelJS.Workbook();
  // 使用FileReader对象来读取文件内容
  const fileReader = new FileReader()
  // 二进制字符串的形式加载文件
  fileReader.readAsArrayBuffer(files[0])
  fileReader.onload = ev => {
    console.log(ev)
    // 从 buffer中加载数据解析
    workbook.xlsx.load(ev.target.result).then(workbook => {
      // 获取第一个worksheet内容
      const worksheet = workbook.getWorksheet(1);
      // 获取第一行的标题
      const headers = [];
      worksheet.getRow(1).eachCell((cell) => {
        headers.push(cell.value);
      });
      console.log("headers", headers)
      // 创建一个空的JavaScript对象数组，用于存储解析后的数据
      const data = [];
      // 遍历工作表的每一行（从第二行开始，因为第一行通常是标题行）
      for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
        const rowData = {};
        const row = worksheet.getRow(rowNumber);
        // 遍历当前行的每个单元格
        row.eachCell((cell, colNumber) => {
          // 获取标题对应的键，并将当前单元格的值存储到相应的属性名中
          rowData[headers[colNumber - 1]] = cell.value;
        });
        // 将当前行的数据对象添加到数组中
        data.push(rowData);
      }
      console.log("data", data)
    })
  }
}
</script>

<style scoped lang="scss">

</style>
```

  
上传文件后，解析内容如下所示：  
![image.png](https://api.cuiliangblog.cn/v1/public/imgProxy/?url=https://cdn.nlark.com/yuque/0/2024/png/2308212/1708004112419-f5ecc827-19fc-480c-aabb-b27dde1799be.png#averageHue=%231f1f1f&clientId=uc7b3e3e4-7be0-4&from=paste&height=855&id=u8694dca5&originHeight=1710&originWidth=3360&originalType=binary&ratio=2&rotation=0&showTitle=false&size=618898&status=done&style=none&taskId=ud15bbad5-f3a7-417d-b43f-2a309423d95&title=&width=1680)

# 进阶操作

## 添加数据

我们可以通过columns方法添加列标题并定义列键和宽度，设置好表头后，我们可以直接通过addRow方法，根据key值去添加每一行的数据。  
参考文档：[https://github.com/exceljs/exceljs/blob/HEAD/README_zh.md#%E5%88%97](https://github.com/exceljs/exceljs/blob/HEAD/README_zh.md#%E5%88%97)  
完整代码如下：

```
<template>
  <el-button type="primary" @click="exportExcel">导出excel</el-button>
</template>

<script setup>
import ExcelJS from "exceljs";
import FileSaver from "file-saver";
// 导出excel文件
const exportExcel = () => {
  // 创建工作簿
  const workbook = new ExcelJS.Workbook();
  // 添加工作表，名为sheet1
  const sheet1 = workbook.addWorksheet("sheet1");
  // 添加表头列数据
  sheet1.columns = [
    {header: "姓名", key: "name", width: 20},
    {header: "年龄", key: "age", width: 10},
    {header: "身高", key: "height", width: 10},
    {header: "体重", key: "weight", width: 10},
  ];
  // 添加内容列数据
  sheet1.addRow({sort: 1, name: "张三", age: 18, height: 175, weight: 74});
  sheet1.addRow({sort: 2, name: "李四", age: 22, height: 177, weight: 88});
  sheet1.addRow({sort: 3, name: "王五", age: 53, height: 155, weight: 62});
  // 导出表格文件
  workbook.xlsx.writeBuffer().then((buffer) => {
    let file = new Blob([buffer], {type: "application/octet-stream"});
    FileSaver.saveAs(file, "ExcelJS.xlsx");
  }).catch(error => console.log('Error writing excel export', error))
}

</script>

<style scoped lang="scss">

</style>
```

添加数据后导出文件效果如下：  
![image.png](https://api.cuiliangblog.cn/v1/public/imgProxy/?url=https://cdn.nlark.com/yuque/0/2024/png/2308212/1708224755150-6014b54c-87da-41ce-92e4-fe0e28923417.png#averageHue=%23f4f4f4&clientId=uc7b3e3e4-7be0-4&from=paste&height=564&id=ub49902d1&originHeight=1128&originWidth=1690&originalType=binary&ratio=2&rotation=0&showTitle=false&size=348763&status=done&style=none&taskId=u8b31b9bf-d5b3-442f-9cac-5d393355140&title=&width=845)

## 读取数据

我们可以使用getRow方法，传入指定行参数读取行数据。  
使用getColumn方法，传入键、字母、id参数读取列数据。  
使用eachCell方法可以遍历每个单元格内容。  
参考文档：[https://github.com/exceljs/exceljs/blob/HEAD/README_zh.md#%E8%A1%8C](https://github.com/exceljs/exceljs/blob/HEAD/README_zh.md#%E8%A1%8C)  
代码如下：

```
<template>
  <el-button type="primary" @click="exportExcel">导出excel</el-button>
</template>

<script setup>
import ExcelJS from "exceljs";
import FileSaver from "file-saver";
// 导出excel文件
const exportExcel = () => {
  // 创建工作簿
  const workbook = new ExcelJS.Workbook();
  // 添加工作表，名为sheet1
  const sheet1 = workbook.addWorksheet("sheet1");
  // 添加表头列数据
  sheet1.columns = [
    {header: "姓名", key: "name", width: 20},
    {header: "年龄", key: "age", width: 10},
    {header: "身高", key: "height", width: 10},
    {header: "体重", key: "weight", width: 10},
  ];
  // 添加内容列数据
  sheet1.addRow({sort: 1, name: "张三", age: 18, height: 175, weight: 74});
  sheet1.addRow({sort: 2, name: "李四", age: 22, height: 177, weight: 88});
  sheet1.addRow({sort: 3, name: "王五", age: 53, height: 155, weight: 62});
  // 读取行数据
  sheet1.getRow(1).eachCell((cell, rowIdx) => {
    console.log("行数据", cell.value, rowIdx);
  });
  // 读取列数据,可以通过键(name)，字母(B)和基于id(1)的列号访问单个列
  sheet1.getColumn("name").eachCell((cell, rowIdx) => {
    console.log("列数据", cell.value, rowIdx);
  });
}

</script>

<style scoped lang="scss">

</style>
```


效果  
![image.png](https://api.cuiliangblog.cn/v1/public/imgProxy/?url=https://cdn.nlark.com/yuque/0/2024/png/2308212/1708225008969-46df0ddc-781e-4176-a49b-68f1f08cc1ea.png#averageHue=%23f7f7f7&clientId=uc7b3e3e4-7be0-4&from=paste&height=268&id=u688e2f7b&originHeight=536&originWidth=642&originalType=binary&ratio=2&rotation=0&showTitle=false&size=49073&status=done&style=none&taskId=ua74cda31-40b7-49cc-b1c1-b3f4e686e14&title=&width=321)

## 样式

在导出excel文件时，默认没有任何样式的，为了美观我们需要添加样式，而exceljs支持修改表格样式，具体内容可参考文档[https://github.com/exceljs/exceljs/blob/HEAD/README_zh.md#%E6%A0%B7%E5%BC%8F](https://github.com/exceljs/exceljs/blob/HEAD/README_zh.md#%E6%A0%B7%E5%BC%8F)  
例如，我们需要设置所有单元格居中对齐，并添加边框。并分别指定标题行和内容行字体大小、背景颜色、行高属性，代码如下：

```
<template>
  <el-button type="primary" @click="exportExcel">导出excel</el-button>
</template>

<script setup>
import ExcelJS from "exceljs";
import FileSaver from "file-saver";
// 导出excel文件
const exportExcel = () => {
  // 创建工作簿
  const workbook = new ExcelJS.Workbook();
  // 添加工作表，名为sheet1
  const sheet1 = workbook.addWorksheet("sheet1");
  // 导出数据列表
  const data = [
    {"姓名": "张三", "年龄": 18, "身高": 175, "体重": 74},
    {"姓名": "李四", "年龄": 22, "身高": 177, "体重": 84},
    {"姓名": "王五", "年龄": 53, "身高": 155, "体重": 64}
  ]
  // 获取表头所有键
  const headers = Object.keys(data[0])
  // 将标题写入第一行
  sheet1.addRow(headers);
  // 将数据写入工作表
  data.forEach((row) => {
    const values = Object.values(row)
    sheet1.addRow(values);
  });
  // 修改所有单元格样式
  // 遍历每一行
  sheet1.eachRow((row, rowNumber) => {
    // 遍历每个单元格
    row.eachCell((cell) => {
      // 设置边框样式
      cell.border = {
        top: {style: 'thin'},
        left: {style: 'thin'},
        bottom: {style: 'thin'},
        right: {style: 'thin'}
      };
      // 设置居中对齐
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center'
      };
    });
  });
  // 获取标题行数据
  const titleCell = sheet1.getRow(1);
  // 设置行高为30
  titleCell.height = 30
  // 设置标题行单元格样式
  titleCell.eachCell((cell) => {
    // 设置标题行背景颜色为黄色
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: 'FFFF00'}
    };
    // 设置标题行字体
    cell.font = {
      color: {argb: 'FF0000'}, //颜色为红色
      bold: true,// 字体粗体
      size: 18 // 设置字体大小为18
    };
  })
  // 获取第二行到最后一行的内容数据
  const bodyRows = sheet1.getRows(2, sheet1.rowCount);
  // 处理内容行的数据
  bodyRows.forEach((bodyRow) => {
    // 设置行高为20
    bodyRow.height = 20
    bodyRow.eachCell((cell) => {
      cell.font = {
        size: 16 // 设置内容行字体大小为16
      };
    });
  });
  // 导出表格文件
  workbook.xlsx.writeBuffer().then((buffer) => {
    let file = new Blob([buffer], {type: "application/octet-stream"});
    FileSaver.saveAs(file, "ExcelJS.xlsx");
  }).catch(error => console.log('Error writing excel export', error))
}

</script>

<style scoped lang="scss">

</style>
```


导出Excel样式效果如下所示，已经成功按我们指定的样式导出了文件：  
![image.png](https://api.cuiliangblog.cn/v1/public/imgProxy/?url=https://cdn.nlark.com/yuque/0/2024/png/2308212/1708155905339-a50d29a1-7142-4450-8ca8-de0cd6abdb98.png#averageHue=%23f2f1e6&clientId=uc7b3e3e4-7be0-4&from=paste&height=462&id=ubbc01f71&originHeight=924&originWidth=830&originalType=binary&ratio=2&rotation=0&showTitle=false&size=172199&status=done&style=none&taskId=u7887cbbf-f73c-40c6-8af7-9e3431ffa03&title=&width=415)

## 筛选

在很多的时候我们需要对表格中每一列的数据进行筛选，比如直接筛选姓名等列信息，我们可以通过 autoFilter 来添加筛选。参考文档：[https://github.com/exceljs/exceljs/blob/HEAD/README_zh.md#%E8%87%AA%E5%8A%A8%E7%AD%9B%E9%80%89%E5%99%A8](https://github.com/exceljs/exceljs/blob/HEAD/README_zh.md#%E8%87%AA%E5%8A%A8%E7%AD%9B%E9%80%89%E5%99%A8)  
代码如下：

```
<template>
  <el-button type="primary" @click="exportExcel">导出excel</el-button>
</template>

<script setup>
import ExcelJS from "exceljs";
import FileSaver from "file-saver";
// 导出excel文件
const exportExcel = () => {
  // 创建工作簿
  const workbook = new ExcelJS.Workbook();
  // 添加工作表，名为sheet1
  const sheet1 = workbook.addWorksheet("sheet1");
  // 导出数据列表
  const data = [
    {"姓名": "张三", "年龄": 18, "身高": 175, "体重": 74},
    {"姓名": "李四", "年龄": 22, "身高": 177, "体重": 84},
    {"姓名": "王五", "年龄": 53, "身高": 155, "体重": 64}
  ]
  // 获取表头所有键
  const headers = Object.keys(data[0])
  // 将标题写入第一行
  sheet1.addRow(headers);
  // 将数据写入工作表
  data.forEach((row) => {
    const values = Object.values(row)
    sheet1.addRow(values);
  });
  // 单列筛选
  // sheet1.autoFilter = "A1";
  // 多个列筛选
  sheet1.autoFilter = "A1:C1";
  // 导出表格文件
  workbook.xlsx.writeBuffer().then((buffer) => {
    let file = new Blob([buffer], {type: "application/octet-stream"});
    FileSaver.saveAs(file, "ExcelJS.xlsx");
  }).catch(error => console.log('Error writing excel export', error))
}

</script>

<style scoped lang="scss">

</style>
```


导入后的效果如下，在姓名、年龄、身高列添加了筛选按钮：  
![image.png](https://api.cuiliangblog.cn/v1/public/imgProxy/?url=https://cdn.nlark.com/yuque/0/2024/png/2308212/1708156238044-bc14c993-5c9e-4b36-9bc6-e31b8e154216.png#averageHue=%23f2f1f1&clientId=uc7b3e3e4-7be0-4&from=paste&height=697&id=u5adc646e&originHeight=1394&originWidth=1228&originalType=binary&ratio=2&rotation=0&showTitle=false&size=439570&status=done&style=none&taskId=u963d1bdc-7b4e-41b7-b569-bb125f69046&title=&width=614)

## 公式值

参考文档：[https://github.com/exceljs/exceljs/blob/HEAD/README_zh.md#%E5%80%BC%E7%B1%BB%E5%9E%8B](https://github.com/exceljs/exceljs/blob/HEAD/README_zh.md#%E5%80%BC%E7%B1%BB%E5%9E%8B)  
我们可以直接对表格中的数据进行公式计算，比如 求和(SUM)，平均数(AVERAGE) 等。  
例如我们需要计算平均值、最大值、指定公式时，代码如下：

```
<template>
  <el-button type="primary" @click="exportExcel">导出excel</el-button>
</template>

<script setup>
import ExcelJS from "exceljs";
import FileSaver from "file-saver";
// 导出excel文件
const exportExcel = () => {
  // 创建工作簿
  const workbook = new ExcelJS.Workbook();
  // 添加工作表，名为sheet1
  const sheet1 = workbook.addWorksheet("sheet1");
  // 导出数据列表
  const data = [
    {"姓名": "张三", "年龄": 18, "身高": 1.75, "体重": 74},
    {"姓名": "李四", "年龄": 22, "身高": 1.77, "体重": 84},
    {"姓名": "王五", "年龄": 53, "身高": 1.55, "体重": 64}
  ]
  // 获取表头所有键
  const headers = Object.keys(data[0])
  // 将标题写入第一行
  sheet1.addRow(headers);
  // 将数据写入工作表
  data.forEach((row) => {
    const values = Object.values(row)
    sheet1.addRow(values);
  });
  // 添加单元格
  sheet1.getCell("E1").value = "BMI指数";
  sheet1.getCell("F1").value = "平均身高";
  sheet1.getCell("G1").value = "最大体重";
  // 计算平均身高
  sheet1.getCell("F2").value = {formula: "=AVERAGE(C2:C4)"};
  // 计算最大体重
  sheet1.getCell("G2").value = {formula: "=MAX(D2:D4)"};
  // 计算BMI指数
  // 获取第5列对象
  const BMIRange = sheet1.getColumn(5)
  BMIRange.eachCell((cell) => {
    console.log("cell", cell)
    console.log(cell.row)
    // 从第二列开始添加计算公式
    if (cell.row >= 2) {
      sheet1.getCell("E" + cell.row).value = {formula: "D" + cell.row + "/" + "(C" + cell.row + "*" + "C" + cell.row + ")"};
    }
  })
  // 导出表格文件
  workbook.xlsx.writeBuffer().then((buffer) => {
    let file = new Blob([buffer], {type: "application/octet-stream"});
    FileSaver.saveAs(file, "ExcelJS.xlsx");
  }).catch(error => console.log('Error writing excel export', error))
}

</script>

<style scoped lang="scss">

</style>
```

  
导出Excel文件效果如下，E列已经自动替换为公式计算。  
![image.png](https://api.cuiliangblog.cn/v1/public/imgProxy/?url=https://cdn.nlark.com/yuque/0/2024/png/2308212/1708158996852-a5031ee6-80f9-49b6-9fe0-4b13dd84ce66.png#averageHue=%23f3f2f2&clientId=uc7b3e3e4-7be0-4&from=paste&height=565&id=u7d12da3f&originHeight=1130&originWidth=1626&originalType=binary&ratio=2&rotation=0&showTitle=false&size=338694&status=done&style=none&taskId=u46c8745e-32c3-4019-bad7-4e13a519fe0&title=&width=813)

## 合并单元格

表格的合并应该是业务需求中最频繁的功能。当然这一功能使用 xlsx 也可以实现，我们只需要使用mergeCells方法，传入合并单元格范围参数即可。  
参考文档：[https://github.com/exceljs/exceljs/blob/HEAD/README_zh.md#%E5%90%88%E5%B9%B6%E5%8D%95%E5%85%83%E6%A0%BC](https://github.com/exceljs/exceljs/blob/HEAD/README_zh.md#%E5%90%88%E5%B9%B6%E5%8D%95%E5%85%83%E6%A0%BC)  
具体代码实现如下所示：

```
<template>
  <el-button type="primary" @click="exportExcel">导出excel</el-button>
</template>

<script setup>
import ExcelJS from "exceljs";
import FileSaver from "file-saver";
// 导出excel文件
const exportExcel = () => {
  // 创建工作簿
  const workbook = new ExcelJS.Workbook();
  // 添加工作表，名为sheet1
  const sheet1 = workbook.addWorksheet("sheet1");
  // 导出数据列表
  const data = [
    {"姓名": "张三", "年龄": 18, "身高": 175, "体重": 74},
    {"姓名": "李四", "年龄": 18, "身高": '未知', "体重": '未知'},
    {"姓名": "王五", "年龄": 53, "身高": '未知', "体重": '未知'},
    {"姓名": "赵六", "年龄": 12, "身高": '未知', "体重": '未知'}
  ]
  // 获取表头所有键
  const headers = Object.keys(data[0])
  // 将标题写入第一行
  sheet1.addRow(headers);
  // 将数据写入工作表
  data.forEach((row) => {
    const values = Object.values(row)
    sheet1.addRow(values);
  });
  // 上下合并单元格
  sheet1.mergeCells("B2:B3");
  // 左右合并单元格
  sheet1.mergeCells("C3:D3");
  // 范围合并单元格
  sheet1.mergeCells("C4:D5");
  // 导出表格文件
  workbook.xlsx.writeBuffer().then((buffer) => {
    let file = new Blob([buffer], {type: "application/octet-stream"});
    FileSaver.saveAs(file, "ExcelJS.xlsx");
  }).catch(error => console.log('Error writing excel export', error))
}

</script>

<style scoped lang="scss">

</style>

```


单元格合并后导出文件效果如下：  
![image.png](https://api.cuiliangblog.cn/v1/public/imgProxy/?url=https://cdn.nlark.com/yuque/0/2024/png/2308212/1708157264321-5a0c4cd2-2e3f-4f74-b4d8-38cc1f20903e.png#averageHue=%23f4f4f4&clientId=uc7b3e3e4-7be0-4&from=paste&height=449&id=u6cf6d475&originHeight=898&originWidth=1330&originalType=binary&ratio=2&rotation=0&showTitle=false&size=229200&status=done&style=none&taskId=u5311c52f-72da-43bf-900f-b1c30095c6b&title=&width=665)

## 数据验证

有时候我们需要为某个单元格添加数据可以方便直接下拉选择指定的值，此时就需要使用数据验证功能，传入可填写的选项列表。  
参考文档：[https://github.com/exceljs/exceljs/blob/HEAD/README_zh.md#%E6%95%B0%E6%8D%AE%E9%AA%8C%E8%AF%81](https://github.com/exceljs/exceljs/blob/HEAD/README_zh.md#%E6%95%B0%E6%8D%AE%E9%AA%8C%E8%AF%81)  
例如我们对是否注册列添加数据验证，可填值为"是、否、未知"，具体代码如下：

```
<template>
  <el-button type="primary" @click="exportExcel">导出excel</el-button>
</template>

<script setup>
import ExcelJS from "exceljs";
import FileSaver from "file-saver";
// 导出excel文件
const exportExcel = () => {
  // 创建工作簿
  const workbook = new ExcelJS.Workbook();
  // 添加工作表，名为sheet1
  const sheet1 = workbook.addWorksheet("sheet1");
  // 导出数据列表
  const data = [
    {"姓名": "张三", "年龄": 18, "身高": 1.75, "体重": 74, "是否注册": ''},
    {"姓名": "李四", "年龄": 22, "身高": 1.77, "体重": 84, "是否注册": ''},
    {"姓名": "王五", "年龄": 53, "身高": 1.55, "体重": 64, "是否注册": ''}
  ]
  // 获取表头所有键
  const headers = Object.keys(data[0])
  // 将标题写入第一行
  sheet1.addRow(headers);
  // 将数据写入工作表
  data.forEach((row) => {
    const values = Object.values(row)
    sheet1.addRow(values);
  });
  // 获取第5列对象
  const VerificationRange = sheet1.getColumn(5)
  VerificationRange.eachCell((cell) => {
    // 从第二列开始添加数据验证规则
    if (cell.row >= 2) {
      sheet1.getCell("E" + cell.row).dataValidation = {
        type: "list",
        allowBlank: true,
        formulae: ['"是,否,未知"']
      };
    }
  })
  // 导出表格文件
  workbook.xlsx.writeBuffer().then((buffer) => {
    let file = new Blob([buffer], {type: "application/octet-stream"});
    FileSaver.saveAs(file, "ExcelJS.xlsx");
  }).catch(error => console.log('Error writing excel export', error))
}

</script>

<style scoped lang="scss">

</style>

```


导出的excel文件效果如下：  
![image.png](https://api.cuiliangblog.cn/v1/public/imgProxy/?url=https://cdn.nlark.com/yuque/0/2024/png/2308212/1708159459555-4d92d8bf-c2e8-4a6d-ac7c-8e4fc1fcb917.png#averageHue=%23f3f3f3&clientId=uc7b3e3e4-7be0-4&from=paste&height=568&id=u4c6735ea&originHeight=1136&originWidth=1738&originalType=binary&ratio=2&rotation=0&showTitle=false&size=356329&status=done&style=none&taskId=u36a5e302-edcf-4486-b80b-bbc6418dc81&title=&width=869)

## 条件格式化

我们可以为指定单元格添加条件格式，对满足条件的单元格设置指定的样式。  
参考文档：[https://github.com/exceljs/exceljs/blob/HEAD/README_zh.md#%E6%9D%A1%E4%BB%B6%E6%A0%BC%E5%BC%8F%E5%8C%96](https://github.com/exceljs/exceljs/blob/HEAD/README_zh.md#%E6%9D%A1%E4%BB%B6%E6%A0%BC%E5%BC%8F%E5%8C%96)  
例如为年龄大于18岁单元格进行红色标注，代码如下：

```
<template>
  <el-button type="primary" @click="exportExcel">导出excel</el-button>
</template>

<script setup>
import ExcelJS from "exceljs";
import FileSaver from "file-saver";
// 导出excel文件
const exportExcel = () => {
  // 创建工作簿
  const workbook = new ExcelJS.Workbook();
  // 添加工作表，名为sheet1
  const sheet1 = workbook.addWorksheet("sheet1");
  // 导出数据列表
  const data = [
    {"姓名": "张三", "年龄": 18, "身高": 1.75, "体重": 74},
    {"姓名": "李四", "年龄": 22, "身高": 1.77, "体重": 84},
    {"姓名": "王五", "年龄": 53, "身高": 1.55, "体重": 64}
  ]
  // 获取表头所有键
  const headers = Object.keys(data[0])
  // 将标题写入第一行
  sheet1.addRow(headers);
  // 将数据写入工作表
  data.forEach((row) => {
    const values = Object.values(row)
    sheet1.addRow(values);
  });
  // 年龄大于18岁红色标注
  sheet1.addConditionalFormatting({
    ref: "B2:B4",
    rules: [
      {
        type: "cellIs",
        operator: "greaterThan",
        priority: 1,
        formulae: [18],
        style: {
          fill: {
            type: "pattern",
            pattern: "solid",
            bgColor: { argb: "FFFFC0CB" },
          },
        },
      },
    ],
  });
  // 导出表格文件
  workbook.xlsx.writeBuffer().then((buffer) => {
    let file = new Blob([buffer], {type: "application/octet-stream"});
    FileSaver.saveAs(file, "ExcelJS.xlsx");
  }).catch(error => console.log('Error writing excel export', error))
}

</script>

<style scoped lang="scss">

</style>
```


导出后的文件效果如下：  
![image.png](https://api.cuiliangblog.cn/v1/public/imgProxy/?url=https://cdn.nlark.com/yuque/0/2024/png/2308212/1708225396935-9c06a50c-16af-4a38-96aa-4f805775edbb.png#averageHue=%23f3f3f3&clientId=uc7b3e3e4-7be0-4&from=paste&height=565&id=u82ac363b&originHeight=1130&originWidth=1642&originalType=binary&ratio=2&rotation=0&showTitle=false&size=328756&status=done&style=none&taskId=u799bfdcf-e4ef-4f7e-9bc6-5c6104a9611&title=&width=821)

# 封装exceljs

## 封装导入导出函数

为了提高项目代码的复用性，通常会将excel导入导出功能封装到单独的函数中方便调用，封装后的函数如下：

```
import ExcelJS from "exceljs";
import FileSaver from "file-saver";
import {timeFile} from "@/utils/timeFormat";
// 导出excel文件
export function exportFile(export_data, filename) {
    // 创建工作簿
    const workbook = new ExcelJS.Workbook();
    // 添加工作表，名为sheet1
    const sheet1 = workbook.addWorksheet("sheet1");
    // 获取表头所有键
    const headers = Object.keys(export_data[0])
    // 将标题写入第一行
    sheet1.addRow(headers);
    // 将数据写入工作表
    export_data.forEach((row) => {
        const values = Object.values(row)
        sheet1.addRow(values);
    });
    // 设置默认宽高属性
    sheet1.properties.defaultColWidth = 20
    sheet1.properties.defaultRowHeight = 20
    // 修改所有单元格样式
    // 遍历每一行
    sheet1.eachRow((row, rowNumber) => {
        // 遍历每个单元格
        row.eachCell((cell) => {
            // 设置边框样式
            cell.border = {
                top: {style: 'thin'},
                left: {style: 'thin'},
                bottom: {style: 'thin'},
                right: {style: 'thin'}
            };
            // 设置居中对齐
            cell.alignment = {
                vertical: 'middle',
                horizontal: 'center'
            };
        });
    });
    // 获取标题行数据
    const titleCell = sheet1.getRow(1);
    // 设置标题行单元格样式
    titleCell.eachCell((cell) => {
        // 设置标题行背景颜色
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: '3498db'}
        };
        // 设置标题行字体
        cell.font = {
            bold: true,// 字体粗体
        };
    })
    // 导出表格文件
    workbook.xlsx.writeBuffer().then((buffer) => {
        let file = new Blob([buffer], {type: "application/octet-stream"});
        FileSaver.saveAs(file, filename + timeFile() + ".xlsx");
    }).catch(error => console.log('Error writing excel export', error))
}

// 导入excel文件
export function importFile(content) {
    return new Promise((resolve, reject) => {
        // 创建一个空的JavaScript对象数组，用于存储解析后的数据
        const data = [];
        //创建Workbook实例
        const workbook = new ExcelJS.Workbook();
        workbook.xlsx.load(content).then(workbook => {
            // 获取第一个worksheet内容
            const worksheet = workbook.getWorksheet(1);
            // 获取第一行的标题
            const headers = [];
            worksheet.getRow(1).eachCell((cell) => {
                headers.push(cell.value);
            });
            // console.log("headers", headers)
            // 遍历工作表的每一行（从第二行开始，因为第一行通常是标题行）
            for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
                const rowData = {};
                const row = worksheet.getRow(rowNumber);
                // 遍历当前行的每个单元格
                row.eachCell((cell, colNumber) => {
                    // 获取标题对应的键，并将当前单元格的值存储到相应的属性名中
                    rowData[headers[colNumber - 1]] = cell.value;
                });
                // 将当前行的数据对象添加到数组中
                data.push(rowData);
            }
            // console.log("data", data)
            resolve(data);
        }).catch(error => {
            reject(error);
        });
    })
}
```

  
## vue组件调用

以element plus为例，调用函数完成Excel文件导入与导出，代码如下：

```
<template>
  <el-button type="primary" @click="exportExcel">导出excel</el-button>
  <el-button type="success" @click="importExcel">导入excel</el-button>
  <p>导入数据预览</p>
  {{ uploadData}}
  <el-dialog
      v-model="uploadDialogVisible"
      title="批量添加数据"
      width="40%"
  >
    <el-form label-width="120px">
      <el-form-item label="模板下载：">
        <el-button type="info" @click="downloadTemplate">
          <el-icon>
            <Download/>
          </el-icon>
          点击下载
        </el-button>
      </el-form-item>
      <el-form-item label="文件上传：">
        <el-upload drag accept=".xls,.xlsx" :auto-upload="false" :on-change="handleChange">
          <el-icon class="el-icon--upload">
            <upload-filled/>
          </el-icon>
          <div class="el-upload__text">
            将文件拖到此处，或<em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              请上传.xls,.xlsx格式文件，文件最大为500kb
            </div>
          </template>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="uploadDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitUpload">
          导入
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {ref} from "vue";
import {ElMessage} from "element-plus";
import {Download, UploadFilled} from "@element-plus/icons-vue"
import {getDemo} from "@/api/home";
import {timeFormatConversion} from "@/utils/timeFormat";
import {exportFile, importFile} from "@/utils/excel";
// 表格字段配置
const fieldConfig = ref([
  {
    'label': 'ID', // 标签
    'model': 'id',// 字段名
    'is_export': true,// 是否导出该字段
  },
  {
    'label': '用户名', // 标签
    'model': 'username',// 字段名
    'is_export': true, // 是否导出该字段
  },
  {
    'label': '省份', // 标签
    'model': 'province',// 字段名
    'is_export': true // 是否导出该字段
  },
  {
    'label': '性别', // 标签
    'model': 'sex_name',// 字段名
    'is_export': true // 是否导出该字段
  },
  {
    'label': '生日', // 标签
    'model': 'birthday',// 字段名
    'is_export': true, // 是否导出该字段
  },
  {
    'label': '身高(cm)', // 标签
    'model': 'height',// 字段名
    'is_export': true, // 是否导出该字段
  },
  {
    'label': '体重(kg)', // 标签
    'model': 'weight',// 字段名
    'is_export': true,// 是否导出该字段
  },
  {
    'label': '注册时间', // 标签
    'model': 'created_time',// 字段名
    'is_export': true, // 是否导出该字段
  },
  {
    'label': '个人介绍', // 标签
    'model': 'introduction',// 字段名
    'is_export': true,// 是否导出该字段
  }
])
// 导出Excel事件
const exportExcel = () => {
  ElMessage({
    message: '开始导出数据，请稍候！',
    type: 'success',
  })
  // 导出数据查询参数
  const printParams = {
    'size': 1000,
    'page': 1,
  }
  // 获取需要导出的字段配置
  const export_fields = fieldConfig.value
      .filter(obj => obj['is_export'])
      .map(({label, model}) => ({[model]: label}))
  // 处理数据结构
  getDemo(printParams).then((response) => {
    // console.log(response.results)
    const export_data = response.results.map(obj => {
      const newObj = {};
      export_fields.forEach(field => {
        const [key, value] = Object.entries(field)[0];
        if (key === 'created_time') {
          newObj[value] = timeFormatConversion((obj[key]), 'YYYY-MM-DD HH:mm:ss');
        } else {
          newObj[value] = obj[key];
        }
      });
      return newObj;
    });
    let filename = '示例用户'
    exportFile(export_data, filename);
  }).catch(response => {
    //发生错误时执行的代码
    console.log(response)
    ElMessage.error('获取列表数据失败！')
  });
}
// 导入excel弹窗是否显示
const uploadDialogVisible = ref(false)
// 点击导入excel按钮事件
const importExcel = () => {
  uploadDialogVisible.value = true
}
// 下载模板文件
const downloadTemplate = () => {
  window.open('https://api.cuiliangblog.cn/static/demo-template.xlsx')
}
// 文件数据
const uploadData=ref([])
// 文件上传事件
const handleChange = (file) => {
  const reader = new FileReader();
  reader.onload = () => {
    const content = reader.result;
    importFile(content).then((data) => {
      console.log(data)
      uploadData.value = data
    }).catch(response => {
      //发生错误时执行的代码
      console.log(response)
      ElMessage.error('获取列表数据失败！')
    });
  };
  reader.readAsBinaryString(file.raw);
};
// 点击导入excel提交数据事件
const submitUpload = () => {
  uploadDialogVisible.value =false
}
</script>

<style scoped lang="scss">

</style>
```

  
## 页面效果

封装后的页面效果如下，至此，一个简单的vue前端实现Excel文件导入导出功能便开发完成了。  
![image.png](https://api.cuiliangblog.cn/v1/public/imgProxy/?url=https://cdn.nlark.com/yuque/0/2024/png/2308212/1708591258002-dfcdc518-34d5-46c8-9315-a5efd761db51.png#averageHue=%23b8b8b8&clientId=udfce7081-c385-4&from=paste&height=709&id=ub66b2734&originHeight=1418&originWidth=2380&originalType=binary&ratio=2&rotation=0&showTitle=false&size=164827&status=done&style=none&taskId=ufa6365c8-1b69-4198-a16c-7b14f3be7b9&title=&width=1190)

# 完整代码

gitee：[https://gitee.com/cuiliang0302/vue3_vite_element-plus](https://gitee.com/cuiliang0302/vue3_vite_element-plus)  
github：[https://github.com/cuiliang0302/vue3-vite-template](https://github.com/cuiliang0302/vue3-vite-template)

前后端分离项目实现SSE

文章分类： 前端

文章标签： 入门简介编程开发



